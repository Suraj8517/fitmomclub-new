import React from 'react'
import OurAppHero from '../components/OurApp/OurAppHero'
import PhoneMockupSection from '../components/OurApp/OurAppMockup'
import OurAppHealthCoachSection from '../components/OurApp/PersonalHealthCoach'
import OurAppDataSection from '../components/OurApp/OurAppDataSection'
import GetToKnowSection from '../components/OurApp/OurAppGetToKnow'
import CTASection from '../components/OurApp/OurAppCTA'

export default function OurAppPage() {
  return (
    <>
    <OurAppHero/>
    <PhoneMockupSection/>
    <OurAppHealthCoachSection/>
    <OurAppDataSection/>
    <GetToKnowSection/>
    <CTASection/>
    </>
  )
}
