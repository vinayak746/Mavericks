import React from 'react'
import Hero from '../components/Hero.jsx'
import LatestCollection from '../components/LatestCollection.jsx'
import BestSeller from '../components/BestSeller.jsx'
import OurPolicy from '../components/OurPolicy.jsx'
import NewsletterBox from '../components/NewsletterBox.jsx'

function Home() {
  return (
    <div>
        <Hero />
        <LatestCollection />
        <BestSeller />
        <OurPolicy />
        <NewsletterBox />
        
    </div>
  )
}

export default Home