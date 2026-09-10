import React, { useRef, useState, useEffect } from 'react'
import { HeartHandshake,Form ,Earth ,HandHeart  } from 'lucide-react'

const features =[
    {
       title:"Real-time interaction with experts" ,
       icon:HeartHandshake
    },
     {
       title:"Practical advice on fitness, nutrition, skin care, and mental health" ,
       icon:Form
    }
,
 {
       title:"Accessible from anywhere, anytime" ,
       icon:Earth
    },
     {
       title:"Tailored for moms at every stage of motherhood" ,
       icon:HandHeart
    }
]
export default function WebinarFeatures() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node); // animate only once
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className=' flex justify-center py-14 bg-white '>
         <div className='max-w-5xl'>
                                        <div className='grid grid-cols-2 md:grid-cols-4 max-w-5xl sm:gap-6 gap-2'>

            {
                features.map(
                    (f,i) => {return(
                        <div key={i}>

                                <div
                                  className={` flex flex-col items-center transition-all duration-700 ease-out ${
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                                  }`}
                                  style={{ transitionDelay: isVisible ? `${i * 120}ms` : "0ms" }}
                                >
                                    <f.icon className='text-teal-800 w-8 h-8 '/>
                               <p className='text-center pt-6 sm:text-lg text-sm '>{f.title}</p>
                                    </div>
                                    </div>
                        
                )}
                )
            }
            </div>
    </div>
    </section>
  )
}