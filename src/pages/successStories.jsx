import React from 'react'
import SuccessStoriesHero from '../components/SuccessStories/successStoriesHero'
import SuccessStoriesVideoSection from '../components/SuccessStories/successStoriesVideo'
import TransformationSection from '../components/SuccessStories/SuccessStoriesImages'
import ShareYourStorySection from '../components/SuccessStories/successCTASection'
export default function SuccessStories() {
  return (
    <div>
        <SuccessStoriesHero/>
        <SuccessStoriesVideoSection/>
        <TransformationSection/>
        <ShareYourStorySection/>
    </div>
  )
}
