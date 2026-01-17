'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Play, 
  Download, 
  FileText, 
  Code2, 
  Eye, 
  Send,
  Folder,
  FolderOpen,
  File,
  Loader2,
  Sparkles,
  CheckCircle,
  Clock
} from 'lucide-react'
import { RocketLaunchIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { usePremium } from '@/lib/hooks/usePremium'
import { UpgradeModal } from '@/components/premium/UpgradeModal'

type BuildStep = 'planning' | 'coding' | 'preview' | 'complete'
type TabType = 'plan' | 'code' | 'preview'
type WorkflowStep = 'clarification' | 'build-plan' | 'file-tree' | 'code-generation' | 'complete'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileNode[]
  path: string
}

interface BuildMessage {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  step?: BuildStep
  workflowStep?: WorkflowStep
  actions?: Array<{
    id: string
    label: string
    type: 'send-to-files' | 'regenerate' | 'continue'
    data?: any
  }>
}

interface BuildProject {
  id: string
  name: string
  description: string
  files: FileNode[]
  messages: BuildMessage[]
  currentStep: BuildStep
  workflowStep: WorkflowStep
  previewUrl?: string
  buildPlan?: {
    pages: string[]
    components: string[]
    dataModel: string[]
    features: string[]
  }
  pendingFiles?: { [key: string]: string }
}

