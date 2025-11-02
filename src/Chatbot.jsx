import { useState, useRef, useEffect } from 'react'

export default function Chatbot({ studentName, riasecTop3, careers, big5Norm, tags, curriculum }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${studentName || 'there'}! 👋 I'm your career advisor AI. I can help you understand your ${riasecTop3} profile and the ${careers.length} career matches we found for you. What would you like to know?`
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generateResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase()

    // Career-specific questions
    if (lowerMsg.includes('career') || lowerMsg.includes('job')) {
      if (careers.length === 0) {
        return "You don't have any career matches yet. Try adjusting your RIASEC responses or adding some hobbies to get personalized recommendations!"
      }
      return `Based on your ${riasecTop3} profile, here are your top matches:\n\n${careers.slice(0, 3).map((c, i) => 
        `${i + 1}. **${c.title}** - ${c.description}`
      ).join('\n\n')}\n\nWould you like to know more about any specific career?`
    }

    // RIASEC explanation
    if (lowerMsg.includes('riasec') || lowerMsg.includes('profile') || lowerMsg.includes('type')) {
      const codes = riasecTop3.split('')
      const explanations = {
        R: 'Realistic (hands-on, practical work)',
        I: 'Investigative (analytical, research-focused)',
        A: 'Artistic (creative, expressive)',
        S: 'Social (helping, teaching others)',
        E: 'Enterprising (leadership, business)',
        C: 'Conventional (organized, detail-oriented)'
      }
      return `Your ${riasecTop3} profile means you're strongest in:\n\n${codes.map(c => 
        `• **${c}**: ${explanations[c]}`
      ).join('\n')}\n\nThis combination suggests you'd thrive in careers that blend these qualities!`
    }

    // Subjects question
    if (lowerMsg.includes('subject') || lowerMsg.includes('course') || lowerMsg.includes('study')) {
      if (careers.length > 0) {
        const firstCareer = careers[0]
        const subs = firstCareer.subjects[curriculum] || { must: [], nice: [] }
        return `For **${firstCareer.title}**, you'll need:\n\n**Must-have subjects:**\n${subs.must?.map(s => `• ${s}`).join('\n') || 'No specific requirements'}\n\n**Nice-to-have:**\n${subs.nice?.map(s => `• ${s}`).join('\n') || 'None specified'}\n\nWant to know about another career?`
      }
      return "Once you generate career matches, I can tell you exactly which subjects you need!"
    }

    // Personality/Big Five
    if (lowerMsg.includes('personality') || lowerMsg.includes('trait') || lowerMsg.includes('big')) {
      const traits = Object.entries(big5Norm)
        .filter(([_, v]) => v > 3)
        .map(([k, v]) => {
          const names = {
            O: 'Openness',
            C: 'Conscientiousness',
            E: 'Extraversion',
            A: 'Agreeableness',
            N: 'Emotional Stability'
          }
          return `• **${names[k]}**: ${v}/5`
        })
      
      if (traits.length > 0) {
        return `Your personality strengths:\n\n${traits.join('\n')}\n\nThese traits complement your RIASEC profile and support your career matches!`
      }
      return "Enable the Work-Style assessment to get personality insights!"
    }

    // Skills/hobbies
    if (lowerMsg.includes('skill') || lowerMsg.includes('hobby') || lowerMsg.includes('talent')) {
      if (tags.length > 0) {
        return `Based on your hobbies, you have these valuable skills:\n\n${tags.map(t => `• ${t}`).join('\n')}\n\nThese skills can give you an edge in careers like: ${careers.slice(0, 3).map(c => c.title).join(', ')}!`
      }
      return "Add some hobbies to discover hidden skills that match your career path!"
    }

    // Next steps
    if (lowerMsg.includes('next') || lowerMsg.includes('start') || lowerMsg.includes('how')) {
      return `Great question! Here's what I recommend:\n\n1. **Explore** the careers that interest you most\n2. **Research** the required subjects for ${curriculum}\n3. **Connect** with professionals in those fields\n4. **Develop** skills through projects and hobbies\n5. **Plan** your academic path accordingly\n\nNeed specific advice on any of these steps?`
    }

    // Specific career inquiry
    const careerMentioned = careers.find(c => 
      lowerMsg.includes(c.title.toLowerCase())
    )
    if (careerMentioned) {
      const subs = careerMentioned.subjects[curriculum] || { must: [], nice: [] }
      return `**${careerMentioned.title}**\n\n${careerMentioned.description}\n\n**Programs:** ${careerMentioned.programs.join(', ')}\n\n**Required subjects:**\n${subs.must?.join(', ') || 'None specified'}\n\nThis matches your ${riasecTop3} profile perfectly! Want to know more?`
    }

    // Default helpful response
    const responses = [
      `I can help you with:\n• Understanding your RIASEC profile\n• Explaining career matches\n• Subject requirements for ${curriculum}\n• Next steps in your career journey\n\nWhat interests you most?`,
      `Your ${riasecTop3} profile is unique! Ask me about specific careers, required subjects, or how your hobbies connect to your matches.`,
      `I'm here to help you understand your results. Try asking: "Why did I get these careers?" or "What subjects do I need?"`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = generateResponse(input)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 800)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition transform z-50"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border border-gray-800 flex flex-col z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-yellow-400/10 to-orange-500/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Career Advisor AI</h3>
                <p className="text-xs text-gray-400">Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-gray-800 text-gray-200 border border-gray-700'
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-medium rounded-lg transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}