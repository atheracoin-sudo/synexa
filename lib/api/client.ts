/**
 * API Client for Synexa Backend
 * Handles authentication and API calls to the backend server
 */

import { API_CONFIG } from '@/lib/config/environment'
import { performanceMonitor } from '@/lib/utils/performance'

// Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    status: number
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  modelId?: string
  workspaceId?: string
  conversationId?: string
}

export interface ChatResponse {
  requestId: string
  outputText: string
  reply: string
  text: string
  model: string
  resolvedWorkspaceId?: string
  workspaceFallbackUsed?: boolean
  modelRedirected?: boolean
  originalModelId?: string
  resolvedModelId?: string
}

export interface User {
  id: string
  email?: string
  credits: number
  dailyUsageChat: number
  dailyUsageImage: number
  dailyUsageVideo: number
  createdAt: string
  updatedAt: string
}

export interface Workspace {
  id: string
  name: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CodeRequest {
  prompt: string
  files: Record<string, string>
  activeFilePath?: string
  workspaceId?: string
}

export interface CodePatch {
  plan: string
  operations: Array<{
    op: 'write' | 'delete' | 'rename'
    path: string
    content?: string
    newPath?: string
  }>
}

export interface DesignRequest {
  prompt: string
  style?: string
  width?: number
  height?: number
  workspaceId?: string
}

export interface DesignScene {
  scene: {
    width: number
    height: number
    background: string
    nodes: Array<{
      type: 'text' | 'rect' | 'circle'
      x: number
      y: number
      width: number
      height: number
      fill: string
      stroke?: string
      strokeWidth?: number
      text?: string
      fontSize?: number
      fontFamily?: string
      textAlign?: 'left' | 'center' | 'right'
    }>
  }
}

// User-friendly error messages
const ERROR_MESSAGES: Record<string, string> = {
  'NETWORK_ERROR': 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
  'API_KEY_MISSING': 'AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
  'INVALID_API_KEY': 'AI servisi yapılandırması hatalı. Lütfen yönetici ile iletişime geçin.',
  'RATE_LIMIT_EXCEEDED': 'Çok fazla istek gönderdiniz. Lütfen birkaç dakika bekleyin.',
  'OPENAI_RATE_LIMIT': 'AI servisi yoğun. Lütfen birkaç dakika bekleyin.',
  'UNAUTHORIZED': 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
  'FORBIDDEN': 'Bu işlem için yetkiniz bulunmuyor.',
  'NOT_FOUND': 'İstenen kaynak bulunamadı.',
  'INTERNAL_ERROR': 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
  'BAD_REQUEST': 'Geçersiz istek. Lütfen girdiğiniz bilgileri kontrol edin.',
  'SERVICE_UNAVAILABLE': 'Servis şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.'
}

function getUserFriendlyErrorMessage(errorCode: string, originalMessage: string): string {
  return ERROR_MESSAGES[errorCode] || originalMessage || 'Beklenmeyen bir hata oluştu.'
}

// API Client Class
export class SynexaApiClient {
  private baseUrl: string
  private authToken: string | null = null
  private defaultTimeout: number = API_CONFIG.TIMEOUT.DEFAULT
  private maxRetries: number = API_CONFIG.RETRY.MAX_ATTEMPTS

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl
    this.loadAuthToken()
  }

