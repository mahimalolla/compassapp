import React, { useMemo, useState } from 'react'
import { CURRICULA, RIASEC_ITEMS, BIG5_ITEMS, LIKERT, HOBBY_TAGS, OCCUPATIONS } from './data'
import { LIKERT_SCORE, scoreRiasec, scoreBig5, hobbyTags, matchOccupations, becauseNote, htmlReport } from './utils'

function Pill({children}) {
  return <span className="inline-block px-3 py-1 rounded-full bg-gray-100 mr-2 mb-2 text-sm">{children}</span>
}

function Card({title, children, footer}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        {footer}
      </div>
      {children}
    </div>
  )
}

import Navbar from './Navbar.jsx'
import Hero from './Hero.jsx'
import Auth from './Auth.jsx'

export default function App() {
  const [studentName, setStudentName] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [curriculum, setCurriculum] = useState(CURRICULA[0])
  const [uaeOnly, setUaeOnly] = useState(true)

  const [riasecAnswers, setRiasecAnswers] = useState(Object.fromEntries(RIASEC_ITEMS.map(([,p])=>[p,'Neutral'])))
  const [useBig5, setUseBig5] = useState(true)
  const [big5Answers, setBig5Answers] = useState(Object.fromEntries(BIG5_ITEMS.map(([,p])=>[p,'Neutral'])))

  const hobbiesList = Object.keys(HOBBY_TAGS)
  const [hobbyChoices, setHobbyChoices] = useState([])
  const [hobbyFree, setHobbyFree] = useState('')

  const [submitted, setSubmitted] = useState(false)
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('compass_user')||'null') } catch(e) { return null }
  })
  if (!user) return <Auth onAuthed={u => { setUser(u); }} />


  const riasecPairs = useMemo(()=> RIASEC_ITEMS.map(([c,p])=> [c, LIKERT_SCORE(riasecAnswers[p])]), [riasecAnswers])
  const big5Pairs   = useMemo(()=> BIG5_ITEMS.map(([c,p])=> [c, LIKERT_SCORE(big5Answers[p])]), [big5Answers])

  const { agg: RIASEC_AGG, ordered: RIASEC_ORD, top3: RIASEC_TOP3 } = useMemo(()=> scoreRiasec(riasecPairs), [riasecPairs])
  const { norm: BIG5_NORM } = useMemo(()=> useBig5 ? scoreBig5(big5Pairs) : { norm: {O:0,C:0,E:0,A:0,N:0} }, [useBig5, big5Pairs])
  const TAGS = useMemo(()=> hobbyTags(hobbyChoices, hobbyFree, HOBBY_TAGS), [hobbyChoices, hobbyFree])

  const CAREERS = useMemo(()=> submitted ? matchOccupations(RIASEC_TOP3, BIG5_NORM, TAGS, OCCUPATIONS, uaeOnly).slice(0,5) : [], [submitted, RIASEC_TOP3, BIG5_NORM, TAGS, uaeOnly])

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
    <div>
      <Navbar onLoginClick={()=>localStorage.removeItem('compass_user') || window.location.reload()}
              onJoinClick={()=>window.scrollTo({top: document.body.scrollHeight/3, behavior:'smooth'})} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Hero onExplore={()=>document.getElementById('quiz')?.scrollIntoView({behavior:'smooth'})} />
        <div id="quiz" className="h-6"></div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">🧭 Compass – Career Match (Prototype)</h1>
        <p className="text-gray-600">RIASEC + Work-Style + Hobbies → Careers + Subjects + Because Note. Deployable on Netlify.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <Card title="Student & School">
          <div className="grid gap-3">
            <label className="text-sm">Student name
              <input className="mt-1 w-full border rounded-lg px-3 py-2" value={studentName} onChange={e=>setStudentName(e.target.value)} placeholder="Your name" />
            </label>
            <label className="text-sm">School name
              <input className="mt-1 w-full border rounded-lg px-3 py-2" value={schoolName} onChange={e=>setSchoolName(e.target.value)} placeholder="School" />
            </label>
            <label className="text-sm">Curriculum
              <select className="mt-1 w-full border rounded-lg px-3 py-2" value={curriculum} onChange={e=>setCurriculum(e.target.value)}>
                {CURRICULA.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={uaeOnly} onChange={e=>setUaeOnly(e.target.checked)} />
              UAE relevant careers only
            </label>
          </div>
        </Card>

        <Card title="Hobbies">
          <div className="flex flex-wrap gap-2 mb-3">
            {hobbiesList.map(h => (
              <button key={h}
                onClick={()=> setHobbyChoices(prev => prev.includes(h) ? prev.filter(x=>x!==h) : [...prev, h])}
                className={`px-3 py-1 rounded-full border ${hobbyChoices.includes(h) ? 'bg-blue-600 text-white border-blue-600':'bg-white text-gray-700 border-gray-300'}`}
              >
                {h}
              </button>
            ))}
          </div>
          <input className="w-full border rounded-lg px-3 py-2" value={hobbyFree} onChange={e=>setHobbyFree(e.target.value)} placeholder="Or describe your hobbies (e.g., photography, coding, robotics)" />
          {Boolean(TAGS.length) && (
            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">Detected skills from hobbies</div>
              {TAGS.map(t => <Pill key={t}>{t}</Pill>)}
            </div>
          )}
        </Card>
      </div>

      <Card title="RIASEC (short)">
        <div className="grid md:grid-cols-2 gap-4">
          {RIASEC_ITEMS.map(([code, prompt]) => (
            <label key={prompt} className="text-sm">
              <span className="block font-medium">{prompt}</span>
              <select className="mt-1 w-full border rounded-lg px-3 py-2"
                value={riasecAnswers[prompt]}
                onChange={e=>setRiasecAnswers(s => ({...s, [prompt]: e.target.value}))}
              >
                {LIKERT.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-5 my-6">
        <Card title="Work-Style (mini Big Five)" footer={
          <label className="text-sm inline-flex items-center gap-2">
            <input type="checkbox" checked={useBig5} onChange={e=>setUseBig5(e.target.checked)} />
            Include
          </label>
        }>
          {useBig5 ? (
            <div className="grid gap-3">
              {BIG5_ITEMS.map(([code, prompt]) => (
                <label key={prompt} className="text-sm">
                  <span className="block font-medium">{prompt}</span>
                  <select className="mt-1 w-full border rounded-lg px-3 py-2"
                    value={big5Answers[prompt]}
                    onChange={e=>setBig5Answers(s => ({...s, [prompt]: e.target.value}))}
                  >
                    {LIKERT.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </label>
              ))}
            </div>
          ) : <p className="text-gray-600 text-sm">Personality enrichment disabled.</p>}
        </Card>

        <Card title="Live Scores">
          <div className="mb-2 text-sm text-gray-600">Top 3 RIASEC: <b>{RIASEC_TOP3}</b></div>
          <div className="mb-3">
            {Object.entries(RIASEC_AGG).map(([k,v]) => <Pill key={k}>{k}: {v}</Pill>)}
          </div>
          <div>
            {Object.entries(BIG5_NORM).map(([k,v]) => <Pill key={k}>{k}: {v}</Pill>)}
          </div>
        </Card>
      </div>

      <div className="flex gap-3">
        <button onClick={()=>setSubmitted(true)} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700">Generate Matches</button>
        {submitted && <button onClick={onDownload} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700">Download Report (HTML)</button>}
      </div>

      {submitted && (
        <div className="my-6 grid gap-4">
          <Card title="Because Note">
            <p className="text-gray-700">{becauseNote(studentName || 'You', RIASEC_ORD, hobbyChoices, TAGS, curriculum)}</p>
          </Card>

          <Card title="Career Matches">
            {CAREERS.length === 0 && <p className="text-gray-600">No matches yet — adjust a couple of RIASEC answers or add a hobby.</p>}
            <div className="grid md:grid-cols-2 gap-4">
              {CAREERS.map(o => {
                const subs = o.subjects[curriculum] || {must:[], nice:[]}
                return (
                  <div key={o.title} className="border rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{o.title}</h4>
                      <span className="text-xs text-gray-600">RIASEC: {o.riasec}</span>
                    </div>
                    <p className="text-sm text-gray-700 my-2">{o.description}</p>
                    <div className="mb-2">{o.programs.map(p => <Pill key={p}>{p}</Pill>)}</div>
                    <div className="text-sm">
                      <div><b>Must:</b> {subs.must?.join(', ') || '—'}</div>
                      <div><b>Nice:</b> {subs.nice?.join(', ') || '—'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      )}

      </main>
      <footer className="mt-10 text-sm text-gray-500 text-center">
        Compass Prototype · Frontend-only (no backend) · Hardcoded occupations for demo
      </footer>
    </div>
  )
}
