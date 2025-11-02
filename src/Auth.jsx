import React, { useState } from 'react'

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  function submit(e) {
    e.preventDefault()
    // Fake auth: store a flag (and name) in localStorage
    const user = { email, name: name || email.split('@')[0] }
    localStorage.setItem('compass_user', JSON.stringify(user))
    onAuthed(user)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold">🧭</div>
          <div className="text-xl font-bold">PROPLR</div>
        </div>
        <h1 className="text-2xl font-semibold text-center">Welcome</h1>
        <p className="text-center text-gray-600 mb-6">Sign {mode==='signup'?'up':'in'} to continue</p>

        <form onSubmit={submit} className="grid gap-3">
          {mode==='signup' && (
            <label className="text-sm">Full name
              <input className="mt-1 w-full border rounded-lg px-3 py-2" value={name} onChange={e=>setName(e.target.value)} required />
            </label>
          )}
          <label className="text-sm">Email
            <input type="email" className="mt-1 w-full border rounded-lg px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required />
          </label>
          <label className="text-sm">Password
            <input type="password" className="mt-1 w-full border rounded-lg px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} required />
          </label>

          <button type="submit" className="mt-2 py-2.5 rounded-xl text-black font-medium shadow"
            style={{background:'linear-gradient(180deg,#FFD05A,#FFB636)'}}>
            {mode==='signup' ? 'Create account' : 'Log in'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          {mode==='signup' ? (
            <>Already have an account?{' '}
              <button onClick={()=>setMode('login')} className="underline decoration-gray-400">Log in</button></>
          ) : (
            <>New here?{' '}
              <button onClick={()=>setMode('signup')} className="underline decoration-gray-400">Create an account</button></>
          )}
        </div>
      </div>
    </div>
  )
}
