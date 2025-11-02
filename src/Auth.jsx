import { useState } from 'react'
import logo from './assets/logo.png'

export default function Auth({ onAuthed }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const fakeUser = { email, name: name || email.split('@')[0] }
    localStorage.setItem('compass_user', JSON.stringify(fakeUser))
    onAuthed(fakeUser)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border border-gray-800 p-8">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <img 
              src={logo}
              alt="Proplr Logo" 
              className="h-16 w-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-white mb-1">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Sign in to continue' : 'Join Compass Career Match'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition"
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition transform hover:scale-105 shadow-lg mt-6"
            >
              {isLogin ? 'Log In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 hover:text-yellow-400 text-sm transition"
            >
              {isLogin ? (
                <>
                  New here?{' '}
                  <span className="text-yellow-400 font-medium">Create an account</span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span className="text-yellow-400 font-medium">Log in</span>
                </>
              )}
            </button>
          </div>

          {/* Demo Notice */}
          <div className="mt-6 p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              🔓 Demo mode: Use any email/password to continue
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          Compass Career Match · Powered by Proplr
        </p>
      </div>
    </div>
  )
}