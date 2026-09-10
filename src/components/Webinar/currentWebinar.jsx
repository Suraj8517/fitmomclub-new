import React from 'react'
const img = "https://res.cloudinary.com/q1vba78b/image/upload/v1783676813/Website-FitMom-Momentum-League-1536x763_on7z30.jpg";
export default function CurrentWebinar() {
  return (
    <div className='w-full p-6 flex justify-center flex-col pb-4 bg-white'>
        <div className='sm:w-[50%] mx-auto'>
            <img src={img} className='rounded-xl '/>
        </div>
           <p className=' max-w-3xl text-center mx-auto py-10 text-lg text-slate-600'>
            At FitMom Club, we believe that education is key to wellness. Our live webinars and expert sessions provide you with real-time advice, tools, and strategies to help you thrive. Whether you’re navigating postpartum fitness, seeking nutrition guidance, or looking for mental health support, our experts are here to guide you.
            </p> 
            <div className="flex justify-center">
  <a
    href="https://forms.zohopublic.in/vmaxwellness/form/BookYourFreeConsultation2/formperma/_wpDFOgVMo5xggV2XIaGtbQMwpEiPkUQvgLqN8SgRbk"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 rounded-full bg-[#009e8a] px-6 py-3 text-white text-base font-medium transition-colors duration-200 hover:bg-[#008776]"
  >
    Register Now
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  </a>
</div>
    </div>
  )
}
