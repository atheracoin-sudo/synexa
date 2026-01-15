'use client'

import { useState } from 'react'
import { PlusIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { usePremium } from '@/lib/context/PremiumContext'
import { UpgradeModal } from '@/components/premium/UpgradeModal'

// Mock projects data
const mockProjects = [
  {
    id: '1',
    name: 'My First App',
    description: 'A simple chat application',
    createdAt: new Date('2024-01-15'),
    status: 'active'
  }
]

export default function ProjectsPage() {
  const { usage, canUseFeature } = usePremium()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  const canCreateProject = canUseFeature('unlimitedProjects')
  const projectsUsed = usage.apps.used
  const projectsLimit = usage.apps.limit

  const handleCreateProject = () => {
    if (!canCreateProject) {
      setShowUpgradeModal(true)
      return
    }
    
    // Handle project creation
    alert('Project creation would happen here')
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
            <p className="text-muted-foreground">
              Manage your projects and workspaces
            </p>
          </div>
          
          <Button onClick={handleCreateProject} className="relative">
            {!canCreateProject && (
              <LockClosedIcon className="h-4 w-4 mr-2" />
            )}
            <PlusIcon className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Usage Indicator */}
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Project Usage</h3>
              <p className="text-sm text-muted-foreground">
                {projectsUsed} of {projectsLimit === -1 ? '∞' : projectsLimit} projects used
              </p>
            </div>
            <div className="text-right">
              {projectsLimit !== -1 && (
                <div className="w-32 bg-muted rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((projectsUsed / projectsLimit) * 100, 100)}%` }}
                  />
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {projectsLimit === -1 ? 'Unlimited' : `${projectsLimit - projectsUsed} remaining`}
              </span>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {mockProjects.length > 0 ? (
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <div
                key={project.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Created {project.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
                      {project.status}
                    </span>
                    <Button variant="outline" size="sm">
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h2 className="text-lg font-medium text-foreground mb-2">
              No projects yet
            </h2>
            <p className="text-muted-foreground mb-4">
              Create your first project to get started with Synexa
            </p>
            <Button onClick={handleCreateProject} className="relative">
              {!canCreateProject && (
                <LockClosedIcon className="h-4 w-4 mr-2" />
              )}
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="unlimitedProjects"
      />
    </div>
  )
}