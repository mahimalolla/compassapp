export const LIKERT_SCORE = (label) => ({
  'Strongly disagree': 1,
  'Disagree': 2,
  'Neutral': 3,
  'Agree': 4,
  'Strongly agree': 5,
}[label] || 3)

export function scoreRiasec(pairs) {
  const agg = {R:0,I:0,A:0,S:0,E:0,C:0}
  pairs.forEach(([code, val]) => { agg[code] += val })
  const ordered = Object.entries(agg).sort((a,b)=> b[1]-a[1] || a[0].localeCompare(b[0]))
  const top3 = ordered.slice(0,3).map(([c])=>c).join('')
  return { agg, ordered, top3 }
}

export function scoreBig5(pairs) {
  const agg = {O:0,C:0,E:0,A:0,N:0}
  pairs.forEach(([code, val]) => { agg[code] += val })
  const norm = Object.fromEntries(Object.entries(agg).map(([k,v])=> [k, Math.round(v*100/10)]))
  return { agg, norm }
}

export function hobbyTags(hobbyChoices, freeText, HOBBY_TAGS) {
  const tags = new Set()
  hobbyChoices.forEach(h => (HOBBY_TAGS[h]||[]).forEach(t=>tags.add(t)))
  if (freeText) {
    const S = freeText.toLowerCase()
    const has = kw => S.includes(kw)
    if (has('photo') || has('camera')) (HOBBY_TAGS['Photography']||[]).forEach(t=>tags.add(t))
    if (has('paint') || has('art') || has('sketch')) (HOBBY_TAGS['Painting']||[]).forEach(t=>tags.add(t))
    if (has('robot')) (HOBBY_TAGS['Robotics']||[]).forEach(t=>tags.add(t))
    if (has('code') || has('python') || has('java') || has('js')) (HOBBY_TAGS['Coding']||[]).forEach(t=>tags.add(t))
    if (has('write') || has('poetry') || has('blog')) (HOBBY_TAGS['Writing']||[]).forEach(t=>tags.add(t))
  }
  return [...tags].sort()
}

export function matchOccupations(top3, big5Norm, tags, occupations, uaeOnly=true) {
  const overlap = (a,b) => new Set(a.split('')).intersection ? [...new Set(a)].filter(x=>b.includes(x)).length : [...new Set(a)].filter(x=>b.includes(x)).length
  const pool = occupations.filter(o => (!uaeOnly || o.uae_relevant) && overlap(o.riasec, top3) >= 2)
  const scored = pool.map(o => {
    let base = overlap(o.riasec, top3) * 10
    if (o.title.includes('Illustrator') || o.title.includes('Designer')) {
      base += Math.round(0.2*(big5Norm.O||0))
      if (tags.some(t => ['visual-storytelling','creativity','color-theory','composition'].includes(t))) base += 8
    }
    if (o.title.includes('Data Analyst') || o.title.includes('Engineer')) {
      base += Math.round(0.2*(big5Norm.C||0))
      if (tags.some(t => ['data-thinking','logic','problem-solving','systems-thinking'].includes(t))) base += 8
    }
    return {score: base, o}
  })
  scored.sort((a,b)=> b.score - a.score || a.o.title.localeCompare(b.o.title))
  return scored.map(s => s.o)
}

export function becauseNote(studentName, riasecOrdered, hobbies, tags, curriculum) {
  const topLetters = riasecOrdered.slice(0,2).map(([c])=>c).join(' + ')
  const hobbyPhrase = hobbies.length ? ` and listed ${hobbies.join(', ')} as a hobby` : ''
  const tagHint = tags.length ? ` (skills spotted: ${tags.slice(0,3).join(', ')}${tags.length>3?'…':''})` : ''
  return `Because you scored high on ${topLetters}${hobbyPhrase}${tagHint}, you may enjoy careers that blend those strengths. We’ve aligned suggestions with your ${curriculum} curriculum.`
}

export function htmlReport(payload) {
  const style = `
  <style>
    body { font-family: Inter, -apple-system, Segoe UI, Roboto, Arial; padding: 24px; }
    h1 { margin-bottom: 0; }
    .muted { color: #555; }
    .card { border: 1px solid #eee; border-radius: 12px; padding: 16px; margin: 12px 0; background: #fff; }
    .pill { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #f2f4f7; margin-right: 8px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border-bottom: 1px solid #eee; padding: 8px; text-align: left; vertical-align: top; }
    .small { font-size: 12px; }
  </style>`

  const pills = obj => Object.entries(obj).map(([k,v])=>`<span class='pill'>${k}: ${v}</span>`).join('')

  const careers = payload.careers.map(o => {
    const subs = o.subjects[payload.curriculum] || { must: [], nice: [] }
    const must = (subs.must || []).join(', ') || '—'
    const nice = (subs.nice || []).join(', ') || '—'
    return `
    <div class="card">
      <h3>${o.title}</h3>
      <div class="muted small">RIASEC: ${o.riasec} • UAE relevant: ${o.uae_relevant ? 'Yes':'No'}</div>
      <p>${o.description}</p>
      <div>${o.programs.map(p=>`<span class='pill'>${p}</span>`).join('')}</div>
      <table>
        <tr><th width="160">Subject suggestions</th><td><b>Must</b>: ${must}<br><b>Nice</b>: ${nice}</td></tr>
      </table>
    </div>`
  }).join('')

  return `
  <html><head><meta charset="utf-8">${style}</head><body>
    <h1>Compass Report</h1>
    <div class="muted">Student: <b>${payload.student_name}</b> • School: <b>${payload.school_name}</b> • Date: ${payload.date}</div>
    <div class="card">
      <h3>RIASEC Summary</h3>
      <div>${pills(payload.riasec_scores)}</div>
      <div class="small muted">Top 3 code: <b>${payload.riasec_top3}</b></div>
    </div>
    <div class="card">
      <h3>Personality (Work-Style)</h3>
      <div>${pills(payload.big5_norm)}</div>
    </div>
    <div class="card">
      <h3>Because Note</h3>
      <p>${payload.because_note}</p>
    </div>
    <div class="card">
      <h3>Career Matches</h3>
      ${careers}
    </div>
    <div class="card">
      <h3>Next Steps</h3>
      <ol>
        <li>Discuss these options with your counselor/parents.</li>
        <li>Explore one program from the list and check detailed entry requirements.</li>
        <li>Pick 1–2 “nice” subjects that align with your interests to keep options open.</li>
      </ol>
    </div>
  </body></html>`
}
