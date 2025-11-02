import React from 'react'

export default function Hero({ onExplore }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-black">
      <img
        src="https://images.unsplash.com/photo-1596495578065-8a4b1a2c4a4e?q=80&w=1600&auto=format&fit=crop"
        alt="Students collaborating"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="relative p-8 md:p-12">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
            <span className="block">Explore, Experience & Elevate</span>
            <span className="block mt-2">
              <span className="text-white">with</span>{' '}
              <span className="bg-black/60 px-2 rounded-md">Proplr</span>
            </span>
          </h2>
          <p className="text-gray-100/90 mt-4 max-w-2xl">
            Discover careers, build projects, earn skills — guided by real industry exposure.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="#" className="px-5 py-3 rounded-full font-medium text-black"
               style={{background:'linear-gradient(180deg,#FFD05A,#FFB636)'}}>Book a Demo</a>
            <button onClick={onExplore}
              className="px-5 py-3 rounded-full font-medium bg-white text-gray-900 hover:bg-gray-100">
              Explore Proplr
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
