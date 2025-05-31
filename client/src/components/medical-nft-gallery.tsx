"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ImageIcon, Download, Share2, Eye, Heart, Award, Shield, FileText, Star, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MedicalNFT {
  id: string
  title: string
  type: "record" | "achievement" | "certification" | "milestone"
  rarity: "common" | "rare" | "epic" | "legendary"
  image: string
  description: string
  attributes: {
    trait_type: string
    value: string | number
  }[]
  creator: {
    name: string
    avatar: string
    verified: boolean
  }
  owner: {
    name: string
    avatar: string
  }
  metadata: {
    mintDate: string
    tokenId: string
    blockchain: string
    contract: string
  }
  stats: {
    views: number
    likes: number
    shares: number
  }
  isLocked: boolean
  accessLevel: "public" | "private" | "restricted"
}

const mockNFTs: MedicalNFT[] = [
  {
    id: "1",
    title: "Perfect Health Score 2024",
    type: "achievement",
    rarity: "legendary",
    image: "/placeholder.svg?height=300&width=300",
    description: "Achieved perfect health metrics for 12 consecutive months",
    attributes: [
      { trait_type: "Health Score", value: 100 },
      { trait_type: "Duration", value: "12 months" },
      { trait_type: "Category", value: "Wellness" },
    ],
    creator: {
      name: "HealthDAO",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    owner: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    metadata: {
      mintDate: "2024-01-15",
      tokenId: "HDO-001",
      blockchain: "Cardano",
      contract: "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtmk4l3aq4s",
    },
    stats: {
      views: 1247,
      likes: 89,
      shares: 23,
    },
    isLocked: false,
    accessLevel: "public",
  },
  {
    id: "2",
    title: "Cardiac Surgery Recovery",
    type: "milestone",
    rarity: "epic",
    image: "/placeholder.svg?height=300&width=300",
    description: "Successfully completed cardiac surgery with full recovery",
    attributes: [
      { trait_type: "Surgery Type", value: "Cardiac" },
      { trait_type: "Recovery Time", value: "6 weeks" },
      { trait_type: "Success Rate", value: "100%" },
    ],
    creator: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    owner: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    metadata: {
      mintDate: "2024-01-10",
      tokenId: "MED-002",
      blockchain: "Cardano",
      contract: "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtmk4l3aq4s",
    },
    stats: {
      views: 892,
      likes: 156,
      shares: 45,
    },
    isLocked: true,
    accessLevel: "private",
  },
  {
    id: "3",
    title: "Medical Degree Certification",
    type: "certification",
    rarity: "rare",
    image: "/placeholder.svg?height=300&width=300",
    description: "Board-certified medical degree with specialization",
    attributes: [
      { trait_type: "Degree", value: "MD" },
      { trait_type: "Specialization", value: "Cardiology" },
      { trait_type: "Institution", value: "Harvard Medical" },
    ],
    creator: {
      name: "Harvard Medical School",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    owner: {
      name: "Dr. Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    metadata: {
      mintDate: "2024-01-05",
      tokenId: "CERT-003",
      blockchain: "Cardano",
      contract: "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a6gtmk4l3aq4s",
    },
    stats: {
      views: 2341,
      likes: 234,
      shares: 67,
    },
    isLocked: false,
    accessLevel: "public",
  },
]

export function MedicalNFTGallery() {
  const [selectedNFT, setSelectedNFT] = useState<MedicalNFT | null>(null)
  const [filter, setFilter] = useState<"all" | "achievements" | "records" | "certifications">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-400 to-orange-500"
      case "epic":
        return "from-purple-400 to-pink-500"
      case "rare":
        return "from-blue-400 to-cyan-500"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return Award
      case "record":
        return FileText
      case "certification":
        return Shield
      case "milestone":
        return Star
      default:
        return FileText
    }
  }

  const filteredNFTs = mockNFTs.filter((nft) => {
    if (filter === "all") return true
    if (filter === "achievements") return nft.type === "achievement"
    if (filter === "records") return nft.type === "record"
    if (filter === "certifications") return nft.type === "certification"
    return true
  })

  const NFTCard = ({ nft, index }: { nft: MedicalNFT; index: number }) => {
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

    const TypeIcon = getTypeIcon(nft.type)

    return (
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0)
          mouseY.set(0)
        }}
        onClick={() => setSelectedNFT(nft)}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.05, z: 50 }}
        className="cursor-pointer"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border-gray-700 h-96">
          {/* Rarity Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(nft.rarity)} opacity-20 blur-xl`} />

          {/* Lock Overlay */}
          {nft.isLocked && (
            <div className="absolute inset-0 bg-black/70 z-10 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-center"
              >
                <Lock className="w-12 h-12 mx-auto mb-2 text-yellow-400" />
                <p className="text-yellow-400 font-semibold">Restricted Access</p>
              </motion.div>
            </div>
          )}

          <CardContent className="p-0 h-full relative z-0">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <ImageIcon src={nft.image || "/placeholder.svg"} alt={nft.title} className="w-full h-full object-cover" />

              {/* Rarity Badge */}
              <Badge
                className={`absolute top-2 right-2 bg-gradient-to-r ${getRarityColor(nft.rarity)} text-white border-0`}
              >
                {nft.rarity.toUpperCase()}
              </Badge>

              {/* Type Icon */}
              <div className="absolute top-2 left-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm">
                <TypeIcon className="w-4 h-4 text-white" />
              </div>

              {/* Holographic Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-bold text-white text-lg leading-tight">{nft.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{nft.description}</p>
              </div>

              {/* Creator */}
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={nft.creator.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{nft.creator.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-400">by {nft.creator.name}</span>
                {nft.creator.verified && <Shield className="w-3 h-3 text-blue-400" />}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{nft.stats.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{nft.stats.likes}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {nft.metadata.tokenId}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Medical NFT Collection</h2>
          <p className="text-gray-400">Tokenized medical achievements, records, and certifications</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            Grid
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            List
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "achievements", "records", "certifications"] as const).map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterType)}
            className="capitalize"
          >
            {filterType}
          </Button>
        ))}
      </div>

      {/* NFT Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
        <AnimatePresence>
          {filteredNFTs.map((nft, index) => (
            <NFTCard key={nft.id} nft={nft} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* NFT Detail Modal */}
      <AnimatePresence>
        {selectedNFT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNFT(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Image */}
                <div className="relative">
                  <ImageIcon
                    src={selectedNFT.image || "/placeholder.svg"}
                    alt={selectedNFT.title}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                  <Badge
                    className={`absolute top-4 right-4 bg-gradient-to-r ${getRarityColor(selectedNFT.rarity)} text-white border-0`}
                  >
                    {selectedNFT.rarity.toUpperCase()}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedNFT.title}</h2>
                    <p className="text-gray-400">{selectedNFT.description}</p>
                  </div>

                  {/* Creator & Owner */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedNFT.creator.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{selectedNFT.creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-400">Created by</p>
                        <p className="text-white font-semibold">{selectedNFT.creator.name}</p>
                      </div>
                      {selectedNFT.creator.verified && <Shield className="w-4 h-4 text-blue-400" />}
                    </div>

                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedNFT.owner.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{selectedNFT.owner.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-400">Owned by</p>
                        <p className="text-white font-semibold">{selectedNFT.owner.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Attributes</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNFT.attributes.map((attr, index) => (
                        <div key={index} className="bg-gray-800/50 p-3 rounded-lg">
                          <p className="text-xs text-gray-400">{attr.trait_type}</p>
                          <p className="text-white font-semibold">{attr.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div>
                    <h3 className="text-white font-semibold mb-3">Blockchain Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Token ID:</span>
                        <span className="text-white font-mono">{selectedNFT.metadata.tokenId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Blockchain:</span>
                        <span className="text-white">{selectedNFT.metadata.blockchain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Mint Date:</span>
                        <span className="text-white">{selectedNFT.metadata.mintDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1" disabled={selectedNFT.isLocked}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="flex-1" disabled={selectedNFT.isLocked}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