export default function BuildPage() {
  const [activeTab, setActiveTab] = useState<TabType>('plan')
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState('')
  
  const { isPremium, isFeatureAvailable } = usePremium()
  
  // Resizable panels
  const [leftWidth, setLeftWidth] = useState(320)
  const [rightWidth, setRightWidth] = useState(400)
  const isDraggingLeft = useRef(false)
  const isDraggingRight = useRef(false)

  // Mouse event handlers for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft.current) {
        const newWidth = Math.max(250, Math.min(500, e.clientX))
        setLeftWidth(newWidth)
      }
      if (isDraggingRight.current) {
        const newWidth = Math.max(300, Math.min(600, window.innerWidth - e.clientX))
        setRightWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      isDraggingLeft.current = false
      isDraggingRight.current = false
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    if (isDraggingLeft.current || isDraggingRight.current) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingLeft.current, isDraggingRight.current])

  // Mock project state
  const [currentProject, setCurrentProject] = useState<BuildProject>({
    id: 'project-1',
    name: 'My App',
    description: '',
    files: [],
    messages: [
      {
        id: 'welcome',
        type: 'system',
        content: 'Welcome to Build Workspace! Describe your app idea and I\'ll help you build it step by step.',
        timestamp: new Date(),
        step: 'planning',
        workflowStep: 'clarification'
      }
    ],
    currentStep: 'planning',
    workflowStep: 'clarification',
    pendingFiles: {}
  })

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root', 'src']))

  // Check for initial prompt from chat
  useEffect(() => {
    const initialPrompt = sessionStorage.getItem('buildAppPrompt')
    const buildConfig = sessionStorage.getItem('buildAppConfig')
    
    if (initialPrompt && buildConfig) {
      try {
        const config = JSON.parse(buildConfig)
        
        // Create initial user message with the structured prompt
        const userMessage: BuildMessage = {
          id: `initial-${Date.now()}`,
          type: 'user',
          content: initialPrompt,
          timestamp: new Date()
        }
        
        // Update project with initial message and config
        setCurrentProject(prev => ({
          ...prev,
          name: `${config.appType.charAt(0).toUpperCase() + config.appType.slice(1)} App`,
          description: config.description,
          messages: [prev.messages[0], userMessage] // Keep welcome message, add user message
        }))
        
        // Clear sessionStorage
        sessionStorage.removeItem('buildAppPrompt')
        sessionStorage.removeItem('buildAppConfig')
        
        // Auto-generate clarification questions after a brief delay
        setTimeout(() => {
          generateClarificationQuestions(initialPrompt)
        }, 1000)
        
      } catch (error) {
        console.error('Failed to parse build config:', error)
      }
    }
  }, [])

  // Workflow Step 1: Generate clarification questions
  const generateClarificationQuestions = async (description: string) => {
    setIsGenerating(true)
    setActiveTab('plan')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const questions = [
      "What's the primary purpose of your application?",
      "Who is your target audience?",
      "Do you need user authentication and accounts?"
    ]
    
    const clarificationMessage: BuildMessage = {
      id: `clarification-${Date.now()}`,
      type: 'assistant',
      content: `Great! I'll help you build **${description}**. Let me ask a few questions to better understand your requirements:\n\n${questions.map((q, i) => `**${i + 1}.** ${q}`).join('\n\n')}\n\nPlease answer these questions so I can create the perfect app for you.`,
      timestamp: new Date(),
      step: 'planning',
      workflowStep: 'clarification',
      actions: [
        {
          id: 'continue-to-plan',
          label: 'Continue to Build Plan',
          type: 'continue'
        }
      ]
    }
    
    setCurrentProject(prev => ({
      ...prev,
      description,
      messages: [...prev.messages, clarificationMessage],
      workflowStep: 'clarification'
    }))
    
    setIsGenerating(false)
  }

  // Workflow Step 2: Generate Build Plan
  const generateBuildPlan = async (requirements: string) => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const buildPlan = {
      pages: ['Landing Page', 'Product Catalog', 'Product Details', 'Shopping Cart', 'Checkout', 'User Profile'],
      components: ['Header', 'Navigation', 'ProductCard', 'CartItem', 'Button', 'Modal', 'Footer'],
      dataModel: ['User', 'Product', 'Category', 'CartItem', 'Order'],
      features: ['User Authentication', 'Product Search', 'Shopping Cart', 'Payment Integration', 'Order Management']
    }
    
    const planMessage: BuildMessage = {
      id: `build-plan-${Date.now()}`,
      type: 'assistant',
      content: `## 📋 Build Plan\n\nBased on your requirements, here's the complete plan for your application:\n\n### 📄 Pages\n${buildPlan.pages.map(page => `- ${page}`).join('\n')}\n\n### 🧩 Components\n${buildPlan.components.map(comp => `- ${comp}`).join('\n')}\n\n### 📊 Data Model\n${buildPlan.dataModel.map(model => `- ${model}`).join('\n')}\n\n### ✨ Key Features\n${buildPlan.features.map(feature => `- ${feature}`).join('\n')}\n\n**Next Step**: Generate the file structure based on this plan.`,
      timestamp: new Date(),
      step: 'planning',
      workflowStep: 'build-plan',
      actions: [
        {
          id: 'generate-file-tree',
          label: 'Generate File Tree',
          type: 'continue'
        },
        {
          id: 'regenerate-plan',
          label: 'Regenerate Plan',
          type: 'regenerate'
        }
      ]
    }
    
    setCurrentProject(prev => ({
      ...prev,
      messages: [...prev.messages, planMessage],
      buildPlan,
      workflowStep: 'build-plan'
    }))
    
    setIsGenerating(false)
  }

  // Workflow Step 3: Generate File Tree
  const generateFileTree = async () => {
    setIsGenerating(true)
    setActiveTab('code')
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const fileStructure = `src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Input.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ProductDetails.tsx
│   └── cart/
│       ├── CartItem.tsx
│       └── CartSummary.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   └── CheckoutPage.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useProducts.ts
├── types/
│   └── index.ts
├── utils/
│   └── api.ts
├── styles/
│   └── globals.css
├── App.tsx
└── main.tsx`
    
    const fileTreeMessage: BuildMessage = {
      id: `file-tree-${Date.now()}`,
      type: 'assistant',
      content: `## 📁 File Structure\n\nHere's the complete file structure for your application:\n\n\`\`\`\n${fileStructure}\n\`\`\`\n\n**Total Files**: 23 files organized in a clean, scalable structure.\n\n**Next Step**: Generate the code for each file.`,
      timestamp: new Date(),
      step: 'coding',
      workflowStep: 'file-tree',
      actions: [
        {
          id: 'generate-code',
          label: 'Generate Code',
          type: 'continue'
        },
        {
          id: 'regenerate-tree',
          label: 'Regenerate Tree',
          type: 'regenerate'
        }
      ]
    }
    
    setCurrentProject(prev => ({
      ...prev,
      messages: [...prev.messages, fileTreeMessage],
      workflowStep: 'file-tree',
      currentStep: 'coding'
    }))
    
    setIsGenerating(false)
  }

  // Workflow Step 4: Generate Code
  const generateCode = async () => {
    setIsGenerating(true)
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate actual file structure with code
    const generatedFiles: FileNode[] = [
      {
        id: 'root-generated',
        name: 'my-ecommerce-app',
        type: 'folder',
        path: '/',
        children: [
          {
            id: 'package-json',
            name: 'package.json',
            type: 'file',
            path: '/package.json',
            content: JSON.stringify({
              name: 'my-ecommerce-app',
              version: '1.0.0',
              private: true,
              dependencies: {
                'react': '^18.2.0',
                'react-dom': '^18.2.0',
                'typescript': '^5.0.0',
                'tailwindcss': '^3.3.0',
                '@types/react': '^18.2.0'
              },
              scripts: {
                'dev': 'vite',
                'build': 'tsc && vite build',
                'preview': 'vite preview'
              }
            }, null, 2)
          },
          {
            id: 'src-folder',
            name: 'src',
            type: 'folder',
            path: '/src',
            children: [
              {
                id: 'app-tsx',
                name: 'App.tsx',
                type: 'file',
                path: '/src/App.tsx',
                content: `import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import './styles/globals.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App`
              },
              {
                id: 'components-folder',
                name: 'components',
                type: 'folder',
                path: '/src/components',
                children: [
                  {
                    id: 'header-tsx',
                    name: 'Header.tsx',
                    type: 'file',
                    path: '/src/components/Header.tsx',
                    content: `import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-gray-900">
            ShopApp
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
          </nav>
          
          <Link 
            to="/cart" 
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            <span className="hidden sm:block">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  )
}`
                  },
                  {
                    id: 'product-card-tsx',
                    name: 'ProductCard.tsx',
                    type: 'file',
                    path: '/src/components/ProductCard.tsx',
                    content: `import React from 'react'

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            \${product.price}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}`
                  }
                ]
              },
              {
                id: 'pages-folder',
                name: 'pages',
                type: 'folder',
                path: '/src/pages',
                children: [
                  {
                    id: 'home-page-tsx',
                    name: 'HomePage.tsx',
                    type: 'file',
                    path: '/src/pages/HomePage.tsx',
                    content: `import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to ShopApp
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. 
            Shop with confidence and enjoy fast, free shipping.
          </p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose ShopApp?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is safe</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">Curated selection of premium items</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}`
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
    
    const codeMessage: BuildMessage = {
      id: `code-generated-${Date.now()}`,
      type: 'assistant',
      content: `## ✅ Code Generation Complete!\n\nI've successfully generated **23 files** with complete, production-ready code:\n\n### 📦 What's Included:\n- **React + TypeScript** setup\n- **Tailwind CSS** styling\n- **Component architecture** with reusable UI components\n- **Routing** with React Router\n- **Responsive design** for all screen sizes\n- **Modern e-commerce features**\n\n### 🎯 Key Features Implemented:\n- Landing page with hero section and features\n- Product catalog with search and filtering\n- Shopping cart functionality\n- Responsive navigation\n- Modern UI components\n\n**Your app is ready!** Click "Send to Files" to apply all the generated code to your project.`,
      timestamp: new Date(),
      step: 'preview',
      workflowStep: 'code-generation',
      actions: [
        {
          id: 'send-to-files',
          label: 'Send to Files',
          type: 'send-to-files',
          data: { files: generatedFiles }
        },
        {
          id: 'regenerate-code',
          label: 'Regenerate Code',
          type: 'regenerate'
        }
      ]
    }
    
    setCurrentProject(prev => ({
      ...prev,
      messages: [...prev.messages, codeMessage],
      workflowStep: 'code-generation',
      currentStep: 'preview',
      pendingFiles: { generated: JSON.stringify(generatedFiles) }
    }))
    
    setIsGenerating(false)
  }



  // Handle action buttons
  const handleAction = async (actionId: string, actionType: string, data?: any) => {
    switch (actionType) {
      case 'send-to-files':
        if (data?.files) {
          const files = data.files as FileNode[]
          setCurrentProject(prev => ({
            ...prev,
            files,
            currentStep: 'complete',
            workflowStep: 'complete',
            previewUrl: '/preview-demo'
          }))
          setExpandedFolders(new Set(['root-generated', 'src-folder', 'components-folder', 'pages-folder']))
          const appFile = files[0]?.children?.[1]?.children?.[0]
          if (appFile) setSelectedFile(appFile) // Select App.tsx
        }
        break
      case 'regenerate':
        // Handle regeneration based on current workflow step
        if (currentProject.workflowStep === 'build-plan') {
          await generateBuildPlan('Regenerating build plan...')
        } else if (currentProject.workflowStep === 'file-tree') {
          await generateFileTree()
        } else if (currentProject.workflowStep === 'code-generation') {
          await generateCode()
        }
        break
      case 'continue':
        if (actionId === 'continue-to-plan') {
          await generateBuildPlan('Based on your requirements, creating build plan...')
        } else if (actionId === 'generate-file-tree') {
          await generateFileTree()
        } else if (actionId === 'generate-code') {
          await generateCode()
        }
        break
    }
  }

  const sendMessage = async () => {
    if (!prompt.trim()) return
    
    const userMessage: BuildMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: prompt,
      timestamp: new Date()
    }
    
    setCurrentProject(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }))
    
    const currentPrompt = prompt
    setPrompt('')
    
    // Determine next action based on workflow step
    if (currentProject.workflowStep === 'clarification') {
      if (currentProject.messages.length === 1) {
        // First user message - generate clarification questions
        await generateClarificationQuestions(currentPrompt)
      } else {
        // User answered questions - generate build plan
        await generateBuildPlan(currentPrompt)
      }
    }
  }

  // File tree rendering
  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1 hover:bg-muted/50 cursor-pointer rounded text-sm",
            selectedFile?.id === node.id && "bg-primary/10 text-primary",
            depth > 0 && "ml-4"
          )}
          onClick={() => {
            if (node.type === 'folder') {
              setExpandedFolders(prev => {
                const next = new Set(prev)
                if (next.has(node.id)) {
                  next.delete(node.id)
                } else {
                  next.add(node.id)
                }
                return next
              })
            } else {
              setSelectedFile(node)
            }
          }}
        >
          {node.type === 'folder' ? (
            expandedFolders.has(node.id) ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )
          ) : (
            <File className="w-4 h-4 text-gray-500" />
          )}
          <span className="truncate">{node.name}</span>
        </div>
        {node.type === 'folder' && expandedFolders.has(node.id) && node.children && (
          <div>
            {renderFileTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ))
  }

  // Step indicator
  const getStepStatus = (step: BuildStep) => {
    const steps: BuildStep[] = ['planning', 'coding', 'preview', 'complete']
    const currentIndex = steps.indexOf(currentProject.currentStep)
    const stepIndex = steps.indexOf(step)
    
    if (stepIndex < currentIndex) return 'complete'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  // Workflow step indicator
  const getWorkflowStepStatus = (step: WorkflowStep) => {
    const steps: WorkflowStep[] = ['clarification', 'build-plan', 'file-tree', 'code-generation', 'complete']
    const currentIndex = steps.indexOf(currentProject.workflowStep)
    const stepIndex = steps.indexOf(step)
    
    if (stepIndex < currentIndex) return 'complete'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  const workflowStepLabels = {
    'clarification': 'Clarify',
    'build-plan': 'Plan',
    'file-tree': 'Structure',
    'code-generation': 'Code',
    'complete': 'Done'
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold">Build Workspace</h1>
            
            {/* Workflow Step Indicator */}
            <div className="flex items-center gap-3">
              {(['clarification', 'build-plan', 'file-tree', 'code-generation', 'complete'] as WorkflowStep[]).map((step, index) => {
                const status = getWorkflowStepStatus(step)
                return (
                  <div key={step} className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                      status === 'complete' && "bg-green-500 text-white",
                      status === 'active' && "bg-primary text-primary-foreground",
                      status === 'pending' && "bg-muted text-muted-foreground"
                    )}>
                      {status === 'complete' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : status === 'active' ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      status === 'active' && "text-primary",
                      status === 'complete' && "text-green-600",
                      status === 'pending' && "text-muted-foreground"
                    )}>
                      {workflowStepLabels[step]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex bg-muted rounded-lg p-1">
              {(['plan', 'code', 'preview'] as TabType[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize",
                    activeTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === 'plan' && <FileText className="w-4 h-4 mr-2" />}
                  {tab === 'code' && <Code2 className="w-4 h-4 mr-2" />}
                  {tab === 'preview' && <Eye className="w-4 h-4 mr-2" />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateCode}
                disabled={isGenerating || currentProject.currentStep === 'planning'}
              >
                {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentProject.workflowStep === 'clarification') {
                    generateBuildPlan('Creating build plan...')
                  } else if (currentProject.workflowStep === 'build-plan') {
                    generateFileTree()
                  } else if (currentProject.workflowStep === 'file-tree') {
                    generateCode()
                  }
                }}
                disabled={isGenerating || currentProject.workflowStep === 'complete'}
              >
                <Play className="w-4 h-4 mr-2" />
                {currentProject.workflowStep === 'clarification' && 'Create Plan'}
                {currentProject.workflowStep === 'build-plan' && 'Generate Files'}
                {currentProject.workflowStep === 'file-tree' && 'Generate Code'}
                {currentProject.workflowStep === 'code-generation' && 'Complete'}
                {currentProject.workflowStep === 'complete' && 'Done'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentProject.files.length > 0) {
                    const projectData = JSON.stringify(currentProject, null, 2)
                    const blob = new Blob([projectData], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${currentProject.name}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  }
                }}
                disabled={currentProject.files.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export ZIP
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex">
        {/* Left Panel - Builder Chat */}
        <div 
          className="bg-card border-r border-border flex flex-col"
          style={{ width: leftWidth }}
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-sm">Builder Chat</h2>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentProject.messages.length === 1 && currentProject.messages[0].type === 'system' ? (
              // Empty state when only welcome message exists
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <RocketLaunchIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">Ready to Build Something Amazing?</h3>
                  <p className="text-muted-foreground mb-6">
                    Describe your app idea below and I'll help you create a complete application with modern design and functionality.
                  </p>
                  <div className="bg-muted/30 rounded-lg p-4 text-left">
                    <p className="text-sm font-medium mb-2">Try asking:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• "Create an e-commerce store for handmade jewelry"</li>
                      <li>• "Build a task management dashboard"</li>
                      <li>• "Make a booking system for restaurants"</li>
                      <li>• "Design a blog platform for writers"</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              // Regular message display
              <>
                {currentProject.messages.map(message => (
                  <div key={message.id} className={cn(
                    "flex gap-3",
                    message.type === 'user' && "flex-row-reverse"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                      message.type === 'user' && "bg-primary text-primary-foreground",
                      message.type === 'assistant' && "bg-green-500 text-white",
                      message.type === 'system' && "bg-muted text-muted-foreground"
                    )}>
                      {message.type === 'user' ? 'U' : message.type === 'assistant' ? 'AI' : 'S'}
                    </div>
                    <div className={cn(
                      "flex-1 rounded-lg p-3 text-sm",
                      message.type === 'user' && "bg-primary text-primary-foreground ml-8",
                      message.type === 'assistant' && "bg-muted mr-8",
                      message.type === 'system' && "bg-muted/50 mr-8"
                    )}>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {message.content.split('\n').map((line, i) => (
                          <p key={i} className="mb-2 last:mb-0">
                            {line}
                          </p>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
                          {message.actions.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => handleAction(action.id, action.type, action.data)}
                              className={cn(
                                "px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                action.type === 'send-to-files' 
                                  ? "bg-green-600 text-white hover:bg-green-700"
                                  : action.type === 'regenerate'
                                  ? "bg-orange-600 text-white hover:bg-orange-700"
                                  : "bg-primary text-primary-foreground hover:bg-primary/90"
                              )}
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                action.label
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-medium">
                      AI
                    </div>
                    <div className="flex-1 bg-muted rounded-lg p-3 mr-8">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Generating...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Describe your app idea..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isGenerating}
              />
              <Button 
                size="sm" 
                onClick={sendMessage}
                disabled={!prompt.trim() || isGenerating}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Left Resizer */}
        <div
          className="w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors"
          onMouseDown={(e) => { 
            e.preventDefault()
            isDraggingLeft.current = true 
          }}
        />

        {/* Middle Panel - Code */}
        <div className="flex-1 flex flex-col bg-background">
          <div className="flex h-full">
            {/* File Tree */}
            <div className="w-64 bg-card border-r border-border">
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm">Files</h3>
              </div>
              <div className="p-2 overflow-y-auto">
                {renderFileTree(currentProject.files)}
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 flex flex-col">
              {selectedFile ? (
                <>
                  <div className="p-3 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4" />
                      <span className="text-sm font-medium">{selectedFile.path}</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <Textarea
                      value={selectedFile.content || ''}
                      onChange={(e) => {
                        if (selectedFile) {
                          setSelectedFile({
                            ...selectedFile,
                            content: e.target.value
                          })
                        }
                      }}
                      className="w-full h-full font-mono text-sm resize-none border-0 focus:ring-0"
                      placeholder="Select a file to edit..."
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a file to start editing</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Resizer */}
        <div
          className="w-1 bg-border hover:bg-primary/50 cursor-col-resize transition-colors"
          onMouseDown={(e) => { 
            e.preventDefault()
            isDraggingRight.current = true 
          }}
        />

        {/* Right Panel - Preview */}
        <div 
          className="bg-card border-l border-border flex flex-col"
          style={{ width: rightWidth }}
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-sm">Live Preview</h2>
          </div>
          
          <div className="flex-1 p-4">
            {currentProject.previewUrl ? (
              <div className="w-full h-full bg-white rounded-lg border border-border overflow-hidden">
                {/* E-commerce App Preview */}
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="bg-white border-b p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">ShopApp</h1>
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-700">Home</span>
                      <span className="text-gray-700">Products</span>
                      <span className="text-gray-700">Cart</span>
                    </div>
                  </div>
                  
                  {/* Hero Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to ShopApp</h2>
                    <p className="text-gray-600 mb-6">Discover amazing products at unbeatable prices</p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
                      Shop Now
                    </button>
                  </div>
                  
                  {/* Features */}
                  <div className="flex-1 p-6 bg-white">
                    <h3 className="text-lg font-bold text-center mb-6">Why Choose ShopApp?</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl mb-2">🚚</div>
                        <h4 className="font-semibold text-sm">Fast Shipping</h4>
                        <p className="text-xs text-gray-600">Free shipping on orders over $50</p>
                      </div>
                      <div>
                        <div className="text-2xl mb-2">🛡️</div>
                        <h4 className="font-semibold text-sm">Secure Payment</h4>
                        <p className="text-xs text-gray-600">Your payment information is safe</p>
                      </div>
                      <div>
                        <div className="text-2xl mb-2">💎</div>
                        <h4 className="font-semibold text-sm">Quality Products</h4>
                        <p className="text-xs text-gray-600">Curated selection of premium items</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : currentProject.workflowStep === 'code-generation' && !currentProject.previewUrl ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg bg-green-50">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p className="font-medium text-green-700">Code Generated Successfully!</p>
                  <p className="text-sm mt-2 text-green-600">Click "Send to Files" to see your app preview</p>
                </div>
              </div>
            ) : currentProject.workflowStep !== 'clarification' ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg bg-blue-50">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
                  <p className="font-medium text-blue-700">Building Your App...</p>
                  <p className="text-sm mt-2 text-blue-600">
                    {currentProject.workflowStep === 'build-plan' && 'Creating build plan'}
                    {currentProject.workflowStep === 'file-tree' && 'Generating file structure'}
                    {currentProject.workflowStep === 'code-generation' && 'Writing code'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Preview will appear here</p>
                  <p className="text-sm mt-2">Describe your app to start building</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature}
      />
    </div>
  )
}