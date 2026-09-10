import React from 'react'
import handleConsultation from "./handleClick";
export default function ConsultationButton({label}) {
  return (
    <div>
         <button
           onClick={handleConsultation}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors duration-200 shadow-md"
           style={{
          background: "linear-gradient(90deg,#50ffaa,#00d4ff)",
          color: "#062019",
          letterSpacing: "0.02em",
          textDecoration: "none",
        }}>
           {label ? label : "Book a Free Consultation"}
          </button>
    </div>
  )
}
