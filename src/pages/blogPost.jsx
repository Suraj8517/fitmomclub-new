import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { client, urlFor } from '../sanityclient'
import author from "../assets/home/fitmom.png"
const QUERY = `*[_type == "post" && slug.current == $slug][0]{
  title, publishedAt, mainImage, body,
  "author": author->name,
  "authorImage": author->image,
  "categories": categories[]->title,
  partNumber,
  difficultyLevel,
  "readTime": round(length(pt::text(body)) / 5 / 200)
}`

const injectCSS = `

  @keyframes shimmer   { 0%{background-position:-800px 0} 100%{background-position:800px 0} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes imgReveal { from{opacity:0;transform:scale(1.03)} to{opacity:1;transform:scale(1)} }

  .anim-1 { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
  .anim-2 { animation: fadeUp 0.5s 0.08s  cubic-bezier(.22,1,.36,1) both; }
  .anim-3 { animation: fadeUp 0.5s 0.16s  cubic-bezier(.22,1,.36,1) both; }
  .anim-4 { animation: fadeUp 0.5s 0.24s  cubic-bezier(.22,1,.36,1) both; }
  .anim-img { animation: imgReveal 0.9s 0.2s cubic-bezier(.22,1,.36,1) both; }

  .shimmer {
    background: linear-gradient(90deg,#eef6f4 25%,#e2efec 50%,#eef6f4 75%);
    background-size: 800px 100%;
    animation: shimmer 1.5s infinite linear;
    border-radius: 8px;
  }

  /* prose styles */
  .prose-content p  { font-size:1.025rem;line-height:1.85;color:#374151;margin-bottom:1.5em; }
  .prose-content h2 {
    font-family:'Instrument Serif',serif;
    font-size:clamp(1.4rem,2.8vw,1.85rem);font-weight:400;color:#111827;
    letter-spacing:-.02em;line-height:1.25;
    margin:3em 0 .75em;padding-bottom:.65em;
    border-bottom:1px solid #f3f4f6;
  }
  .prose-content h3 {
    font-family:'Instrument Serif',serif;
    font-size:1.2rem;font-weight:400;color:#111827;
    letter-spacing:-.015em;margin:2.5em 0 .6em;
  }
  .prose-content strong { color:#111827;font-weight:600; }
  .prose-content em    { font-style:italic;color:#6b7280; }
  .prose-content a     {
    color:#0a6c58;text-decoration:underline;
    text-underline-offset:3px;text-decoration-color:rgba(10,108,88,.25);
    font-weight:500;transition:text-decoration-color .15s;
  }
  .prose-content a:hover { text-decoration-color:#0a6c58; }
  .prose-content ul { list-style:none;padding:0;margin:0 0 1.6em; }
  .prose-content ul li {
    font-size:1.025rem;line-height:1.8;color:#374151;
    padding-left:1.4rem;position:relative;margin-bottom:.5em;
  }
  .prose-content ul li::before {
    content:'';position:absolute;left:0;top:11px;
    width:5px;height:5px;border-radius:50%;background:#5eae9d;
  }
  .prose-content ol { list-style:none;counter-reset:li;padding:0;margin:0 0 1.6em; }
  .prose-content ol li {
    counter-increment:li;
    font-size:1.025rem;line-height:1.8;color:#374151;
    padding-left:2.2rem;position:relative;margin-bottom:.5em;
  }
  .prose-content ol li::before {
    content:counter(li);
    position:absolute;left:0;top:2px;
    font-size:11px;font-weight:700;color:#0a6c58;line-height:1.85;
    background:#e6f3f0;border:1px solid #cde7e0;
    width:20px;height:20px;border-radius:6px;
    display:flex;align-items:center;justify-content:center;
  }
  .prose-content blockquote {
    margin:2em 0;padding:20px 24px;
    border-left:3px solid #5eae9d;
    background:#e6f3f0;border-radius:0 12px 12px 0;
  }
  .prose-content blockquote p { margin:0;font-style:italic;color:#085041; }
  .prose-content code {
    background:#f3f4f6;color:#0a6c58;
    padding:2px 7px;border-radius:6px;
    font-size:.85em;font-family:'Courier New',monospace;
    border:1px solid #e5e7eb;
  }
  .prose-content pre {
    background:#111827;border-radius:14px;
    padding:24px;overflow-x:auto;margin:2em 0;
  }
  .prose-content pre code { background:none;color:#e2e8f0;padding:0;font-size:.875rem;line-height:1.75;border:none; }
  .prose-content img { width:100%;border-radius:12px;margin:2em 0;border:1px solid #e5e7eb; }
`

function ProgressBar() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent">
      <div className="h-full bg-[#0a6c58] transition-[width] duration-75" style={{ width: `${pct}%` }} />
    </div>
  )
}

