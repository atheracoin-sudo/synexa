'use client'

import { useState, useEffect } from 'react'
import { Trophy, Sparkles, ArrowRight, X, Target, Code2, Image, MessageCircle } from 'lucide-react'

interface ProgressMilestone {
  id: string
  title: string
  description: string
  icon: string
  nextStep: string
  nextStepUrl?: string
  celebrationMessage: string
  isCompleted: boolean
}

interface ProgressCoachingProps {
  userId?: string
  className?: string
}

export default function ProgressCoaching({ 
  userId = 'user_1',
  className = ''
}: ProgressCoachingProps) {
  const [milestones, setMilestones] = useState<ProgressMilestone[]>([])
  const [activeMilestone, setActiveMilestone] = useState<ProgressMilestone | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    loadMilestones()
  }, [userId])

  const loadMilestones = () => {
    // Mock user progress data - in real app this would come from analytics
    const userProgress = {
      chatMessages: 15,
      codeProjects: 1,
      imageDesigns: 0,
      goalsSet: 2,
      streakDays: 5
    }

    const allMilestones: ProgressMilestone[] = [
      {
        id: 'first_chat',
        title: 'İlk sohbetin tamamlandı! 💬',
        description: 'Synexa AI ile ilk konuşmanı yaptın.',
        icon: 'MessageCircle',
        nextStep: 'Şimdi bir uygulama oluşturmayı dene',
        nextStepUrl: '/studio/code',
        celebrationMessage: 'Harika başlangıç! AI ile sohbet etmeyi öğrendin.',
        isCompleted: userProgress.chatMessages > 0
      },
      {
        id: 'first_app',
        title: 'İlk uygulamanı oluşturdun! 🚀',
        description: 'Code Studio ile ilk projen hazır.',
        icon: 'Code2',
        nextStep: 'Version History özelliğini keşfet',
        nextStepUrl: '/studio/code',
        celebrationMessage: 'Muhteşem! Artık bir uygulama geliştiricisisin.',
        isCompleted: userProgress.codeProjects > 0
      },
      {
        id: 'first_design',
        title: 'İlk tasarımını oluşturdun! 🎨',
        description: 'Image Studio ile yaratıcılığını keşfettin.',
        icon: 'Image',
        nextStep: 'Brand Kit ile tasarımlarını tutarlı hale getir',
        nextStepUrl: '/studio/image',
        celebrationMessage: 'Sanatçı ruhu! Tasarım yeteneğin gelişiyor.',
        isCompleted: userProgress.imageDesigns > 0
      },
      {
        id: 'goals_set',
        title: 'Hedeflerini belirledin! 🎯',
        description: 'İlerlemeyi takip etmeye başladın.',
        icon: 'Target',
        nextStep: 'Günlük streak\'ini korumaya devam et',
        nextStepUrl: '/goals',
        celebrationMessage: 'Disiplinli yaklaşım! Hedeflerle büyüyorsun.',
        isCompleted: userProgress.goalsSet > 0
      },
      {
        id: 'streak_week',
        title: 'Bir hafta streak tamamladın! 🔥',
        description: '7 gün üst üste aktif oldun.',
        icon: 'Sparkles',
        nextStep: 'Premium özellikleri keşfet',
        nextStepUrl: '/pricing',
        celebrationMessage: 'İnanılmaz kararlılık! Alışkanlık haline getirdin.',
        isCompleted: userProgress.streakDays >= 7
      }
    ]

    // Find the latest completed milestone that hasn't been shown
    const completedMilestones = allMilestones.filter(m => m.isCompleted)
    const lastCompleted = completedMilestones[completedMilestones.length - 1]

    // Check if we should show this milestone
    if (lastCompleted && !hasShownMilestone(lastCompleted.id)) {
      setActiveMilestone(lastCompleted)
      setIsVisible(true)
      markMilestoneAsShown(lastCompleted.id)
    }

    setMilestones(allMilestones)
  }

  const hasShownMilestone = (milestoneId: string): boolean => {
    const shown = localStorage.getItem(`synexa_milestone_shown_${userId}_${milestoneId}`)
    return shown === 'true'
  }

  const markMilestoneAsShown = (milestoneId: string): void => {
    localStorage.setItem(`synexa_milestone_shown_${userId}_${milestoneId}`, 'true')
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setActiveMilestone(null)
  }

  const handleNextStep = () => {
    if (activeMilestone?.nextStepUrl) {
      window.location.href = activeMilestone.nextStepUrl
    }
    handleDismiss()
  }

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'MessageCircle': MessageCircle,
      'Code2': Code2,
      'Image': Image,
      'Target': Target,
      'Sparkles': Sparkles
    }
    return iconMap[iconName] || Sparkles
  }

  if (!isVisible || !activeMilestone) return null

  const Icon = getIcon(activeMilestone.icon)

  return (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-center relative overflow-hidden">
          {/* Confetti Effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute top-4 right-6 w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-6 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></div>
            <div className="absolute top-3 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-bounce delay-300"></div>
          </div>
          
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {activeMilestone.title}
            </h2>
            <p className="text-blue-100">
              {activeMilestone.celebrationMessage}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-300 leading-relaxed">
              {activeMilestone.description}
            </p>
          </div>

          {/* Next Step */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white mb-1">Bir sonraki adım:</h4>
                <p className="text-sm text-gray-300">{activeMilestone.nextStep}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleNextStep}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all"
            >
              Devam Et
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors"
            >
              Daha sonra
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          aria-label="Kapat"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}

// Inline progress coaching for smaller celebrations
export function InlineProgressCoaching({ 
  milestone, 
  onDismiss 
}: { 
  milestone: ProgressMilestone
  onDismiss: () => void
}) {
  const Icon = milestone.icon === 'MessageCircle' ? MessageCircle :
              milestone.icon === 'Code2' ? Code2 :
              milestone.icon === 'Image' ? Image :
              milestone.icon === 'Target' ? Target : Sparkles

  return (
    <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-white">{milestone.title}</h4>
            <div className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">
              Tebrikler!
            </div>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            {milestone.celebrationMessage}
          </p>
          <p className="text-xs text-gray-400 mb-4">
            Bir sonraki adım: {milestone.nextStep}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (milestone.nextStepUrl) {
                  window.location.href = milestone.nextStepUrl
                }
                onDismiss()
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              <span>Devam Et</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={onDismiss}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              Daha sonra
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="w-8 h-8 bg-gray-800/50 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Kapat"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  )
}











