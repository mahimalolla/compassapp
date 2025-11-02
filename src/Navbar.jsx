import logo from './assets/logo.png'

export default function Navbar({ onLoginClick, onJoinClick }) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <img 
            src={logo}
            alt="Proplr Logo" 
            className="h-10 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Compass</h1>
            <p className="text-xs text-gray-500">Career Match Platform</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={onJoinClick}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Get Started
          </button>
          <button 
            onClick={onLoginClick}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}