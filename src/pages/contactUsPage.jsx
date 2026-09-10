import React from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Smartphone,
  PhoneCall,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import CTASection from "../components/OurApp/OurAppCTA";
import img1 from "../assets/success stories/transformations/1.png"
import img2 from "../assets/success stories/transformations/2.png"
import img3 from "../assets/success stories/transformations/3.png"
import img4 from "../assets/success stories/transformations/4.png"


const COLLAGE_IMAGES = [
  img1,
  img2,
  img3,
  img4,
];

const CONTACT_METHODS = [
  {
    key: "chat",
    icon: MessageCircle,
    title: "Chat with Us",
    description: "Easily connect with our experts for support and guidance.",
    detail: "Available 10 AM - 7 PM, Mon-Sat",
    detailIcon: Clock,
  },
  {
    key: "call",
    icon: Phone,
    title: "Talk to Us",
    description: "Prefer to speak with someone? Give us a call for any inquiries.",
    detail: "+91 81481 36573",
    href: "tel:+918148136573",
  },
  {
    key: "email",
    icon: Mail,
    title: "Write to Us",
    description:
      "For more detailed inquiries or feedback, send us an email, and we'll get back to you as soon as possible.",
    detail: "care@fitmomclub.co",
    href: "mailto:care@fitmomclub.co",
  },
];

const OFFICES = [
  {
    key: "india",
    label: "FitMom Club Office, India",
    address: "No 9/14, Bharathi Street, Vellakinar, Coimbatore, Tamil Nadu, 641029",
  },
  {
    key: "intl",
    label: "FitMom Club Office, International",
    address:
      "Happy Moms Club, Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates.",
  },
];

function mapsHref(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default function ContactUs() {
  return (
    <div className="min-h-screen w-full bg-neutral-100 font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        .font-mono-data { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .font-body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      {/* Hero -- photo collage frame on a light bg, echoing the reference
          layout but recolored: cream instead of black, photos as soft
          rounded tiles with a hairline border instead of vignetted into
          a dark overlay. */}
      <section className="relative overflow-hidden pt-28 pb-20 px-5">
        {/* Corner collage -- hidden on small screens to avoid clutter 
        <div className="hidden lg:block absolute -top-6 -left-6 w-56 h-72 rounded-3xl overflow-hidden border border-stone-200 shadow-sm rotate-[-4deg]">
          <img src={COLLAGE_IMAGES[0]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
         <div className="hidden lg:block absolute top-4 left-70 w-40 h-52 rounded-3xl overflow-hidden border border-stone-200 shadow-sm rotate-[-3deg]">
          <img src={COLLAGE_IMAGES[1]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="hidden lg:block absolute top-64 left-10 w-20 h-22 rounded-3xl overflow-hidden border border-stone-200 shadow-sm rotate-[-3deg]">
          <img src={COLLAGE_IMAGES[1]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="hidden lg:block absolute top-24 left-40 w-40 h-52 rounded-3xl overflow-hidden border border-stone-200 shadow-sm rotate-[3deg]">
          <img src={COLLAGE_IMAGES[1]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="hidden lg:block absolute -top-6 -right-6 w-56 h-72 rounded-3xl overflow-hidden border border-stone-200 shadow-sm rotate-[4deg]">
          <img src={COLLAGE_IMAGES[2]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="hidden lg:block absolute top-24 right-40 w-40 h-52 rounded-3xl overflow-hidden border border-stone-200 shadow-sm rotate-[-3deg]">
          <img src={COLLAGE_IMAGES[3]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="hidden lg:block absolute top-4 right-80 w-40 h-52 rounded-3xl overflow-hidden border border-stone-200 shadow-sm rotate-[3deg]">
          <img src={COLLAGE_IMAGES[3]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="hidden lg:block absolute top-24 right-40 w-40 h-52 rounded-3xl overflow-hidden border border-stone-200 shadow-sm rotate-[-3deg]">
          <img src={COLLAGE_IMAGES[3]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
*/}
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 font-mono-data text-xs text-stone-500 border border-stone-300 rounded-full px-4 py-1.5 mb-6 bg-white">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            Contact Us
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-stone-900 leading-tight mb-4">
            We Are Here To Help You
          </h1>
          <p className="text-sm sm:text-base text-stone-500 max-w-md mx-auto">
            However you'd like to reach us -- chat, call, email, or in person -- pick whatever
            feels easiest.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-5 pb-20 -mt-6">
        {/* Three quick contact methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {CONTACT_METHODS.map((method) => {
            const Icon = method.icon;
            const DetailIcon = method.detailIcon;
            const Wrapper = method.href ? "a" : "div";
            return (
              <Wrapper
                key={method.key}
                {...(method.href ? { href: method.href } : {})}
                className="group flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:border-teal-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-stone-900 mb-1">{method.title}</h2>
                  <p className="text-xs text-stone-500 leading-relaxed">{method.description}</p>
                </div>
                <div className="mt-auto pt-3 border-t border-stone-100 flex items-center gap-1.5">
                  {DetailIcon ? <DetailIcon className="w-3.5 h-3.5 text-stone-400" /> : null}
                  <span className="font-mono-data text-xs font-semibold text-stone-700">
                    {method.detail}
                  </span>
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* Visit Us -- both offices */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 mb-4">
          <div className="flex items-start gap-3 mb-5">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-600 shrink-0">
              <MapPin className="w-5 h-5" strokeWidth={2} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-stone-900 mb-1">Visit Us</h2>
              <p className="text-xs text-stone-500 leading-relaxed max-w-md">
                Drop by our office to learn more about FitMom Club and how we can help you.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {OFFICES.map((office) => (
              <a
                key={office.key}
                href={mapsHref(office.address)}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col justify-between rounded-xl border border-stone-200 bg-stone-50 p-4 hover:border-teal-300 transition-colors"
              >
                <div>
                  <p className="text-xs font-semibold text-stone-800 mb-1">{office.label}</p>
                  <p className="text-xs text-stone-500 leading-relaxed">{office.address}</p>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 font-mono-data text-[11px] text-teal-600 group-hover:text-teal-700">
                  Get directions
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Download the app 
          <Link
            to="/our-app"
            className="group flex items-center justify-between rounded-2xl bg-teal-600 hover:bg-teal-700 transition-colors p-6"
          >
            <div>
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 text-white mb-3">
                <Smartphone className="w-5 h-5" strokeWidth={2} />
              </span>
              <p className="text-sm font-semibold text-white mb-1">Download the App</p>
              <p className="text-xs text-teal-50">
                Track your journey and reach us right from your pocket.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors shrink-0" />
          </Link>

          {/* Request a callback 
          <div className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6">
            <div>
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-600 mb-3">
                <PhoneCall className="w-5 h-5" strokeWidth={2} />
              </span>
              <p className="text-sm font-semibold text-stone-900 mb-1">
                Having trouble reaching us?
              </p>
              <p className="text-xs text-stone-500">
                Request a callback, and we'll get back to you promptly.
              </p>
            </div>
            <a
              href="tel:+918148136573"
              className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-teal-700 border border-teal-200 hover:bg-teal-50 rounded-full px-4 py-2.5 transition-colors w-fit"
            >
              Request a callback
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>*/}
          
        </div>
      </div>
      <CTASection/>
    </div>
  );
}