"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { FileText, Shield, Calendar, User, Zap, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface HolographicCardProps {
  record: {
    id: string
    title: string
    date: string
    doctor: string
    type: string
    status: string
    confidentiality: "public" | "private" | "restricted"
  }
  onClick?: () => void
}

export function HolographicCard({ record, onClick }: HolographicCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]))
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]))

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  const getConfidentialityColor = () => {
    switch (record.confidentiality) {
      case "public":
        return "from-green-400 to-emerald-600"
      case "private":
        return "from-yellow-400 to-orange-600"
      case "restricted":
        return "from-red-400 to-pink-600"
      default:
        return "from-blue-400 to-cyan-600"
    }
  }

  const getTypeIcon = () => {
    switch (record.type.toLowerCase()) {
      case "lab":
        return <Zap className="w-5 h-5" />
      case "imaging":
        return <FileText className="w-5 h-5" />
      case "prescription":
        return <Shield className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative w-80 h-48 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main Card */}
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${getConfidentialityColor()})`,
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        }}
        animate={{
          boxShadow: isHovered
            ? [
                "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                "0 35px 60px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2)",
                "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
              ]
            : "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        }}
        transition={{ duration: 2, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
      >
        {/* Holographic Overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
              linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)
            `,
          }}
          animate={
            isHovered
              ? {
                  background: [
                    `radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
               radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
               linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)`,
                    `radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
               radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
               linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)`,
                    `radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
               radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
               linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)`,
                  ],
                }
              : {}
          }
          transition={{ duration: 3, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
        />

        {/* Scanning Lines */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <motion.div
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60"
            animate={isHovered ? { y: [-10, 200] } : {}}
            transition={{ duration: 2, repeat: isHovered ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
          />
          <motion.div
            className="absolute w-1 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-40"
            animate={isHovered ? { x: [-10, 320] } : {}}
            transition={{ duration: 3, repeat: isHovered ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                animate={isHovered ? { rotate: [0, 360] } : {}}
                transition={{ duration: 2, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
              >
                {getTypeIcon()}
              </motion.div>
              <div>
                <h3 className="font-bold text-lg leading-tight">{record.title}</h3>
                <p className="text-sm opacity-90">{record.type}</p>
              </div>
            </div>

            <motion.div
              animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
            >
              <Lock className="w-5 h-5 opacity-80" />
            </motion.div>
          </div>

          {/* Middle Content */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              className="text-center"
              animate={isHovered ? { y: [0, -5, 0] } : {}}
              transition={{ duration: 2, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
            >
              <div className="text-3xl font-bold opacity-20 mb-2">{record.id.padStart(4, "0")}</div>
              <Badge variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
                {record.status}
              </Badge>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 opacity-80" />
              <span className="text-sm opacity-90">{record.doctor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-80" />
              <span className="text-sm opacity-90">{record.date}</span>
            </div>
          </div>
        </div>

        {/* Quantum Particles Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={
                isHovered
                  ? {
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: [0, (Math.random() - 0.5) * 100],
                      y: [0, (Math.random() - 0.5) * 100],
                    }
                  : {}
              }
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Reflection */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
          transform: "translateZ(1px)",
        }}
        animate={
          isHovered
            ? {
                background: [
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
                  "linear-gradient(225deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: isHovered ? Number.POSITIVE_INFINITY : 0 }}
      />
    </motion.div>
  )
}