  // Auth Token Management
  private loadAuthToken(): void {
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('synexa_auth_token')
    }
  }

  private saveAuthToken(token: string): void {
    this.authToken = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('synexa_auth_token', token)
    }
  }

  private clearAuthToken(): void {
    this.authToken = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('synexa_auth_token')
    }
  }

  // Timeout helper
  private createTimeoutController(timeoutMs: number = this.defaultTimeout): AbortController {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), timeoutMs)
    return controller
  }

  // Retry helper
  private async retryRequest<T>(
    fn: () => Promise<ApiResponse<T>>,
    retries: number = this.maxRetries
  ): Promise<ApiResponse<T>> {
    try {
      return await fn()
    } catch (error: any) {
      if (retries > 0 && (error.name === 'AbortError' || error.code === 'NETWORK_ERROR')) {
        console.log(`Retrying request, ${retries} attempts left`)
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY.DELAY))
        return this.retryRequest(fn, retries - 1)
      }
      throw error
    }
  }

  // HTTP Request Helper
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout?: number
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const method = options.method || 'GET'
    const stopTimer = performanceMonitor.startTimer(`api_${method}_${endpoint}`)
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    }

    // Add auth token if available
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`
    }

    const timeoutController = this.createTimeoutController(timeout)
    // Use timeout signal, original signal takes precedence if provided
    const signal = options.signal || timeoutController.signal

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal
      })
      
      stopTimer() // Record successful request time

      // Handle different response types
      let data: any
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        // Handle backend error format
        if (data && typeof data === 'object' && data.errorCode) {
          const errorCode = data.errorCode
          const originalMessage = data.message || 'An error occurred'
          return {
            success: false,
            error: {
              code: errorCode,
              message: getUserFriendlyErrorMessage(errorCode, originalMessage),
              status: response.status
            }
          }
        }

        // Handle legacy error format
        if (data && typeof data === 'object' && data.error) {
          const errorCode = data.error.code || 'API_ERROR'
          const originalMessage = data.error.message || data.error
          return {
            success: false,
            error: {
              code: errorCode,
              message: getUserFriendlyErrorMessage(errorCode, originalMessage),
              status: response.status
            }
          }
        }

        return {
          success: false,
          error: {
            code: 'HTTP_ERROR',
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status
          }
        }
      }

      return {
        success: true,
        data
      }
    } catch (error: any) {
      stopTimer() // Record failed request time
      console.error('API Request failed:', error)
      const originalMessage = error.message || 'Network request failed'
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: getUserFriendlyErrorMessage('NETWORK_ERROR', originalMessage),
          status: 0
        }
      }
    }
  }

  // Authentication
  async login(email?: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ email })
    })

    if (response.success && response.data?.token) {
      this.saveAuthToken(response.data.token)
    }

    return response
  }

  async logout(): Promise<void> {
    this.clearAuthToken()
  }

  // Chat API
  async chat(request: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    return this.retryRequest(() => 
      this.request<ChatResponse>('/chat', {
        method: 'POST',
        body: JSON.stringify(request)
      }, API_CONFIG.TIMEOUT.CHAT)
    )
  }

  async chatOpenAI(request: ChatRequest): Promise<ApiResponse<ChatResponse>> {
    return this.request<ChatResponse>('/chat/openai', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  // Code API
  async generateCode(request: CodeRequest): Promise<ApiResponse<CodePatch>> {
    return this.retryRequest(() =>
      this.request<CodePatch>('/code', {
        method: 'POST',
        body: JSON.stringify(request)
      }, API_CONFIG.TIMEOUT.CODE)
    )
  }

  // Design API
  async generateDesign(request: DesignRequest): Promise<ApiResponse<DesignScene>> {
    return this.retryRequest(() =>
      this.request<DesignScene>('/design', {
        method: 'POST',
        body: JSON.stringify(request)
      }, API_CONFIG.TIMEOUT.DESIGN)
    )
  }

  // Workspaces API
  async getWorkspaces(): Promise<ApiResponse<Workspace[]>> {
    return this.request<Workspace[]>('/workspaces')
  }

  async createWorkspace(name: string): Promise<ApiResponse<Workspace>> {
    return this.request<Workspace>('/workspaces', {
      method: 'POST',
      body: JSON.stringify({ name })
    })
  }

  async updateWorkspace(id: string, name: string): Promise<ApiResponse<Workspace>> {
    return this.request<Workspace>(`/workspaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name })
    })
  }

  async deleteWorkspace(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/workspaces/${id}`, {
      method: 'DELETE'
    })
  }

  // User API
  async getUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me')
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request<{ status: string; timestamp: string }>('/health')
  }

  // Status Check
  async statusCheck(): Promise<ApiResponse<any>> {
    return this.request<any>('/status')
  }
}

// Default client instance
export const apiClient = new SynexaApiClient()

// Helper functions
export const isAuthenticated = (): boolean => {
  return apiClient['authToken'] !== null
}

export const getAuthToken = (): string | null => {
  return apiClient['authToken']
}
