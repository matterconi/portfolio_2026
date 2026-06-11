import React from 'react'
import HeroText from './HeroText'

const Hero = ({about}: {about: {name: string; tagline: string}}) => {
  return (
	<div>
		<section id="home" className="relative flex min-h-screen flex-col items-start justify-center py-20 w-full z-20">
          <HeroText name={about.name} tagline={about.tagline} />
        </section>
	</div>
  )
}

export default Hero
