import { useState, useEffect, useRef } from "react";
import {
  FileText, Clock, Dumbbell, UserCircle, ShieldAlert, CreditCard,
  PauseCircle, Users, ImageIcon, Globe, Baby, Scale, Gavel, RefreshCw,
  Info, Smartphone, Ban, Camera, Star, ArrowUpCircle, Calendar, BarChart2,
  Lock, AlertTriangle, PhoneCall, Home, ChevronDown, ChevronRight, Menu, X,
} from "lucide-react";

const sections = [
  { id: "introduction",         num: "01", label: "Introduction",                icon: FileText },
  { id: "services",             num: "02", label: "Services Provided",           icon: Dumbbell },
  { id: "account",              num: "03", label: "Account Creation",            icon: UserCircle },
  { id: "medical",              num: "04", label: "Medical Disclaimer",          icon: ShieldAlert },
  { id: "program-plans",        num: "05", label: "Program Plans",               icon: Star },
  { id: "offers",               num: "06", label: "Offers & Pricing",            icon: BarChart2 },
  { id: "app",                  num: "07", label: "FitMom Club App",           icon: Smartphone },
  { id: "no-redemption",        num: "08", label: "No Monetary Redemption",      icon: Ban },
  { id: "program-pause-change", num: "09", label: "Program Change After Pause",  icon: PauseCircle },
  { id: "program-transfer",     num: "10", label: "Program Change & Transfer",   icon: RefreshCw },
  { id: "upgrade",              num: "11", label: "Program Upgrade",             icon: ArrowUpCircle },
  { id: "coach-swap",           num: "12", label: "Coach Swap Requests",         icon: Users },
  { id: "camera",               num: "13", label: "Camera On Requirement",       icon: Camera },
  { id: "fees",                 num: "14", label: "Fees & Payments",             icon: CreditCard },
  { id: "partial-payment",      num: "15", label: "Partial Payment",             icon: CreditCard },
  { id: "no-refund",            num: "16", label: "No Refund Policy",            icon: Ban },
  { id: "refund-medical",       num: "17", label: "Refund – Medical Emergency",  icon: AlertTriangle },
  { id: "consultation",         num: "18", label: "Consultation Fees",           icon: PhoneCall },
  { id: "pause",                num: "19", label: "Program Pause",               icon: PauseCircle },
  { id: "conduct",              num: "20", label: "Client Conduct Policy",       icon: Scale },
  { id: "schedule",             num: "21", label: "Call Schedule & Holidays",    icon: Calendar },
  { id: "license",              num: "22", label: "License to Use Content",      icon: Lock },
  { id: "photos",               num: "23", label: "Progress Photos",             icon: ImageIcon },
  { id: "availability",         num: "24", label: "Availability of Services",    icon: Globe },
  { id: "responsibility",       num: "25", label: "Personal Responsibility",     icon: UserCircle },
  { id: "coach-purchases",      num: "26", label: "Restriction on Purchases",    icon: Ban },
  { id: "results",              num: "27", label: "Expected Results",            icon: Star },
  { id: "data",                 num: "28", label: "Data Protection",             icon: Lock },
  { id: "international",        num: "29", label: "International Use",           icon: Globe },
  { id: "minors",               num: "30", label: "Minors",                      icon: Baby },
  { id: "obligations",          num: "31", label: "Obligations for Updates",     icon: FileText },
  { id: "governing-law",        num: "32", label: "Governing Law",               icon: Gavel },
  { id: "changes",              num: "33", label: "Changes to Terms",            icon: RefreshCw },
];

