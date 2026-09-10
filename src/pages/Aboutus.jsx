import React from 'react'
import AboutUsHero from '../components/Aboutus/AboutUsHero'
import AboutUsSecondSection from '../components/Aboutus/AboutUsSecondSection'
import HowItWorksSection from '../components/Aboutus/AboutUsHowItWorks'
import AboutUsPurpose from '../components/Aboutus/AboutUsPurposeSection'
import AboutUsStorySection from '../components/Aboutus/AboutUsStorySection'
import AboutUsTeamSection from '../components/Aboutus/AboutUsTeam'
import WhyFitMomSection from '../components/Aboutus/AboutUsFitMomSection'
import OurApproachSection from '../components/Aboutus/AboutUsOurApproachSection'

export default function 
() {
  return (
    <div>
        <HowItWorksSection/>
        <AboutUsSecondSection/>
        <AboutUsPurpose/>
        <AboutUsStorySection/>
        <AboutUsTeamSection/>
        <WhyFitMomSection/>
        <OurApproachSection/>
    </div>
  )
}
