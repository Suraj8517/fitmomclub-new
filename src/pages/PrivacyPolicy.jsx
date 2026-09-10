import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Shield,
  UserCircle,
  Share2,
  Cookie,
  Heart,
  Target,
  CheckCircle,
  Clock,
  Users,
  Phone,
  Info,
  ChevronRight,
  Menu,
  X,
  Gavel,
} from "lucide-react";

import {
  P,
  BulletList,
  Callout,
  InfoBox,
  Divider,
  SectionBlock,
  AddressBlock
} from "../components/PrivacyPolicy/PrivacyPolicyComponent";

const sections = [
  { id: "introduction",   num: "01", label: "Introduction",           icon: FileText    },
  { id: "user-info",      num: "02", label: "User Information",       icon: UserCircle  },
  { id: "sharing",        num: "03", label: "Sharing & Disclosure",   icon: Share2      },
  { id: "cookies",        num: "04", label: "Cookies",                icon: Cookie      },
  { id: "health-collect", num: "05", label: "Health Data Collection", icon: Heart       },
  { id: "health-purpose", num: "06", label: "Purpose of Health Data", icon: Target      },
  { id: "user-consent",   num: "07", label: "User Consent",          icon: CheckCircle },
  { id: "security",       num: "08", label: "Security Measures",      icon: Shield      },
  { id: "retention",      num: "09", label: "Data Retention",         icon: Clock       },
  { id: "third-party",    num: "10", label: "Third-Party Services",   icon: Users       },
  { id: "contact",        num: "11", label: "Contact & Updates",      icon: Phone       },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (scrollTop >= maxScroll - 20) {
        setActiveSection(sections[sections.length - 1].id);
        return;
      }
      let current = sections[0].id;
      for (const s of sections) {
        const ref = sectionRefs.current[s.id];
        if (ref && ref.offsetTop - 100 <= scrollTop) current = s.id;
      }
      setActiveSection(current);
    };
    el.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const ref = sectionRefs.current[id];
    if (ref && contentRef.current) {
      contentRef.current.scrollTo({ top: ref.offsetTop - 20, behavior: "smooth" });
      setSidebarOpen(false);
    }
  };

  return (
    <div className="font-poppins flex flex-col h-screen overflow-hidden pt-20 xl:pt-4">

      {/* Mobile menu bar */}
      <div className="flex md:hidden items-center px-4 py-2.5 border-b border-zinc-200 bg-white gap-2.5">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="bg-transparent border-none cursor-pointer flex items-center gap-2 text-zinc-700 font-semibold text-sm"
        >
          <Menu size={20} />
          Navigation
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-white h-full overflow-y-auto shadow-xl shadow-black/10">
            <div className="px-4 py-4 border-b border-zinc-200 flex justify-between items-center">
              <span className="font-bold text-zinc-800 text-base">Navigation</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="bg-transparent border-none cursor-pointer text-zinc-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-3">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`flex items-center gap-2 px-2.5 py-2 w-full border-none rounded-md cursor-pointer mb-0.5 text-[13px] text-left transition-colors ${
                    activeSection === s.id
                      ? "bg-zinc-100 text-zinc-900 font-semibold"
                      : "bg-transparent text-zinc-700 font-normal hover:bg-zinc-50"
                  }`}
                >
                  <s.icon size={13} className="shrink-0 text-teal-600" />
                  <span className="flex-1">{s.label}</span>
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold bg-teal-100 text-teal-600`}>
                    {s.num}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop sidebar */}
        <div className="hidden md:flex flex-col pt-20 w-64 min-w-[256px] h-full overflow-y-auto border-r border-zinc-200 shrink-0 bg-zinc-50">
          <div className="px-4 pb-5 flex-1">
            <div className="pl-2 mt-1">
              <div className="block px-2.5 py-1.5 text-sm text-zinc-700 bg-zinc-100 font-semibold rounded-md border-none w-full text-left mb-3">
                Privacy Policy
              </div>
              <div className="border-t border-zinc-200 pt-3">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-2.5 mt-0 mb-1.5">
                  Sections
                </p>
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 w-full border-none rounded-md cursor-pointer mb-0.5 text-[13px] text-left transition-colors ${
                      activeSection === s.id
                        ? "bg-zinc-200 text-zinc-900 font-semibold"
                        : "bg-transparent text-zinc-700 font-normal hover:bg-zinc-100"
                    }`}
                  >
                    <s.icon size={13} className="shrink-0 text-teal-600" />
                    <span className="flex-1">{s.label}</span>
                    <span className="text-[10px] rounded-full px-1.5 py-0.5 font-semibold bg-teal-100 text-teal-600">
                      {s.num}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main ref={contentRef} className="flex-1 overflow-y-auto bg-white">
          <div className="font-poppins max-w-3xl mx-auto px-6 md:px-8 pt-20 pb-20">

            {/* Breadcrumb */}
            <div className="flex items-center justify-between flex-wrap gap-2 text-[13px] text-zinc-400 mb-5">
              <div className="flex items-center gap-1.5">
                <a className="text-zinc-600 cursor-pointer hover:underline">Home</a>
                <ChevronRight size={13} />
                <span>Privacy Policy</span>
              </div>
              <span className="text-zinc-400 text-[13px]">Last Updated: June 01, 2025</span>
            </div>

            <h1 className="text-3xl md:text-[32px] font-extrabold text-zinc-900 mb-1.5">
              Privacy Policy
            </h1>
            <p className="text-[15px] font-semibold text-zinc-600 mb-5">FitMom Club</p>

            <P>
              We are dedicated to maintaining the privacy and security of your personal
              information. We value your privacy, and preserving your trust is of paramount
              importance to us.
            </P>

            <Divider />

            <SectionBlock id="introduction" num="01" title="Introduction" icon={FileText} sectionRefs={sectionRefs}>
              <P>
                Welcome to <strong>FitMom Club</strong> (referred to as the "Website").
                FitMom Club is registered as <strong>FitMom Club</strong>, a company
                incorporated under the Companies Act, 2013. Its registered office is located at
                No.6/53, Ajay Complex, Urumandam Palayam, G.N. Mills (Po), Coimbatore, Tamil Nadu,
                India – 641029. FitMom Club is recognized as "We" and "Us".
              </P>
              <P>
                The agreement between you and us is entirely governed by these terms and any
                applicable policies; it also supersedes all other agreements.
              </P>
              <InfoBox>
                This Privacy Policy describes our privacy practices for all websites, products, and
                services that are linked to it. However, this policy does not apply to affiliates
                and partners that have their own privacy policy. In such cases, we advise reading
                the privacy statement on the relevant website.
              </InfoBox>
            </SectionBlock>

            <Divider />

            <SectionBlock id="user-info" num="02" title="User Information" icon={UserCircle} sectionRefs={sectionRefs}>
              <P>
                As part of the registration process and when you interface with FitMom Club, we
                ask you for specific details. Through the App Services, we will obtain this data in
                a wide range of formats and sources, including:
              </P>
              <BulletList items={["Account registration forms", "Contact us forms", "Other contact with customer support"]} />
              <P>
                By the use of various technologies, we gather data about how you navigate our
                website and/or application. This includes information on the operations you
                completed while using our services, such as:
              </P>
              <BulletList items={["Services you requested", "Payment method and transactional details"]} />
              <Callout>We do not assemble data from any outside sources.</Callout>
            </SectionBlock>

            <Divider />

            <SectionBlock id="sharing" num="03" title="Sharing & Disclosure of Data with Third Parties" icon={Share2} sectionRefs={sectionRefs}>
              <P>
                As required by law, at times we might be required to disclose your personal
                information — including transactional and financial information — to relevant
                authorities. In some cases, when we believe that such disclosure is necessary to
                protect our rights, or the rights of others, or to comply with a judicial
                proceeding, court order, or legal process served on our website or app, we would
                share such information pursuant to a lawful request from law enforcement agencies.
              </P>
              <P>
                We reserve the right to share personally identifying information about you that we
                have obtained from you through our website or application with other counterparties
                and partners that are not functioning as our suppliers or business partners.
              </P>
              <InfoBox>
                Except as stated in this Privacy Policy, we won't do so without explicitly getting
                your authorization. We do not sell or lease such information.
              </InfoBox>
              <P>We may use the information we have about you for marketing purposes, but only with your express consent. You can opt-out at any time by:</P>
              <BulletList items={[
                "Following the unsubscribe instructions found in each email you receive",
                "Making a specific request when we call you",
                "Getting in contact with us directly",
              ]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="cookies" num="04" title="Cookies" icon={Cookie} sectionRefs={sectionRefs}>
              <P>
                To help comprehend how users engage with the FitMom Club App, analyse the App
                Services, and encourage trust and safety, we employ data collecting tools like
                "cookies" on specific portions of the App. Cookies are small files that are
                retained on your device's hard disc or other storage space and assist us in
                providing the App Services.
              </P>
              <InfoBox>
                Please note that there are specific features we provide through the App that can
                only be enabled by using a "cookie."
              </InfoBox>
              <Callout>
                You are always free to decline our cookies if your device permits, although doing
                so might prevent you from using some features.
              </Callout>
              <P>
                We reserve all rights to change this policy from time to time. Any amendments will
                become effective immediately as the updated Privacy Policy is publicized. We
                strongly encourage you to visit this page frequently to obtain the most recent
                information on our privacy practices.
              </P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="health-collect" num="05" title="Health Connect Data — Collection and Usage" icon={Heart} sectionRefs={sectionRefs}>
              <P>
                We value the privacy and security of our users. Our app requests access to
                health-related permissions, specifically the ability to read:
              </P>
              <BulletList items={["Steps", "Activity", "Calories", "Sleep information"]} />
              <P>
                This data is collected for the sole purpose of enhancing the user experience and
                providing features related to health and fitness.
              </P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="health-purpose" num="06" title="Purpose of Health Data Access" icon={Target} sectionRefs={sectionRefs}>
              <P>Our app utilizes health-related permissions to track:</P>
              <BulletList items={["Daily steps", "Daily activity", "Calories", "Sleep patterns"]} />
              <Callout>
                This data is processed locally on the user's device and is not shared with any
                third parties.
              </Callout>
            </SectionBlock>

            <Divider />

            <SectionBlock id="user-consent" num="07" title="User Consent" icon={CheckCircle} sectionRefs={sectionRefs}>
              <P>
                By using our app, you explicitly consent to the collection and usage of
                health-related data for the purposes outlined in this privacy policy.
              </P>
              <InfoBox>
                You have the option to grant or deny these permissions within the app settings at
                any time.
              </InfoBox>
            </SectionBlock>

            <Divider />

            <SectionBlock id="security" num="08" title="Security Measures" icon={Shield} sectionRefs={sectionRefs}>
              <P>
                We implement robust security measures to protect the confidentiality and integrity
                of health-related data. This includes:
              </P>
              <BulletList items={["Encryption of data in transit and at rest", "Secure storage practices"]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="retention" num="09" title="Data Retention" icon={Clock} sectionRefs={sectionRefs}>
              <P>
                We retain health-related data only for as long as necessary to fulfill the purposes
                outlined in this privacy policy.
              </P>
              <Callout>
                Users can request the deletion of their data by contacting our support team via
                email.
              </Callout>
            </SectionBlock>

            <Divider />

            <SectionBlock id="third-party" num="10" title="Third-Party Services" icon={Users} sectionRefs={sectionRefs}>
              <P>
                Our app does not share health-related data with third-party services, advertisers,
                or external entities. We do not engage in the sale or exchange of user data.
              </P>
              <InfoBox>
                Clients agree to receive promotional calls, consultation calls, and SMS on the
                number shared. Such calls and SMS may come from a third-party platform.
              </InfoBox>
            </SectionBlock>

            <Divider />

            <SectionBlock id="contact" num="11" title="Contact & Policy Updates" icon={Phone} sectionRefs={sectionRefs}>
              <P>
                We reserve all rights to change this Privacy Policy from time to time. Any
                amendments will become effective immediately once the updated Privacy Policy is
                publicized.
              </P>
              <P>
                We strongly encourage you to visit this page frequently to obtain the most recent
                information on our privacy practices.
              </P>
              <p className="text-sm font-semibold text-zinc-800 mt-4 mb-2">Registered Address</p>
              <AddressBlock />
            </SectionBlock>

            <div className="border-t border-zinc-200 pt-5 text-center">
              <p className="text-[13px] text-zinc-400 m-0">— End of Privacy Policy —</p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}