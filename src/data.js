export const CURRICULA = ['IB','OSSD','CBSE']

export const OCCUPATIONS = [
  {
    title: 'Biomedical Illustrator',
    riasec: 'IAE',
    uae_relevant: true,
    description: 'Creates scientific and medical visuals; combines biology knowledge with artistic skills for education and communication.',
    programs: ['Biomedical Communications','Medical Illustration','Biology (with Design minor)'],
    subjects: {
      IB:   { must: ['Biology HL or SL','Visual Arts HL or SL'], nice: ['Chemistry SL','Design Tech SL']},
      OSSD: { must: ['Biology','Visual Arts'], nice: ['Chemistry','Functions']},
      CBSE: { must: ['Biology','Fine Arts'], nice: ['Chemistry','Computer Science']},
    }
  },
  {
    title: 'Data Analyst',
    riasec: 'IRC',
    uae_relevant: true,
    description: 'Analyzes structured/unstructured data to surface insights; communicates findings to stakeholders.',
    programs: ['Data Science','Statistics','Information Systems'],
    subjects: {
      IB:   { must: ['Math: AA/AI HL or SL'], nice: ['Economics SL','Computer Science SL']},
      OSSD: { must: ['Advanced Functions'], nice: ['Data Management','Economics']},
      CBSE: { must: ['Mathematics'], nice: ['Economics','Informatics Practices']},
    }
  },
  {
    title: 'UX Designer',
    riasec: 'AES',
    uae_relevant: true,
    description: 'Designs user experiences through research, prototyping, and usability testing across web/mobile products.',
    programs: ['Interaction Design','HCI','Communication Design'],
    subjects: {
      IB:   { must: ['Visual Arts HL or SL'], nice: ['Design Tech SL','Computer Science SL']},
      OSSD: { must: ['Visual Arts or Media Arts'], nice: ['Computer Science','English']},
      CBSE: { must: ['Fine Arts'], nice: ['Computer Science','English Core']},
    }
  },
  {
    title: 'Environmental Engineer',
    riasec: 'RIS',
    uae_relevant: true,
    description: 'Designs solutions for water, air, and sustainability challenges using engineering and scientific methods.',
    programs: ['Environmental Engineering','Civil Engineering'],
    subjects: {
      IB:   { must: ['Physics HL or SL','Math: AA HL or SL'], nice: ['Chemistry SL']},
      OSSD: { must: ['Advanced Functions','Physics'], nice: ['Chemistry','Calculus & Vectors']},
      CBSE: { must: ['Mathematics','Physics'], nice: ['Chemistry']},
    }
  },
  {
    title: 'Marketing Specialist',
    riasec: 'ESC',
    uae_relevant: true,
    description: 'Plans campaigns, analyzes audiences, and communicates brand value across channels.',
    programs: ['Marketing','Business Administration'],
    subjects: {
      IB:   { must: ['English A'], nice: ['Business Mgmt SL','Math AI SL']},
      OSSD: { must: ['English'], nice: ['Business','Data Management']},
      CBSE: { must: ['English Core'], nice: ['Business Studies','Economics','IP']},
    }
  },
]

export const HOBBY_TAGS = {
  Photography:['visual-storytelling','editing','detail-orientation','composition'],
  Painting:['visual-storytelling','color-theory','creativity'],
  Robotics:['mechanical-thinking','electronics','problem-solving'],
  Coding:['data-thinking','automation','logic'],
  Writing:['communication','research','storytelling'],
  Volunteering:['community','service','leadership'],
  Gaming:['systems-thinking','strategy','pattern-recognition'],
  Cooking:['process-design','creativity','precision'],
}

export const RIASEC_ITEMS = [
  ['R','I enjoy fixing or assembling physical things.'],
  ['R','I like using tools and machines.'],
  ['I','I enjoy solving science or math problems.'],
  ['I','I like analyzing data to find patterns.'],
  ['A','I enjoy creating art, design, or music.'],
  ['A','I like expressing ideas visually or through writing.'],
  ['S','I enjoy helping or teaching other people.'],
  ['S','I like supporting friends or classmates when they’re stuck.'],
  ['E','I enjoy leading projects or persuading groups.'],
  ['E','I like organizing events and taking charge.'],
  ['C','I enjoy organizing information with rules and structure.'],
  ['C','I like following checklists and keeping records tidy.'],
]

export const BIG5_ITEMS = [
  ['O','I enjoy trying new approaches at school/work.'],
  ['O','I’m curious about unfamiliar topics.'],
  ['C','I plan my tasks and follow through.'],
  ['C','I keep my workspace and files organized.'],
  ['E','I gain energy from group activities.'],
  ['E','I like speaking up in discussions.'],
  ['A','I try to see others’ points of view.'],
  ['A','I enjoy teamwork and collaboration.'],
  ['N','I stay calm under pressure.'],
  ['N','I bounce back quickly after setbacks.'],
]

export const LIKERT = ['Strongly disagree','Disagree','Neutral','Agree','Strongly agree']
