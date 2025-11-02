import React, { useMemo, useState } from 'react'
import { CURRICULA, RIASEC_ITEMS, BIG5_ITEMS, LIKERT, HOBBY_TAGS, OCCUPATIONS } from './data'
import { LIKERT_SCORE, scoreRiasec, scoreBig5, hobbyTags, matchOccupations, becauseNote, htmlReport } from './utils'
import Navbar from './Navbar.jsx'
import Hero from './Hero.jsx'
import Auth from './Auth.jsx'
import Chatbot from './Chatbot.jsx'

function Pill({children}) {
  return <span className="inline-block px-3 py-1 rounded-full bg-gray-800 border border-gray-700 mr-2 mb-2 text-sm text-gray-200">{children}</span>
}

function Card({title, children, footer}) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl border border-gray-800 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-yellow-400">{title}</h3>
        {footer}
      </div>
      {children}
    </div>
  )
}

// RIASEC Slider Component
function RiasecSlider({ prompt, code, value, onChange }) {
  const colors = {
    R: 'bg-blue-500',
    I: 'bg-purple-500',
    A: 'bg-pink-500',
    S: 'bg-green-500',
    E: 'bg-orange-500',
    C: 'bg-indigo-500'
  }

  const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  
  const getWidth = () => `${(value / 5) * 100}%`

  return (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <span className="font-medium text-gray-200 text-sm">{prompt}</span>
          <span className="text-xs text-gray-500 ml-2">({code})</span>
        </div>
        <span className="text-lg font-bold text-yellow-400 min-w-[3rem] text-right ml-4">
          {value}
        </span>
      </div>
      
      <div className="relative">
        <div className="h-3 bg-gray-800 rounded-full relative overflow-hidden border border-gray-700">
          <div 
            className={`h-full ${colors[code]} transition-all duration-200 ease-out rounded-full`}
            style={{ width: getWidth() }}
          />
        </div>
        
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute top-0 w-full h-3 opacity-0 cursor-pointer"
        />
        
        <div className="flex justify-between mt-2 px-1">
          {labels.map((label, idx) => (
            <span 
              key={idx} 
              className="text-[10px] text-gray-500 text-center flex-1"
              style={{ maxWidth: '20%' }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Big Five Slider Component
function Big5Slider({ prompt, code, value, onChange }) {
  const colors = {
    O: 'bg-cyan-500',
    C: 'bg-teal-500',
    E: 'bg-amber-500',
    A: 'bg-rose-500',
    N: 'bg-violet-500'
  }

  const labels = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  
  const getWidth = () => `${(value / 5) * 100}%`

  return (
    <div className="mb-5">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <span className="font-medium text-gray-200 text-sm">{prompt}</span>
          <span className="text-xs text-gray-500 ml-2">({code})</span>
        </div>
        <span className="text-lg font-bold text-yellow-400 min-w-[3rem] text-right ml-4">
          {value}
        </span>
      </div>
      
      <div className="relative">
        <div className="h-3 bg-gray-800 rounded-full relative overflow-hidden border border-gray-700">
          <div 
            className={`h-full ${colors[code]} transition-all duration-200 ease-out rounded-full`}
            style={{ width: getWidth() }}
          />
        </div>
        
        <input
          type="range"
          min="1"
          max="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute top-0 w-full h-3 opacity-0 cursor-pointer"
        />
        
        <div className="flex justify-between mt-2 px-1">
          {labels.map((label, idx) => (
            <span 
              key={idx} 
              className="text-[10px] text-gray-500 text-center flex-1"
              style={{ maxWidth: '20%' }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Score Bar Component for Live Scores
function ScoreBar({ code, value, maxValue, color, label }) {
  const percentage = (value / maxValue) * 100
  
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-yellow-400">{code}</span>
          <span className="text-xs text-gray-400">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-200">{value}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
        <div 
          className={`h-full ${color} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default function App() {
  const [studentName, setStudentName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [curriculum, setCurriculum] = useState(CURRICULA[0])
  const [uaeOnly, setUaeOnly] = useState(true)

  const [riasecAnswers, setRiasecAnswers] = useState(Object.fromEntries(RIASEC_ITEMS.map(([,p])=>[p, 3])))
  const [useBig5, setUseBig5] = useState(true)
  const [big5Answers, setBig5Answers] = useState(Object.fromEntries(BIG5_ITEMS.map(([,p])=>[p, 3])))

  const hobbiesList = Object.keys(HOBBY_TAGS)
  const [hobbyChoices, setHobbyChoices] = useState([])
  const [hobbyFree, setHobbyFree] = useState('')

  const [submitted, setSubmitted] = useState(false)
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('compass_user')||'null') } catch(e) { return null }
  })
  if (!user) return <Auth onAuthed={u => { setUser(u); }} />

  const riasecPairs = useMemo(()=> RIASEC_ITEMS.map(([c,p])=> [c, riasecAnswers[p]]), [riasecAnswers])
  const big5Pairs   = useMemo(()=> BIG5_ITEMS.map(([c,p])=> [c, big5Answers[p]]), [big5Answers])

  const { agg: RIASEC_AGG, ordered: RIASEC_ORD, top3: RIASEC_TOP3 } = useMemo(()=> scoreRiasec(riasecPairs), [riasecPairs])
  const { norm: BIG5_NORM } = useMemo(()=> useBig5 ? scoreBig5(big5Pairs) : { norm: {O:0,C:0,E:0,A:0,N:0} }, [useBig5, big5Pairs])
  const TAGS = useMemo(()=> hobbyTags(hobbyChoices, hobbyFree, HOBBY_TAGS), [hobbyChoices, hobbyFree])

  const CAREERS = useMemo(()=> submitted ? matchOccupations(RIASEC_TOP3, BIG5_NORM, TAGS, OCCUPATIONS, uaeOnly).slice(0,5) : [], [submitted, RIASEC_TOP3, BIG5_NORM, TAGS, uaeOnly])

  const riasecLabels = {
    R: 'Realistic',
    I: 'Investigative', 
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional'
  }

  const riasecColors = {
    R: 'bg-blue-500',
    I: 'bg-purple-500',
    A: 'bg-pink-500',
    S: 'bg-green-500',
    E: 'bg-orange-500',
    C: 'bg-indigo-500'
  }

  const big5Labels = {
    O: 'Openness',
    C: 'Conscientiousness',
    E: 'Extraversion',
    A: 'Agreeableness',
    N: 'Neuroticism'
  }

  const big5Colors = {
    O: 'bg-cyan-500',
    C: 'bg-teal-500',
    E: 'bg-amber-500',
    A: 'bg-rose-500',
    N: 'bg-violet-500'
  }

  function onDownload() {
    const payload = {
      student_name: studentName || 'Student',
      school_name: schoolName || '—',
      curriculum,
      date: new Date().toISOString().slice(0,10),
      riasec_scores: RIASEC_AGG,
      riasec_top3: RIASEC_TOP3,
      big5_norm: BIG5_NORM,
      hobbies_selected: hobbyChoices,
      hobby_free: hobbyFree,
      tags: TAGS,
      careers: CAREERS,
      because_note: becauseNote(studentName || 'You', RIASEC_ORD, hobbyChoices, TAGS, curriculum),
    }
    const html = htmlReport(payload)
    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `Compass_Report_${(studentName || 'Student').replaceAll(' ','_')}.html`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar onLoginClick={()=>localStorage.removeItem('compass_user') || window.location.reload()}
              onJoinClick={()=>window.scrollTo({top: document.body.scrollHeight/3, behavior:'smooth'})} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Hero onExplore={()=>document.getElementById('quiz')?.scrollIntoView({behavior:'smooth'})} />
        <div id="quiz" className="h-6"></div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🧭 Compass – Career Match (Prototype)</h1>
        <p className="text-gray-400">RIASEC + Work-Style + Hobbies → Careers + Subjects + Because Note. Deployable on Netlify.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <Card title="Student & School">
          <div className="grid gap-4">
            <label className="text-sm text-gray-300">Student name
              <input className="mt-1 w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-900 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" 
                value={studentName} 
                onChange={e=>setStudentName(e.target.value)} 
                placeholder="Your name" />
            </label>
            <label className="text-sm text-gray-300">School name
              <input className="mt-1 w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-900 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" 
                value={schoolName} 
                onChange={e=>setSchoolName(e.target.value)} 
                placeholder="School" />
            </label>
            <label className="text-sm text-gray-300">Curriculum
              <select className="mt-1 w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-900 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" 
                value={curriculum} 
                onChange={e=>setCurriculum(e.target.value)}>
                {CURRICULA.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" 
                checked={uaeOnly} 
                onChange={e=>setUaeOnly(e.target.checked)} 
                className="rounded border-gray-700 bg-gray-900 text-yellow-400 focus:ring-yellow-400" />
              UAE relevant careers only
            </label>
          </div>
        </Card>

        <Card title="Hobbies">
          <div className="flex flex-wrap gap-2 mb-3">
            {hobbiesList.map(h => (
              <button key={h}
                onClick={()=> setHobbyChoices(prev => prev.includes(h) ? prev.filter(x=>x!==h) : [...prev, h])}
                className={`px-3 py-1 rounded-full border transition ${
                  hobbyChoices.includes(h) 
                    ? 'bg-yellow-400 text-black border-yellow-400 font-medium' 
                    : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-600'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          <input className="w-full border border-gray-700 rounded-lg px-3 py-2 bg-gray-900 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition" 
            value={hobbyFree} 
            onChange={e=>setHobbyFree(e.target.value)} 
            placeholder="Or describe your hobbies (e.g., photography, coding, robotics)" />
          {Boolean(TAGS.length) && (
            <div className="mt-3">
              <div className="text-sm text-gray-400 mb-1">Detected skills from hobbies</div>
              {TAGS.map(t => <Pill key={t}>{t}</Pill>)}
            </div>
          )}
        </Card>
      </div>

      <Card title="RIASEC (short)">
        <div className="grid gap-4">
          {RIASEC_ITEMS.map(([code, prompt]) => (
            <RiasecSlider
              key={prompt}
              prompt={prompt}
              code={code}
              value={riasecAnswers[prompt]}
              onChange={(value) => setRiasecAnswers(s => ({...s, [prompt]: value}))}
            />
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-5 my-6">
        <Card title="Work-Style (mini Big Five)" footer={
          <label className="text-sm inline-flex items-center gap-2 text-gray-300">
            <input type="checkbox" 
              checked={useBig5} 
              onChange={e=>setUseBig5(e.target.checked)} 
              className="rounded border-gray-700 bg-gray-900 text-yellow-400 focus:ring-yellow-400" />
            Include
          </label>
        }>
          {useBig5 ? (
            <div className="grid gap-4">
              {BIG5_ITEMS.map(([code, prompt]) => (
                <Big5Slider
                  key={prompt}
                  prompt={prompt}
                  code={code}
                  value={big5Answers[prompt]}
                  onChange={(value) => setBig5Answers(s => ({...s, [prompt]: value}))}
                />
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm">Personality enrichment disabled.</p>}
        </Card>

        <Card title="Live Scores">
          <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
            <div className="text-xs uppercase tracking-wide text-yellow-400 font-semibold mb-1">
              Top 3 RIASEC Profile
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {RIASEC_TOP3}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-3">
              RIASEC Scores
            </h4>
            {Object.entries(RIASEC_AGG).map(([code, value]) => (
              <ScoreBar
                key={code}
                code={code}
                value={value}
                maxValue={Math.max(...Object.values(RIASEC_AGG))}
                color={riasecColors[code]}
                label={riasecLabels[code]}
              />
            ))}
          </div>

          {useBig5 && (
            <div>
              <h4 className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-3">
                Work-Style Scores
              </h4>
              {Object.entries(BIG5_NORM).map(([code, value]) => (
                <ScoreBar
                  key={code}
                  code={code}
                  value={value}
                  maxValue={5}
                  color={big5Colors[code]}
                  label={big5Labels[code]}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="flex gap-3">
        <button onClick={()=>setSubmitted(true)} 
          className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-semibold shadow-lg hover:bg-yellow-300 transition transform hover:scale-105">
          Generate Matches
        </button>
        {submitted && (
          <button onClick={onDownload} 
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:from-green-400 hover:to-emerald-500 transition transform hover:scale-105">
            Download Report (HTML)
          </button>
        )}
      </div>

      {submitted && (
        <div className="my-6 grid gap-4">
          <Card title="Because Note">
            <p className="text-gray-300 leading-relaxed">{becauseNote(studentName || 'You', RIASEC_ORD, hobbyChoices, TAGS, curriculum)}</p>
          </Card>

          <Card title="Career Matches">
            {CAREERS.length === 0 && <p className="text-gray-400">No matches yet — adjust a couple of RIASEC answers or add a hobby.</p>}
            <div className="grid md:grid-cols-2 gap-4">
              {CAREERS.map(o => {
                const subs = o.subjects[curriculum] || {must:[], nice:[]}
                return (
                  <div key={o.title} className="border border-gray-800 rounded-xl p-5 bg-gradient-to-br from-gray-900 to-gray-950 hover:border-yellow-400/50 transition">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg text-white">{o.title}</h4>
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">RIASEC: {o.riasec}</span>
                    </div>
                    <p className="text-sm text-gray-400 my-3">{o.description}</p>
                    <div className="mb-3">{o.programs.map(p => <Pill key={p}>{p}</Pill>)}</div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div><span className="text-yellow-400 font-semibold">Must:</span> {subs.must?.join(', ') || '—'}</div>
                      <div><span className="text-yellow-400 font-semibold">Nice:</span> {subs.nice?.join(', ') || '—'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      </main>
      <footer className="mt-10 py-6 text-sm text-gray-500 text-center border-t border-gray-800">
        Compass Prototype · Frontend-only (no backend) · Hardcoded occupations for demo
      </footer>
      
      {/* AI Career Advisor Chatbot */}
      {submitted && (
        <Chatbot 
          studentName={studentName}
          riasecTop3={RIASEC_TOP3}
          careers={CAREERS}
          big5Norm={BIG5_NORM}
          tags={TAGS}
          curriculum={curriculum}
        />
      )}
    </div>
  )
}