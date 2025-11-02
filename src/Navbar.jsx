import React from 'react'

export default function Navbar({ onLoginClick, onJoinClick }) {
  return (
    <div className="w-full sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white font-bold">🧭</div>
          <div className="font-bold text-lg">PROPLR</div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a href="#" className="hover:text-black">About Us</a>
          <a href="#" className="hover:text-black">Get Involved</a>
          <a href="#" className="hover:text-black">Resources</a>
          <a href="#" className="hover:text-black">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={onJoinClick}
            className="px-4 py-2 rounded-full text-black font-medium shadow"
            style={{background:'linear-gradient(180deg,#FFD05A,#FFB636)'}}
          >
            Join Now
          </button>
          <button onClick={onLoginClick}
            className="px-3 py-2 rounded-full border border-gray-300 text-gray-800 bg-white hover:bg-gray-50">
            Log In
          </button>
        </div>
      </div>
    </div>
  )
}