function Shimmer({ className = '' }) {
  return <div className={`shimmer ${className}`} />
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* nav */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-6">
        <Shimmer className="w-20 h-4" />
        <Shimmer className="w-16 h-8 !rounded-lg" />
      </div>
      {/* hero */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-0">
        <Shimmer className="w-24 h-6 !rounded-full mb-6" />
        <Shimmer className="w-4/5 h-12 mb-3" />
        <Shimmer className="w-3/5 h-12 mb-8" />
        <div className="flex items-center gap-3 py-4 border-y border-gray-100 mb-6">
          <Shimmer className="w-8 h-8 !rounded-full" />
          <Shimmer className="w-56 h-4" />
        </div>
        <div className="flex gap-3 mb-8">
          <Shimmer className="w-32 h-11 !rounded-xl" />
          <Shimmer className="w-28 h-11 !rounded-xl" />
        </div>
        <Shimmer className="w-full !rounded-2xl" style={{ aspectRatio: '16/8' }} />
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6">
        <div className="w-12 h-12 rounded-2xl bg-[#e6f3f0] border border-[#cde7e0] flex items-center justify-center mx-auto mb-4 text-xl">✦</div>
        <h2 className="font-display text-2xl font-normal text-gray-900 mb-2">Article not found</h2>
        <p className="text-sm text-gray-400 mb-6">This article may have moved or been removed.</p>
        <Link to="/blogs" className="inline-flex items-center gap-2 bg-[#0a6c58] hover:bg-[#085041] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors no-underline">
          ← All Articles
        </Link>
      </div>
    </div>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied]   = useState(false)

  useEffect(() => {
    client.fetch(QUERY, { slug }).then(data => {
      setPost(data)
      setLoading(false)
    })
  }, [slug])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href })
    } else {
      navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) return <><style>{injectCSS}</style><LoadingSkeleton /></>
  if (!post)   return <><style>{injectCSS}</style><NotFound /></>

  const dateStr = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  const initials = post.author
    ? post.author.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="bg-white min-h-screen">
      <style>{injectCSS}</style>
      <ProgressBar />

      {/* ── Nav ── 
      <nav className="sticky top-0 z-40 h-14 bg-white/90 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-4 sm:px-8">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors no-underline"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Blog
        </Link>

        <span className="hidden sm:block text-sm font-medium text-gray-400 truncate max-w-xs">
          {post.title}
        </span>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-500 hover:text-[#0a6c58] px-4 py-1.5 rounded-lg border border-gray-200 hover:border-[#cde7e0] hover:bg-[#e6f3f0] bg-white transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share
            </>
          )}
        </button>
      </nav>

      ── Hero ── */}
      <section className="bg-[#f6f4f0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-14 sm:pt-20 pb-0">
 <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors no-underline py-6"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Blog
        </Link>
          {/* Badge */}
          {post.categories?.[0] && (
            <div className="anim-1 inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#0a6c58] bg-[#e6f3f0] border border-[#cde7e0] px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0a6c58] flex-shrink-0" />
              {post.categories[0]}
            </div>
          )}

          {/* Title */}
          <h1 className=" anim-2 text-4xl sm:text-5xl font-normal leading-tight tracking-tight text-gray-900 mb-6" style={{ letterSpacing: '-.025em' }}>
            {post.title}
          </h1>

          {/* Meta strip */}
          <div className="anim-3 flex items-center gap-4 flex-wrap py-4 border-t border-b border-gray-100 mb-7">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#e6f3f0] border-2 border-[#cde7e0] overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#0a6c58]">
              
              <img src={author} alt={post.author} className="w-full h-full object-cover" />
                
            </div>
            <div className="flex items-center gap-2.5 flex-wrap text-sm text-gray-400">
              {post.author && <span className="font-medium text-gray-700">{post.author}</span>}
              <span className="text-gray-300">·</span>
              <span>{dateStr}</span>
              {post.readTime > 0 && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-md">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {post.readTime} min read
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Hero image */}
          <div className="anim-img w-full overflow-hidden rounded-2xl " style={{ aspectRatio: '16/10' }}>
            {post.mainImage ? (
              <img
                src={urlFor(post.mainImage).width(1200).url()}
                alt={post.title}
                className="w-full h-full object-contain block"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#e6f3f0] via-[#eef6f4] to-gray-50 flex items-center justify-center">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <rect x="8" y="20" width="40" height="8" rx="4" fill="#b7d9d1"/>
                  <rect x="8" y="31" width="40" height="8" rx="4" fill="#cde7e0"/>
                  <rect x="14" y="10" width="28" height="8" rx="4" fill="#87bdb1"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Article body ── */}
      <div className="bg-[#f6f4f0] ">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16 pb-24">
          <article className="prose-content">
            <PortableText
              value={post.body}
              components={{
                types: {
                  image: ({ value }) => (
                    <img
                      src={urlFor(value).width(860).url()}
                      alt={value.alt || ''}
                    />
                  ),
                },
                block: {
                  h2: ({ children }) => <h2>{children}</h2>,
                  h3: ({ children }) => <h3>{children}</h3>,
                  blockquote: ({ children }) => <blockquote><p>{children}</p></blockquote>,
                  normal: ({ children }) => <p>{children}</p>,
                },
                marks: {
                  link: ({ children, value }) => (
                    <a href={value?.href} target="_blank" rel="noopener noreferrer">{children}</a>
                  ),
                },
              }}
            />
          </article>

          {/* Inline CTA */}
          <div className="mt-12 flex items-center justify-between gap-6 flex-wrap bg-[#e6f3f0] border border-[#cde7e0] rounded-2xl p-6 sm:p-7">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Ready to start your wellness journey?</p>
              <p className="text-sm text-gray-500">Join thousands of moms already part of the FitMom Club community.</p>
            </div>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 bg-[#0a6c58] hover:bg-[#085041] text-white text-sm font-semibold px-5 py-2.5 rounded-xl no-underline transition-colors flex-shrink-0 shadow-sm shadow-[#cde7e0]"
            >
              Book a Consultation
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M5 3l4 4-4 4" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="bg-[#f6f4f0] border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-12 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <h3 className="font-display text-xl font-normal text-gray-900 mb-1">Enjoyed this article?</h3>
            <p className="text-sm text-gray-400">Explore more guides for fitness, nutrition, and wellness at every stage of motherhood.</p>
          </div>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-[#085041] text-white text-sm font-semibold px-5 py-2.5 rounded-xl no-underline transition-colors flex-shrink-0"
          >
            View all articles
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

   
    </div>
  )
}