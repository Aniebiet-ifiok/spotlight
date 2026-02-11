import Link from 'next/link'
import React from 'react'

type Props = {
  Icon: React.ReactNode
  heading: string
  link: string
}

const FeatureCard = ({ Icon, heading, link }: Props) => {
  return (
    <Link
      href={link}
      className="
        group relative overflow-hidden
        px-8 py-6 flex flex-col items-start justify-center gap-14
        rounded-xl border border-white/10
        bg-secondary/60 backdrop-blur-xl
        transition-all duration-500 ease-out
        hover:-translate-y-1 hover:shadow-2xl
      "
    >
      {/* animated green glass overlay */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-gradient-to-br
          from-emerald-400/20 via-green-500/10 to-lime-400/20
          opacity-0 group-hover:opacity-100
          transition-opacity duration-700
        "
      />

      {/* subtle moving shine */}
      <div
        className="
          pointer-events-none absolute -inset-[150%]
          bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.25),transparent_60%)]
          animate-spin-slow
        "
      />

      <div className="relative z-10">
        {Icon}
      </div>

      <p className="relative z-10 font-semibold text-xl text-primary">
        {heading}
      </p>
    </Link>
  )
}

export default FeatureCard
