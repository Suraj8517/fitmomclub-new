import React from 'react'
import { Link } from "react-router-dom";

export default function AppInterfaceDesc() {
  return (
    <div >
        <div className="sm:hidden text-center mb-10 max-w-xs mx-auto">
          <h1 className="text-3xl sm:text-4xl font-normal text-[#2C2C2C] leading-[1.2] tracking-tight mb-4">
            FitMom Club App
          </h1>
          <p className="text-base sm:text-lg text-[#4A4A4A] leading-relaxed mb-5">
            Your <span className="text-teal-800">all-in-one</span> companion for <br/>building healthier habits and staying <br/>committed to your well-being.
            <br/>and expert support
          </p>

          <Link
            to="our-app"
            className="inline-flex items-center gap-1.5 text-[#2C2C2C] text-base font-medium hover:underline underline-offset-4 transition-all"
          >
            See how it works
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="hidden  w-full sm:flex flex-col items-center justify-center text-center px-6 pt-14 pb-2">
          <h1 className="text-4xl lg:text-5xl xl:text-[3rem] 2xl:text-[4rem] font-normal text-[#2C2C2C] leading-[1.2] tracking-tight 2xl:max-w-6xl max-w-5xl mb-5">
            FitMom Club App
          </h1>
          <p className="text-lg lg:text-3xl text-[#4A4A4A] leading-relaxed mb-6">
            Your <span className="text-teal-800">all-in-one</span> companion for <br/>building healthier habits and staying <br/>committed to your well-being.
            <br/>and expert support
          </p>
          
        </div>
    </div>
  )
}
