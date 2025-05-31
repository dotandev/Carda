"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Mic, MicOff, Send, Brain, Activity, Heart, Zap, TrendingUp, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  metadata?: {
    confidence?: number
    suggestions?: string[]
    medicalData?: any
  }
}

interface MedicalAIAssistantProps {
  patientData?: {
    name: string
    age: number
    conditions: string[]
    medications: string[]
    vitals: {
      heartRate: number
      bloodPressure: string
      temperature: number
    }
  }
}

export function MedicalAIAssistant({ patientData }: MedicalAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm ARIA (Advanced Reasoning Intelligence Assistant). I'm here to help with medical analysis, drug interactions, and health insights. How can I assist you today?",
      timestamp: new Date(),
      metadata: { confidence: 100 },
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const aiResponses = [
    {
      trigger: ["blood pressure", "hypertension", "bp"],
      response:
        "Based on the patient's blood pressure reading of {bp}, I recommend monitoring closely. Normal range is 120/80 mmHg. Consider lifestyle modifications and medication review.",
      confidence: 92,
      suggestions: ["Schedule follow-up", "Review medications", "Lifestyle counseling"],
    },
    {
      trigger: ["drug interaction", "medication", "pills"],
      response:
        "I've analyzed the current medication list. There's a potential interaction between Lisinopril and NSAIDs that could reduce effectiveness. Consider alternative pain management.",
      confidence: 88,
      suggestions: ["Alternative medications", "Dosage adjustment", "Specialist consultation"],
    },
    {
      trigger: ["symptoms", "diagnosis", "condition"],
      response:
        "The symptom pattern suggests several possibilities. Based on medical literature and patient history, I recommend further diagnostic tests to rule out differential diagnoses.",
      confidence: 85,
      suggestions: ["Order lab tests", "Imaging studies", "Specialist referral"],
    },
    {
      trigger: ["emergency", "urgent", "critical"],
      response:
        "⚠️ URGENT: Based on the symptoms described, this requires immediate medical attention. Activating emergency protocol and notifying on-call physician.",
      confidence: 95,
      suggestions: ["Call emergency services", "Prepare for transport", "Notify family"],
    },
  ]

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()

    // Find matching response
    const matchedResponse = aiResponses.find((response) =>
      response.trigger.some((trigger) => lowerMessage.includes(trigger)),
    )

    if (matchedResponse) {
      let content = matchedResponse.response

      // Replace placeholders with actual data
      if (patientData?.vitals.bloodPressure) {
        content = content.replace("{bp}", patientData.vitals.bloodPressure)
      }

      return {
        id: Date.now().toString(),
        type: "ai",
        content,
        timestamp: new Date(),
        metadata: {
          confidence: matchedResponse.confidence,
          suggestions: matchedResponse.suggestions,
        },
      }
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: "ai",
      content:
        "I'm analyzing your query using advanced medical AI algorithms. Based on current medical literature and patient data, I'll provide evidence-based recommendations. Could you provide more specific details?",
      timestamp: new Date(),
      metadata: {
        confidence: 75,
        suggestions: ["Provide more details", "Check patient history", "Review symptoms"],
      },
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsProcessing(true)
    setAiThinking(true)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 2000))

    const aiResponse = generateAIResponse(inputValue)
    setMessages((prev) => [...prev, aiResponse])
    setIsProcessing(false)
    setAiThinking(false)
  }

  const startVoiceRecognition = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setInputValue("Patient experiencing chest pain and shortness of breath")
      setIsListening(false)
    }, 3000)
  }

  const AIThinkingAnimation = () => (
    <motion.div className="flex items-center gap-2 text-cyan-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Brain className="w-4 h-4" />
      <span className="text-sm">ARIA is analyzing...</span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 bg-cyan-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] bg-gradient-to-br from-gray-900 to-black border-cyan-500/30">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="flex items-center gap-3">
          <motion.div
            className="relative"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <motion.div
              className="absolute inset-0 border-2 border-cyan-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>
          <div>
            <h3 className="text-white font-bold">ARIA Medical AI</h3>
            <p className="text-sm text-gray-400">Advanced Reasoning Intelligence Assistant</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              <Activity className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col h-[500px] p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className={message.type === "user" ? "bg-blue-600" : "bg-cyan-600"}>
                      {message.type === "user" ? "U" : "AI"}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`space-y-2 ${message.type === "user" ? "text-right" : ""}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-100 border border-cyan-500/30"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>

                      {message.metadata?.confidence && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <TrendingUp className="w-3 h-3" />
                          <span>Confidence: {message.metadata.confidence}%</span>
                        </div>
                      )}
                    </div>

                    {message.metadata?.suggestions && (
                      <div className="flex flex-wrap gap-1">
                        {message.metadata.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-cyan-600/20"
                            onClick={() => setInputValue(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {aiThinking && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-cyan-600">AI</AvatarFallback>
                </Avatar>
                <div className="bg-gray-800 border border-cyan-500/30 p-3 rounded-lg">
                  <AIThinkingAnimation />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Patient Data Panel */}
        {patientData && (
          <div className="border-t border-gray-700 p-3 bg-gray-800/50">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-gray-300">HR: {patientData.vitals.heartRate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">BP: {patientData.vitals.bloodPressure}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300">Temp: {patientData.vitals.temperature}°F</span>
              </div>
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">{patientData.medications.length} meds</span>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask ARIA about medical conditions, drug interactions, or symptoms..."
                className="bg-gray-800 border-gray-600 text-white pr-12"
                disabled={isProcessing}
              />
              {isListening && (
                <motion.div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Mic className="w-4 h-4 text-red-400" />
                </motion.div>
              )}
            </div>

            <Button
              onClick={startVoiceRecognition}
              disabled={isListening || isProcessing}
              variant="outline"
              size="icon"
              className={isListening ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isProcessing}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Powered by quantum neural networks • HIPAA compliant</span>
            <span>Response time: ~2.3s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
