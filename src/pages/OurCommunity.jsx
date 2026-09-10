import React from 'react'
import OurCommunityHero from '../components/OurCommunity/OurCommunityHero'
import WhyJoinCommunity from '../components/OurCommunity/OurCommunityWhyJoin'
import CommunityFeatures from '../components/OurCommunity/CommunityFeatures'
import CTASection from '../components/OurCommunity/ourCommunityCTA'
import FitMomSuccessSection from '../components/OurCommunity/ourCommunitySuccess'

export default function OurCommunity() {
  return (
   <>
   <OurCommunityHero/>
   <WhyJoinCommunity/>
   <CommunityFeatures/>
   <FitMomSuccessSection/>
   <CTASection/>
   </>
  )
}
