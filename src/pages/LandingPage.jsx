import React from 'react'
import HomePage from './HomePage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Aboutus from './Aboutus';
import Navbar from '../components/NavBar';
import OurAppPage from './OurAppPage';
import OurCommunity from './OurCommunity'
import SuccessStories from './successStories';
import WebinarPage from './WebinarPage';
import FAQPage from './FAQPage';
import BMICalculator from './Calculators/BMI';
import WaterIntakeCalculator from './Calculators/WaterIntake';
import ProteinIntakeCalculator from './Calculators/ProteinCalculator';
import BodyFatCalculator from './Calculators/BodyFatCalculator';
import OvulationCalculator from './Calculators/OvulationCalculator';
import PregnancyCalculator from './Calculators/PregnancyCalculator';
import MenstrualCycleCalculator from './Calculators/MenstrualCalculator';
import BMRCalculator from './Calculators/BMR';
import HeartRateCalculator from './Calculators/HeartRateCalculator';
import CalorieCalculator from './Calculators/CalorieCalculator';
import WeightGoalCalculator from './Calculators/WeightLossCalculator';
import HealthCalculators from './HealthCalculators';
import ContactUs from './contactUsPage';
import BookConsultationForm from './BookConsultation';
import TermsAndConditions from './TermsAndConditions';
import PrivacyPage from './PrivacyPolicy';
import Footer from '../components/Footer';
import ScrollToTop from '../components/Helper/ScrollToTop';
import Blog from './blogs';
import BlogPost from './blogPost';
import Miracle from './programs/miracle';
import FMC from './programs/fmc';
import NotFound from './notFound';
import PopupForm from '../components/Helper/PopupForm';
export default function LandingPage() {
  return (
    <>
    <Router>
    <ScrollToTop/> 
      <Navbar/>
      <PopupForm scriptURL="https://script.google.com/macros/s/AKfycbwyFQzwNGKRkxEP3NAZgZJuvz53ehI50gvciFiK9zmld7UrmO1KQlmY7KrpVIwDFyw/exec"/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/about-us' element={<Aboutus/>}/>
        <Route path='/our-app' element={<OurAppPage/>}/>
        <Route path='/community' element={<OurCommunity/>}/>
        <Route path='/success-stories' element={<SuccessStories/>}/>
        <Route path='/webinars' element={<WebinarPage/>}/>
        <Route path='/FAQs' element={<FAQPage/>}/>
        <Route path='/bmi-calculator' element={<BMICalculator/>}/>
        <Route path='/water-intake-calculator' element={<WaterIntakeCalculator/>}/>
        <Route path='/protein-intake-calculator' element={<ProteinIntakeCalculator/>}/>
        <Route path='/body-fat-calculator' element={<BodyFatCalculator/>}/>
        <Route path='/ovulation-calculator' element={<OvulationCalculator/>}/>
        <Route path='/pregnancy-calculator' element={<PregnancyCalculator/>}/>
        <Route path='/menstrual-cycle-calculator' element={<MenstrualCycleCalculator/>}/>
        <Route path='/bmr-calculator' element={<BMRCalculator/>}/>
        <Route path='/heart-rate-calculator' element={<HeartRateCalculator/>}/>
        <Route path='/calorie-calculator' element={<CalorieCalculator/>}/>
        <Route path='/weight-loss-calculator' element={<WeightGoalCalculator/>}/>
        <Route path='/health-calculators' element={<HealthCalculators/>}/>
        <Route path='/contact-us' element={<ContactUs/>}/>
        <Route path='/book-consultation' element={<BookConsultationForm/>}/>
        <Route path='/terms-and-conditions' element={<TermsAndConditions/>}/>
        <Route path='/privacy-policy' element={<PrivacyPage/>}/>
        <Route path='/blogs' element={<Blog/>}/>
        <Route path="/blogs/:slug" element={<BlogPost />} /> 
        <Route path='/miracle' element={<Miracle/>}/>
        <Route path='/fmc' element={<FMC/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Footer/>
    </Router>
    </>
  )
}