import {
  P,
  BulletList,
  AlphaBulletList,
  Callout,
  InfoBox,
  Divider,
  PauseTable,
  SectionBlock,
  Modal,
} from "../components/TermsAndConditions/TermsAndConditionComponents"
export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMedicalPopup, setShowMedicalPopup] = useState(false);
  const [showTransferPopup, setShowTransferPopup] = useState(false);
  const contentRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (scrollTop >= maxScroll - 20) { setActiveSection(sections[sections.length - 1].id); return; }
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
    <div className="font-poppins flex flex-col h-screen overflow-hidden pt-16 xl:pt-4">

      {/* Mobile menu bar */}
      <div className="flex md:hidden items-center px-4 py-2.5 border-b border-zinc-200 bg-white gap-2.5">
        <button
          onClick={() => setSidebarOpen(v => !v)}
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
              <button onClick={() => setSidebarOpen(false)} className="bg-transparent border-none cursor-pointer text-zinc-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-3">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`flex items-center gap-2 px-2.5 py-2 w-full border-none rounded-md cursor-pointer mb-0.5 text-[13px] text-left transition-colors ${
                    activeSection === s.id
                      ? "bg-zinc-100 text-zinc-900 font-semibold"
                      : "bg-transparent text-zinc-700 font-normal hover:bg-zinc-50"
                  }`}
                >
                  <s.icon size={13} className="shrink-0 opacity-50" />
                  <span className="flex-1">{s.label}</span>
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${
                    activeSection === s.id ? "bg-purple-800 text-white" : "bg-purple-100 text-purple-500"
                  }`}>{s.num}</span>
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
<div className="hidden md:flex flex-col w-64 min-w-[256px] h-full border-r border-zinc-200 shrink-0 bg-zinc-50">
  <div className=" pb-5 flex-1 flex flex-col min-h-0">
    <div className="pl-2 mt-1 pt-20 shrink-0">
      <div className="block px-2.5 py-1.5 text-sm text-zinc-700 bg-zinc-100 font-semibold rounded-md border-none w-full text-left mb-3">
        Terms & Conditions
      </div>
    </div>

    {/* Scrollable sections list only */}
    <div className="pl-2 border-t border-zinc-200 pt-3 flex-1 min-h-0 overflow-y-auto">
      <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest px-2.5 mt-0 mb-1.5">Sections</p>
      {sections.map(s => (
        <button
          key={s.id}
          onClick={() => scrollToSection(s.id)}
          className={`flex items-center gap-2 px-2.5 py-1.5 w-full border-none rounded-md cursor-pointer mb-0.5 text-[13px] text-left transition-colors ${
            activeSection === s.id
              ? "bg-zinc-200 text-zinc-900 font-semibold"
              : "bg-transparent text-zinc-700 font-normal hover:bg-zinc-100"
          }`}
        >
          <s.icon size={13} className="shrink-0 opacity-50 text-teal-600" />
          <span className="flex-1">{s.label}</span>
          <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${
            activeSection === s.id ? "bg-teal-800 text-white" : "bg-teal-100 text-teal-500"
          }`}>{s.num}</span>
        </button>
      ))}
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
                <span>Terms &amp; Policies</span>
              </div>
              <span className="text-zinc-400 text-[13px]">Last Updated: March 01, 2026</span>
            </div>

            <h1 className="text-3xl md:text-[32px] font-extrabold text-zinc-900 mb-1.5">Terms and Conditions</h1>
            <p className="text-[15px] font-semibold text-zinc-600 mb-5">Thanks for joining FitMom Club!</p>

            <P>By registering, purchasing a program, or using any FitMom Club service, you agree to be bound by these Terms and Conditions. Please read them carefully before proceeding.</P>

            <Divider />

            <SectionBlock id="introduction" num="01" title="Introduction" icon={FileText} sectionRefs={sectionRefs}>
              <P>These Terms and Conditions ("Terms") govern your access to and use of the services, programs, coaching, products, and digital content provided by FitMom Club ("FitMom Club", "we", "our", or "us").</P>
              <InfoBox>FitMom Club does not provide medical advice. All fitness, nutrition, or wellness information is for general guidance only. You should seek professional medical approval before beginning any exercise or nutrition program.</InfoBox>
            </SectionBlock>

            <Divider />

            <SectionBlock id="services" num="02" title="Services Provided" icon={Dumbbell} sectionRefs={sectionRefs}>
              <P>FitMom Club offers digital fitness and nutrition services, including:</P>
              <BulletList items={["Training videos", "Training guides", "Online coaching", "Diet plans", "E-books", "Personalized fitness and nutrition programs"]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="account" num="03" title="Account Creation" icon={UserCircle} sectionRefs={sectionRefs}>
              <P>You must provide accurate, complete, and current information when creating your account. You are responsible for maintaining the confidentiality of your login details and for all activities under your account.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="medical" num="04" title="Medical Disclaimer and User Responsibility" icon={ShieldAlert} sectionRefs={sectionRefs}>
              <AlphaBulletList items={[
                "By participating in the FitMom Club virtual health and wellness program — including any exercise sessions, meal plans, nutritional guidance, or general lifestyle recommendations — you acknowledge and agree that your participation is voluntary.",
                "You understand that all physical activity and dietary changes involve inherent risks, and you accept full responsibility for your own health and wellbeing.",
                "You agree that it is your responsibility to consult with a qualified healthcare professional prior to beginning any new fitness, nutrition, or wellness program.",
                "By enrolling and participating, you understand and accept that any injuries, illnesses, or health-related issues that may occur during or after participation are solely your responsibility.",
                "This program provides general prenatal fitness and physiotherapy-guided exercises. Participants must obtain doctor's approval before joining. Stop immediately and consult your gynecologist if you feel pain, dizziness, bleeding, or any unusual symptoms.",
                "To the fullest extent permitted by law, FitMom Club and its coaches, employees, contractors, and affiliates shall not be held liable for any medical conditions, injuries, adverse reactions, or other outcomes arising from following the exercises, diet plans, advice, or recommendations provided through the program.",
                "FitMom Club is committed to maintaining an inclusive and respectful environment and does not make modifications or distinctions based on caste, religion, race, cultural background, gender, or any other discriminatory criteria.",
              ]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="program-plans" num="05" title="Program Plans" icon={Star} sectionRefs={sectionRefs}>
              <P>FitMom Club may offer different plan durations, billing cycles, and features. By enrolling in a plan, you agree to the terms applicable to that plan.</P>
              <AlphaBulletList items={[
                "No one-on-one or personal live coaching sessions are provided unless explicitly stated.",
                "Trainer availability may vary. Trainer assignments may change due to scheduling or operational reasons, but we ensure smooth transitions.",
                "Session timings and durations may change depending on coach availability and program updates.",
                "All clients are required to use the FitMom Club App to ensure full access to program features and support.",
                "The Company reserves the absolute right, at its sole discretion, to conduct live sessions in a combined manner with participants enrolled in one or more programs, courses, batches, or cohorts, whether similar or dissimilar.",
                "The Participant expressly acknowledges and agrees that such combined sessions constitute valid and complete performance of the Company's obligations under these Terms.",
                "Participation in such combined sessions shall not be deemed a change, alteration, misrepresentation, or unfair practice, and shall not entitle the Participant to any refund, credit, compensation, or damages.",
              ]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="offers" num="06" title="Offers and Price Adjustments" icon={BarChart2} sectionRefs={sectionRefs}>
              <P>The Company reserves the right, at its sole discretion, to modify, amend, or introduce prices, plans, promotions, and special offers at any time.</P>
              <P>Any such modifications shall apply only from their effective date and shall not be applied retroactively to any prior purchase, subscription, or agreement.</P>
              <Callout>Customers shall have no right to claim the application of any newly introduced offer, discount, or price adjustment to purchases completed prior to the effective date of such offer, unless expressly agreed to by FitMom Club in writing.</Callout>
            </SectionBlock>

            <Divider />

            <SectionBlock id="app" num="07" title="FitMom Club App" icon={Smartphone} sectionRefs={sectionRefs}>
              <P>FitMom Club has launched an updated mobile application effective <strong>April 2026</strong>. All clients are requested to download and begin using the application at the earliest.</P>
              <BulletList items={[
                "Any updates made on the previous FitMom Club application will not be considered valid.",
                "All pause requests, measurements, progress updates, and any other changes must be submitted exclusively through the updated application.",
                "FitMom Club will not be responsible for any missed, delayed, or unrecorded updates submitted on the previous version of the application.",
              ]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="no-redemption" num="08" title="No Monetary Redemption & Pricing Policy" icon={Ban} sectionRefs={sectionRefs}>
              <P>Unused program features or sessions cannot be redeemed for cash, refunds, or program extensions.</P>
              <P>Once an add-on program is activated, accessed, or made available to the client, no refund, transfer, or credit shall be issued — including for partial usage, non-usage, scheduling preferences, or personal reasons.</P>
              <InfoBox>Extension days and pause exception days, whether granted as a goodwill gesture or due to service disruption, are provided without monetary value and are non-encashable, non-refundable, and excluded from all refund calculations.</InfoBox>
            </SectionBlock>

            <Divider />

            <SectionBlock id="program-pause-change" num="09" title="Program Change After Long Pause" icon={PauseCircle} sectionRefs={sectionRefs}>
              <AlphaBulletList items={[
                "A participant may request a temporary pause due to pregnancy or medical reasons, subject to approval by FitMom Club.",
                "During the approved pause period, the fee paid and pricing terms shall remain valid only for the originally enrolled program, provided the participant resumes the same program without modification.",
                "In the event that, after the pause period, the participant requests any change, substitution, upgrade, downgrade, or transition to a different program, such request shall be treated as a new program enrollment.",
                "Any price revision, fee update, or program restructuring implemented by FitMom Club during the pause period shall be fully applicable to any program change requested after the pause period.",
                "The participant agrees that the applicable program fee shall be the prevailing price in effect on the date of the program change request, regardless of the amount previously paid.",
              ]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="program-transfer" num="10" title="Program Change & Transfer" icon={RefreshCw} sectionRefs={sectionRefs}>
              <P>For details on programme changes and transfers, please refer to the{" "}
                <span
                  onClick={() => setShowTransferPopup(true)}
                  className="text-teal-600 font-semibold underline cursor-pointer hover:text-teal-800"
                >
                  Program Change &amp; Transfer Policy
                </span>{" "}
                available on our website.
              </P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="upgrade" num="11" title="Same Program Upgrade" icon={ArrowUpCircle} sectionRefs={sectionRefs}>
              <AlphaBulletList items={[
                "Program upgrades shall be permitted only after full payment of the applicable program fee has been completed.",
                "Upgrades shall not be allowed on the basis of partial payments, including but not limited to Fee Lock-In Amount or any downpayments.",
                "Once the program has commenced, any upgrade request shall be processed at the prevailing program price at the time of the upgrade request.",
                "Once a program has commenced, the participant shall not be eligible to upgrade at any previously offered or promotional price, even if such offer was available at enrollment.",
                "Program change requests (upgrade or downgrade) will follow the pricing applicable on the date of the request.",
                "In the case of an upgrade or downgrade, clients can choose to pay the price difference or accept a reduced or extended program duration based on current pricing.",
                "Such upgrades shall be charged at the prevailing standard price of the upgraded program, without application of any promotional, discounted, or bundled offer that may have existed earlier.",
              ]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="coach-swap" num="12" title="Coach Swap Requests" icon={Users} sectionRefs={sectionRefs}>
              <P>You may request a coach change under valid circumstances, including:</P>
              <BulletList items={["Change in fitness or nutrition goals", "Assigned coach leaving the organization"]} />
              <Callout>Frequent swaps may be discouraged to maintain progress and coaching consistency.</Callout>
            </SectionBlock>

            <Divider />

            <SectionBlock id="camera" num="13" title="Camera On Requirement" icon={Camera} sectionRefs={sectionRefs}>
              <P>Clients must keep their camera ON during all live sessions for safety, form correction, and session validation.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="fees" num="14" title="Fees and Payments" icon={CreditCard} sectionRefs={sectionRefs}>
              <P>All fees for FitMom Club services are displayed prior to enrollment. Once purchased, programs cannot be canceled.</P>
              <Callout>All sales are final.</Callout>
            </SectionBlock>

            <Divider />

            <SectionBlock id="partial-payment" num="15" title="Partial Payment" icon={CreditCard} sectionRefs={sectionRefs}>
              <AlphaBulletList items={[
                "The initial payment made towards the program is a downpayment amount and does not correspond to a separate or reduced version of the program.",
                "Under all circumstances, the entire program fee must be completed within 45 days from the date of the initial payment.",
                "If the participant fails to complete the balance payment within the stipulated timelines, the program provider reserves the right to terminate the participant's enrollment and discontinue access after 45 days, without any obligation to refund the amount already paid.",
                "Any payment made below 60% of the total program fee as price lock fee shall be treated as a non-refundable, non-transferable commitment amount.",
                "Such payments are not eligible for refund, transfer, adjustment, or conversion into partial or alternate services, under any circumstances.",
                "Any payment made to lock the program price (Fee Lock-In Amount) shall be deemed a non-refundable and non-transferable enrollment payment.",
                "The remaining balance of the program fee must be paid within fourteen (14) days from the date of payment of the Fee Lock-In Amount.",
                "Failure to complete the balance payment within the stipulated 14-day period may result in cancellation of enrollment and forfeiture of the Fee Lock-In Amount, at the sole discretion of FitMom Club.",
              ]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="no-refund" num="16" title="No Refund Policy" icon={Ban} sectionRefs={sectionRefs}>
              <P>FitMom Club does not provide refunds for any reason except where explicitly allowed in the medical emergency policy.</P>
              <InfoBox>
                For medical emergency refund eligibility, please refer to the{" "}
                <span
                  onClick={() => setShowMedicalPopup(true)}
                  className="text-teal-600 font-semibold underline cursor-pointer hover:text-teal-800"
                >
                  Medical Emergency Policy
                </span>{" "}
                available on our website.
              </InfoBox>
            </SectionBlock>

            <Divider />

            <SectionBlock id="refund-medical" num="17" title="Refund Exceptions for Medical Emergencies" icon={AlertTriangle} sectionRefs={sectionRefs}>
              <AlphaBulletList items={[
                "Refund requests may be considered for serious medical conditions that prevent continuation of the program. Valid medical documentation must be provided.",
                "Recurring fees towards operations and service delivery are charged on a pro-rata basis, depending on the duration for which the services have been made available.",
                "All one-time fees are utilised immediately upon enrollment and activation of services and are therefore non-refundable irrespective of the date of cancellation.",
                "Any eligibility for refund shall be determined solely based on the number of calendar days elapsed from the date of enrollment or the date of first payment, whichever is earlier.",
                "Refund review may take 10–15 days. If approved, refunds may take 5–7 business days to reflect in your bank account. FitMom Club may deny a refund and offer alternative solutions.",
                "Approved refunds, if any, shall be processed only to the original mode of payment used by the participant.",
                "Payment gateway charges, bank fees, taxes, or statutory levies already paid shall not be refundable.",
              ]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="consultation" num="18" title="Consultation Fees" icon={PhoneCall} sectionRefs={sectionRefs}>
              <P>Fees paid for consultations are non-refundable once the consultation has been scheduled or delivered.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="pause" num="19" title="Program Pause" icon={PauseCircle} sectionRefs={sectionRefs}>
              <P>Life events may require a temporary pause of your program. You may request a pause by emailing <strong>care@fitmomclub.co</strong>.</P>
              <p className="text-sm font-semibold text-zinc-800 mt-4 mb-2">Pause Entitlement by Program Duration</p>
              <PauseTable />
              <p className="text-sm font-semibold text-zinc-800 mt-4 mb-2">Pause Guidelines</p>
              <BulletList items={[
                "Pauses can be taken only in multiples of 7 days.",
                "Minimum pause duration is 7 days. However, if the client's remaining pause balance is fewer than 7 days, the client may utilise the remaining balance in full.",
                "3-month program: Up to 2 pauses",
                "6-month program: Up to 4 pauses",
                "9-month program: Up to 6 pauses, and so on in proportion to the total eligible pause days.",
                "Pauses cannot be availed during the last month of the program.",
                "For a 3-month program specifically, pauses will not be permitted during the last 15 days.",
              ]} />
              <p className="text-sm font-semibold text-zinc-800 mt-4 mb-2">Long-Duration Pause Eligibility</p>
              <BulletList items={["Pregnancy (if not upgrading to prenatal program)", "Depression or mental health challenges", "Physical injury", "Family emergency", "Serious medical conditions"]} />
              <InfoBox>All medical conditions for exceptions must be supported with appropriate medical documentation (scans, X-rays, prescriptions, or written reports issued by a registered and licensed medical professional). FitMom Club reserves the sole and final discretion in deciding whether a participant may continue, modify, or discontinue the program based on the information provided.</InfoBox>
              <p className="text-sm font-semibold text-zinc-800 mt-4 mb-2">Pause Policy – Pregnancy, Delivery &amp; Medical Exceptions</p>
              <P>In the event that a client requests a pause due to childbirth, such pause shall be permitted for a maximum cumulative period of six (6) months from the date of delivery. In exceptional cases involving serious medical complications, a one-time additional extension may be considered solely at the discretion of the Company, subject to valid medical documentation.</P>
              <Callout>Failure to resume services within the applicable timeframe shall result in automatic lapse and forfeiture of any remaining or unused portion of the program, without any entitlement to extension, refund, transfer, or credit.</Callout>
              <p className="text-sm font-semibold text-zinc-800 mt-4 mb-2">Pause Eligibility for Part-Payment Plans</p>
              <P>Clients enrolled under a part-payment plan shall not be eligible to avail the pause facility during the first 45 days from the program start date. However, if the client settles the outstanding balance in full prior to the 45-day period, the client shall become eligible to utilise the pause facility from the date of full payment.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="conduct" num="20" title="Client Conduct Policy" icon={Scale} sectionRefs={sectionRefs}>
              <P>FitMom Club maintains a strict zero-tolerance policy for any form of harassment, abuse, discrimination, or disrespectful behavior toward staff or other participants.</P>
              <p className="text-sm font-semibold text-zinc-800 mt-3 mb-1.5">Abusive behavior includes:</p>
              <BulletList items={["Verbal abuse or disrespect", "Harassment or threats", "Discriminatory remarks", "Bullying", "Manipulative or harmful conduct"]} />
              <p className="text-sm font-semibold text-zinc-800 mt-3 mb-1.5">Consequences may include:</p>
              <BulletList items={["Warning", "Program suspension or termination", "Blocking access to coaches or services", "Permanent ban from the platform"]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="schedule" num="21" title="Call Schedule & Holidays" icon={Calendar} sectionRefs={sectionRefs}>
              <P>Onboarding and review calls are not scheduled on Sundays or National Holidays.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="license" num="22" title="License to Use Content" icon={Lock} sectionRefs={sectionRefs}>
              <P>When you purchase a program, FitMom Club grants you a limited, non-exclusive, non-transferable license to stream videos, download e-books, and access personalized plans.</P>
              <Callout>You may not share, distribute, reproduce, or repurpose any FitMom Club content.</Callout>
            </SectionBlock>

            <Divider />

            <SectionBlock id="photos" num="23" title="Submission of Progress Photos" icon={ImageIcon} sectionRefs={sectionRefs}>
              <P>Progress photos are required as part of the program. By submitting them, you grant FitMom Club a perpetual, worldwide, royalty-free license to use the images for marketing or business purposes.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="availability" num="24" title="Availability of Services" icon={Globe} sectionRefs={sectionRefs}>
              <P>FitMom Club aims to provide a high-quality experience but does not guarantee uninterrupted access or error-free service.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="responsibility" num="25" title="Personal Responsibility and Safety" icon={UserCircle} sectionRefs={sectionRefs}>
              <P>You are responsible for exercising personal judgment regarding any fitness or nutrition guidance provided. Programs depend on the information you provide and may not suit all circumstances, including pregnancy or medical conditions. Consult a medical professional when needed.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="coach-purchases" num="26" title="Restriction on Personal Purchases from Coaches" icon={Ban} sectionRefs={sectionRefs}>
              <BulletList items={[
                "Clients must not buy personal merchandise, products, or 1-on-1 services directly from coaches.",
                "If a coach approaches a client with such offers, the client must inform FitMom Club immediately through care@fitmomclub.co.",
                "Coaches are not authorized to recommend or endorse any supplement brands.",
                "FitMom Club is not responsible for any personal transactions with coaches made without prior email confirmation.",
                "Individual verbal or written assurances that deviate from official Terms and Conditions are not binding on the organization.",
              ]} />
            </SectionBlock>

            <Divider />

            <SectionBlock id="results" num="27" title="Expected Results" icon={Star} sectionRefs={sectionRefs}>
              <P>Results vary by individual. FitMom Club does not guarantee specific outcomes.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="data" num="28" title="Data Protection and Communication" icon={Lock} sectionRefs={sectionRefs}>
              <P>All personal data is handled according to our Privacy Policy. By enrolling, you consent to receiving communications from FitMom Club via email, SMS, WhatsApp, OBD, and other communication channels.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="international" num="29" title="International Use" icon={Globe} sectionRefs={sectionRefs}>
              <P>If you are residing outside India, you must comply with local laws and regulations relevant to your location.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="minors" num="30" title="Minors" icon={Baby} sectionRefs={sectionRefs}>
              <P>Minors may enroll only with a valid No-Objection Certificate from a parent or guardian. All Terms apply equally to minors.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="obligations" num="31" title="Obligations for Updates" icon={FileText} sectionRefs={sectionRefs}>
              <P>You are responsible for sending daily meal and weight updates and weekly physique updates. FitMom Club may follow up but is not liable if you fail to provide updates.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="governing-law" num="32" title="Governing Law" icon={Gavel} sectionRefs={sectionRefs}>
              <P>These Terms are governed by the laws of India. Any disputes shall be resolved exclusively in the courts of Coimbatore, Tamil Nadu.</P>
            </SectionBlock>

            <Divider />

            <SectionBlock id="changes" num="33" title="Changes to the Terms" icon={RefreshCw} sectionRefs={sectionRefs}>
              <P>FitMom Club may revise these Terms and Conditions periodically. Any changes will take effect once they are posted on this website. By continuing to access or use the program after updates are posted, you agree to be bound by the revised Terms and Conditions.</P>
            </SectionBlock>

            <div className="border-t border-zinc-200 pt-5 text-center">
              <p className="text-[13px] text-zinc-400 m-0">— End of Terms and Conditions —</p>
            </div>
          </div>
        </main>
      </div>

      {/* Medical Emergency Modal */}
      <Modal open={showMedicalPopup} onClose={() => setShowMedicalPopup(false)} title="Medical Emergency Policy">
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="font-bold text-zinc-800 mb-2 text-sm">1. Purpose</h3>
            <p className="m-0">This policy defines the criteria and documentation requirements used to determine whether a client's medical circumstances qualify as a medical emergency for refund assessments.</p>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 mb-2 text-sm">2. Definition of Medical Emergency</h3>
            <ul className="pl-4 m-0 space-y-1">
              {["Sudden, severe, and unforeseen medical condition", "Requires immediate medical intervention", "Directly prevents continuation of the program"].map((item, k) => (
                <li key={k} className="list-disc">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 mb-2 text-sm">3. Eligibility Criteria</h3>
            <ul className="pl-4 m-0 space-y-1">
              {["Life-threatening condition needing emergency care", "Doctor-certified restriction on physical activity", "Physically incapable of continuing program for uncertain duration"].map((item, k) => (
                <li key={k} className="list-disc">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 mb-2 text-sm">4. Documentation Requirements</h3>
            <p className="m-0 mb-2">Acceptable documents include:</p>
            <ul className="pl-4 m-0 mb-3 space-y-1">
              {["Hospital admission/discharge summaries", "Diagnostic reports / scans", "Doctor certificates / specialist letters"].map((item, k) => (
                <li key={k} className="list-disc">{item}</li>
              ))}
            </ul>
            <p className="m-0 mb-2">Documents should mention:</p>
            <ul className="pl-4 m-0 space-y-1">
              {["Diagnosis or condition", "Treatment / hospitalization dates", "Activity restrictions", "Expected recovery period (if available)"].map((item, k) => (
                <li key={k} className="list-disc">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 mb-2 text-sm">5. Examples of Qualifying Emergencies</h3>
            <ul className="pl-4 m-0 space-y-1">
              {["Cardiac events", "Stroke", "Organ failure or cancer", "Major fractures", "Emergency surgery", "Prolonged immobility / rehabilitation"].map((item, k) => (
                <li key={k} className="list-disc">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 mb-2 text-sm">6. Non-Qualifying Scenarios</h3>
            <ul className="pl-4 m-0 space-y-1">
              {["Mild illness or temporary infections", "Short-term discomfort", "Brief hospitalization without long restrictions", "Elective or preventive treatment", "Pre-existing conditions without complications"].map((item, k) => (
                <li key={k} className="list-disc">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 mb-2 text-sm">7. Assessment & Decision Authority</h3>
            <ul className="pl-4 m-0 space-y-1">
              {["Every claim reviewed case-by-case", "Additional documents may be requested", "Submitted records may be verified", "Claims not meeting criteria may be denied"].map((item, k) => (
                <li key={k} className="list-disc">{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-[13px] text-zinc-700">
            This policy forms part of FitMom Club Terms &amp; Conditions and is binding on all participants.
          </div>
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal open={showTransferPopup} onClose={() => setShowTransferPopup(false)} title="Program Change & Transfer Policy">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="font-bold text-zinc-800 mb-2.5 text-base">1. Change to a Different Programme</h3>
            <p className="m-0 mb-2.5">A participant may request a one-time change to a different program, subject to the following conditions:</p>
            <ul className="pl-4 m-0 space-y-1.5">
              {["Minimum forty-five (45) days must remain.", "New program duration must not be less than thirty (30) days.", "Program duration/access may be adjusted instead of fee adjustment.", "Prevailing program fee at the time of request shall apply.", "Any fee difference must be paid by the participant.", "Program change is permitted only once."].map((item, k) => (
                <li key={k} className="list-disc">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-zinc-800 mb-2.5 text-base">2. Transfer to Different Individual</h3>
            <p className="m-0 mb-2.5">A participant may request a one-time transfer of enrollment to another individual, subject to the following conditions:</p>
            <ul className="pl-4 m-0 space-y-1.5">
              {["Minimum forty-five (45) days must remain.", "Only the same program may be transferred unless stated otherwise.", "Blossom and Queen programs may be converted to credit at provider's discretion.", "Prevailing program fee at the time of transfer shall apply.", "New participant must accept all applicable terms and policies.", "Original participant loses access after transfer.", "Transfer permitted only once per enrollment."].map((item, k) => (
                <li key={k} className="list-disc">{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-[13px] text-zinc-700">
            All requests are subject to operational review and final approval by FitMom Club.
          </div>
        </div>
      </Modal>
    </div>
  );
}