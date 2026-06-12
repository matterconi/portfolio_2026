import React from 'react'
import HeroText from './HeroText'

interface HeroProps {
  about: {name: string; tagline: string};
  ctaLabel?: string;
}

const Hero = ({about, ctaLabel}: HeroProps) => {
  return (
	<div>
		<section id="home" className="relative flex min-h-screen flex-col items-start justify-center py-20 w-full z-20">
          <HeroText name={about.name} tagline={about.tagline} ctaLabel={ctaLabel} />
        </section>
	</div>
  )
}

export default Hero
