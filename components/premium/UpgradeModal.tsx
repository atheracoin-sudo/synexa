'use client'

import { useRouter } from 'next/navigation'
import { 
  LockClosedIcon, 
  SparklesIcon, 
  CheckIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetBody, 
  SheetTitle, 
  SheetClose 
} from '@/components/ui/sheet'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  title?: string
  description?: string
}

const featureDetails = {
  export: {
    title: 'Export Your Code',
    description: 'Download and export your generated code in various formats',
    benefits: [
      'Download individual files',
      'Export complete projects as ZIP',
      'Copy code snippets',
      'Open in external editors'
    ]
  },
  download: {
    title: 'Download Files',
    description: 'Save your generated files directly to your computer',
    benefits: [
      'Download any generated file',
      'Batch download multiple files',
      'Organize your downloads',
      'Keep local backups'
    ]
  },
  openInNewTab: {
    title: 'Open in New Tab',
    description: 'View and edit your code in separate browser tabs',
    benefits: [
      'Multi-tab code editing',
      'Better workflow management',
      'Side-by-side comparison',
      'Enhanced productivity'
    ]
  },
  zipExport: {
    title: 'ZIP Export',
    description: 'Export entire projects as downloadable ZIP archives',
    benefits: [
      'Complete project packages',
      'Easy sharing and backup',
      'Organized file structure',
      'Ready-to-deploy code'
    ]
  },
  unlimitedProjects: {
    title: 'Unlimited Projects',
    description: 'Create and manage unlimited app projects',
    benefits: [
      'No project limits',
      'Organize multiple apps',
      'Experiment freely',
      'Scale your development'
    ]
  },
  advancedStudio: {
    title: 'Advanced Studio Features',
    description: 'Access premium AI assistance and advanced tools',
    benefits: [
      'Advanced AI models',
      'Custom templates',
      'Enhanced code generation',
      'Priority processing'
    ]
  },
  default: {
    title: 'Premium Feature',
    description: 'This feature is available with Pro and Team plans',
    benefits: [
      'Full feature access',
      'Priority support',
      'Advanced capabilities',
      'Enhanced productivity'
    ]
  }
}

export function UpgradeModal({ 
  isOpen, 
  onClose, 
  feature, 
  title: customTitle, 
  description: customDescription 
}: UpgradeModalProps) {
  const router = useRouter()
  
  const details = featureDetails[feature as keyof typeof featureDetails] || featureDetails.default
  const finalTitle = customTitle || details.title
  const finalDescription = customDescription || details.description

  const handleSeePlans = () => {
    onClose()
    router.push('/billing')
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" size="md">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <LockClosedIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-left">{finalTitle}</SheetTitle>
              <p className="text-sm text-muted-foreground text-left">
                Upgrade to unlock this feature
              </p>
            </div>
          </div>
          <SheetClose onClick={onClose} />
        </SheetHeader>

        <SheetBody className="space-y-6">
          {/* Feature Description */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <SparklesIcon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  {finalTitle}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {finalDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Benefits List */}
          <div>
            <h4 className="font-medium text-foreground mb-3">What you'll get:</h4>
            <ul className="space-y-2">
              {details.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plan Comparison */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Free</div>
                <div className="text-lg font-semibold text-foreground">$0</div>
                <div className="text-xs text-muted-foreground">Limited features</div>
              </div>
              <div className="border-l border-r border-border px-4">
                <div className="text-xs text-primary mb-1">Pro</div>
                <div className="text-lg font-semibold text-primary">$19</div>
                <div className="text-xs text-muted-foreground">Full access</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Team</div>
                <div className="text-lg font-semibold text-foreground">$49</div>
                <div className="text-xs text-muted-foreground">Advanced features</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleSeePlans}
              className="w-full"
              size="lg"
            >
              See Plans & Pricing
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              ✨ 30-day money-back guarantee • Cancel anytime • Secure payment
            </p>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}