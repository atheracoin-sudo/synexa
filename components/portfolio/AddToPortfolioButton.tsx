'use client'

import { useState } from 'react'
import { Plus, Bookmark, Check } from 'lucide-react'
import { AddToPortfolioModal } from './AddToPortfolioModal'
import { ProjectType } from '@/lib/portfolio'

interface AddToPortfolioButtonProps {
  projectData: {
    title: string
    description?: string
    type: ProjectType
    tools: string[]
    agents?: string[]
    liveUrl?: string
    sourceUrl?: string
  }
  variant?: 'button' | 'icon' | 'card'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AddToPortfolioButton({ 
  projectData, 
  variant = 'button',
  size = 'md',
  className = '' 
}: AddToPortfolioButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleSuccess = (projectId: string) => {
    setIsAdded(true)
    console.log('Project added to portfolio:', projectId)
    
    // Show success message
    setTimeout(() => {
      setIsAdded(false)
    }, 3000)
  }

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    }
    return sizes[size]
  }

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isAdded}
          className={`p-2 rounded-lg transition-all ${
            isAdded 
              ? 'bg-green-600 text-white cursor-default' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
          } ${className}`}
          title={isAdded ? 'Added to portfolio' : 'Add to portfolio'}
        >
          {isAdded ? (
            <Check className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>

        <AddToPortfolioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          projectData={projectData}
        />
      </>
    )
  }

  if (variant === 'card') {
    return (
      <>
        <div
          onClick={() => !isAdded && setIsModalOpen(true)}
          className={`group p-4 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
            isAdded
              ? 'border-green-500 bg-green-600/10 cursor-default'
              : 'border-gray-600 hover:border-blue-500 hover:bg-blue-600/5'
          } ${className}`}
        >
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
              isAdded
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 group-hover:bg-blue-600 text-gray-400 group-hover:text-white'
            }`}>
              {isAdded ? (
                <Check className="w-6 h-6" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
            </div>
            <h3 className={`font-medium mb-1 ${
              isAdded ? 'text-green-400' : 'text-gray-300 group-hover:text-white'
            }`}>
              {isAdded ? 'Added to Portfolio' : 'Add to Portfolio'}
            </h3>
            <p className="text-sm text-gray-500">
              {isAdded 
                ? 'Project is now in your portfolio' 
                : 'Share this project with the world'
              }
            </p>
          </div>
        </div>

        <AddToPortfolioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          projectData={projectData}
        />
      </>
    )
  }

  // Default button variant
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isAdded}
        className={`flex items-center gap-2 font-medium rounded-lg transition-all ${getSizeClasses()} ${
          isAdded
            ? 'bg-green-600 text-white cursor-default'
            : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
        } ${className}`}
      >
        {isAdded ? (
          <>
            <Check className="w-4 h-4" />
            Added to Portfolio
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Add to Portfolio
          </>
        )}
      </button>

      <AddToPortfolioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        projectData={projectData}
      />
    </>
  )
}





