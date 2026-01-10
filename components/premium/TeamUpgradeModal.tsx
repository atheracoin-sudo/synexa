'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Brain, 
  FolderOpen, 
  Shield, 
  Zap, 
  Crown,
  ArrowRight,
  Check
} from 'lucide-react'

interface TeamUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onUpgrade?: () => void
  trigger?: 'workspace' | 'collaboration' | 'sharing'
}

export function TeamUpgradeModal({ 
  isOpen, 
  onClose, 
  onUpgrade,
  trigger = 'workspace'
}: TeamUpgradeModalProps) {
  
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      window.location.href = '/pricing?plan=team'
    }
    onClose()
  }

  const getTriggerContent = () => {
    const content = {
      workspace: {
        title: 'Takım olarak çalışmak ister misin?',
        description: 'Workspace oluşturmak için Team planına ihtiyacın var.',
        icon: Users
      },
      collaboration: {
        title: 'Ekip arkadaşlarınla birlikte üret',
        description: 'Projelerini paylaş ve birlikte çalış.',
        icon: FolderOpen
      },
      sharing: {
        title: 'Projelerini takımınla paylaş',
        description: 'Ortak projeler ve paylaşımlı hafıza ile daha verimli çalış.',
        icon: Brain
      }
    }
    return content[trigger]
  }

  const triggerContent = getTriggerContent()
  const TriggerIcon = triggerContent.icon

  const teamFeatures = [
    {
      icon: Users,
      title: 'Team Workspace',
      description: 'Sınırsız workspace oluştur ve ekibini davet et'
    },
    {
      icon: Brain,
      title: 'Shared Memory',
      description: 'Takım genelinde AI hafızası ve context paylaşımı'
    },
    {
      icon: Shield,
      title: 'Role Management',
      description: 'Admin, Editor, Viewer rolleri ile güvenli erişim'
    },
    {
      icon: FolderOpen,
      title: 'Team Projects',
      description: 'Ortak projeler üzerinde eş zamanlı çalışma'
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: '24/7 öncelikli destek ve özel yardım'
    },
    {
      icon: Crown,
      title: 'Advanced Analytics',
      description: 'Takım kullanımı ve verimlilik analizleri'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 border-b border-border">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
              <TriggerIcon className="h-8 w-8 text-white" />
            </div>
            
            <DialogTitle className="text-2xl font-bold text-foreground mb-2">
              {triggerContent.title}
            </DialogTitle>
            
            <DialogDescription className="text-muted-foreground text-lg">
              {triggerContent.description}
            </DialogDescription>
            
            <Badge 
              variant="secondary" 
              className="mt-4 bg-gradient-primary text-white"
            >
              Team Plan Required
            </Badge>
          </div>
        </div>

        {/* Features */}
        <div className="p-8">
          <h3 className="text-lg font-semibold text-foreground mb-6 text-center">
            Team Plan ile neler yapabilirsin?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {teamFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 flex-shrink-0">
                  <feature.icon className="h-4 w-4 text-blue-500" />
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground text-sm mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl p-6 border border-blue-500/20 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl font-bold text-foreground">$49</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Yearly billing ile $41/month (17% indirim)
              </p>
              
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>İstediğin zaman iptal et</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Tüm Premium özellikler</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleUpgrade}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              <Crown className="h-4 w-4 mr-2" />
              Team Plan'a Geç
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Şimdilik Hayır
            </Button>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-4">
            14 günlük ücretsiz deneme • Kredi kartı gerekmez
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}






