'use client'

import { useState } from 'react'
import { X, Target, MessageCircle, Code2, Image, Bot, Calendar, Zap, Download } from 'lucide-react'
import { goalManager, GoalTemplate, GoalPeriod } from '@/lib/goals'

interface GoalCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalCreated: (goal: any) => void
  userId: string
  isPremium?: boolean
}

export function GoalCreationModal({ 
  isOpen, 
  onClose, 
  onGoalCreated, 
  userId, 
  isPremium = false 
}: GoalCreationModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null)
  const [customTarget, setCustomTarget] = useState<number | null>(null)
  const [customPeriod, setCustomPeriod] = useState<GoalPeriod | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const templates = goalManager.getGoalTemplates()
  const suggestions = goalManager.getSmartGoalSuggestions(userId)
  const canCreateGoal = goalManager.canCreateGoal(userId, isPremium)

  const getIcon = (iconName: string) => {
    const iconProps = { size: 20 }
    switch (iconName) {
      case 'MessageCircle': return <MessageCircle {...iconProps} />
      case 'Code2': return <Code2 {...iconProps} />
      case 'Image': return <Image {...iconProps} />
      case 'Bot': return <Bot {...iconProps} />
      case 'Calendar': return <Calendar {...iconProps} />
      case 'Zap': return <Zap {...iconProps} />
      case 'Download': return <Download {...iconProps} />
      default: return <Target {...iconProps} />
    }
  }

  const getPeriodText = (period: GoalPeriod) => {
    switch (period) {
      case 'daily': return 'Günlük'
      case 'weekly': return 'Haftalık'
      case 'monthly': return 'Aylık'
      default: return period
    }
  }

  const handleCreateGoal = async () => {
    if (!selectedTemplate || !canCreateGoal) return

    setIsCreating(true)
    
    try {
      const target = customTarget || selectedTemplate.defaultTarget
      const period = customPeriod || selectedTemplate.period
      
      const newGoal = goalManager.createGoal(userId, {
        type: selectedTemplate.type,
        title: selectedTemplate.title,
        description: `${getPeriodText(period)} ${target} ${getTargetUnit(selectedTemplate.category)}`,
        target,
        period,
        category: selectedTemplate.category,
        icon: selectedTemplate.icon,
        color: selectedTemplate.color
      })

      onGoalCreated(newGoal)
      onClose()
      
      // Reset form
      setSelectedTemplate(null)
      setCustomTarget(null)
      setCustomPeriod(null)
    } catch (error) {
      console.error('Failed to create goal:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const getTargetUnit = (category: string) => {
    switch (category) {
      case 'chat': return 'mesaj'
      case 'code': return 'proje'
      case 'image': return 'tasarım'
      case 'agent': return 'görev'
      default: return 'adet'
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Target size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Kendine bir hedef belirle 🎯
                </h2>
                <p className="text-gray-400 text-sm">
                  Küçük adımlarla büyük başarılara ulaş
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!canCreateGoal && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-400 mb-2">
                  <Target size={16} />
                  <span className="font-medium">Hedef Limiti</span>
                </div>
                <p className="text-gray-300 text-sm">
                  {isPremium 
                    ? 'Maksimum 10 aktif hedefin olabilir.'
                    : 'Free plan ile maksimum 2 aktif hedefin olabilir. Premium ile sınırsız hedef oluştur.'
                  }
                </p>
                {!isPremium && (
                  <button className="mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Premium'a Geç →
                  </button>
                )}
              </div>
            )}

            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-3">
                  Senin İçin Öneriler ✨
                </h3>
                <div className="grid gap-3">
                  {suggestions.map((template) => (
                    <button
                      key={template.type}
                      onClick={() => setSelectedTemplate(template)}
                      disabled={!canCreateGoal || (template.isPremium && !isPremium)}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        selectedTemplate?.type === template.type
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      } ${
                        !canCreateGoal || (template.isPremium && !isPremium)
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${goalManager.getGoalColorClass(template.color)}`}>
                          {getIcon(template.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">
                              {template.title}
                            </h4>
                            {template.isPremium && (
                              <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                                Premium
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Hedef: {template.defaultTarget}</span>
                            <span>Periyot: {getPeriodText(template.period)}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Templates */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                Tüm Hedef Türleri
              </h3>
              <div className="grid gap-3">
                {templates.filter(t => !suggestions.some(s => s.type === t.type)).map((template) => (
                  <button
                    key={template.type}
                    onClick={() => setSelectedTemplate(template)}
                    disabled={!canCreateGoal || (template.isPremium && !isPremium)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      selectedTemplate?.type === template.type
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                    } ${
                      !canCreateGoal || (template.isPremium && !isPremium)
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${goalManager.getGoalColorClass(template.color)}`}>
                        {getIcon(template.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">
                            {template.title}
                          </h4>
                          {template.isPremium && (
                            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Hedef: {template.defaultTarget}</span>
                          <span>Periyot: {getPeriodText(template.period)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customization */}
            {selectedTemplate && (
              <div className="bg-gray-800/50 rounded-xl p-4 space-y-4">
                <h4 className="font-medium text-white">Hedefi Özelleştir</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hedef Sayı
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={customTarget || selectedTemplate.defaultTarget}
                      onChange={(e) => setCustomTarget(parseInt(e.target.value) || selectedTemplate.defaultTarget)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Periyot
                    </label>
                    <select
                      value={customPeriod || selectedTemplate.period}
                      onChange={(e) => setCustomPeriod(e.target.value as GoalPeriod)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Günlük</option>
                      <option value="weekly">Haftalık</option>
                      <option value="monthly">Aylık</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-300 text-sm">
                    <strong>Hedef Önizleme:</strong> {getPeriodText(customPeriod || selectedTemplate.period)} {customTarget || selectedTemplate.defaultTarget} {getTargetUnit(selectedTemplate.category)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-gray-300 transition-colors"
              >
                İptal
              </button>
              
              <button
                onClick={handleCreateGoal}
                disabled={!selectedTemplate || !canCreateGoal || isCreating}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {isCreating && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                Hedefi Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}











