'use client'

// Developer API & Documentation Management System
export type ApiScope = 'chat' | 'agents' | 'code' | 'image'
export type ApiKeyStatus = 'active' | 'revoked' | 'expired'
export type WebhookEvent = 'agent.completed' | 'job.failed' | 'usage.threshold' | 'payment.succeeded'

export interface ApiKey {
  id: string
  name: string
  key: string
  maskedKey: string
  scopes: ApiScope[]
  status: ApiKeyStatus
  createdAt: string
  lastUsed?: string
  usageCount: number
  rateLimit: number
  rateLimitRemaining: number
}

export interface ApiUsage {
  totalRequests: number
  requestsThisMonth: number
  rateLimitHits: number
  topEndpoints: Array<{
    endpoint: string
    count: number
    percentage: number
  }>
  usageByDay: Array<{
    date: string
    requests: number
  }>
}

export interface Webhook {
  id: string
  url: string
  events: WebhookEvent[]
  status: 'active' | 'inactive'
  secret: string
  createdAt: string
  lastTriggered?: string
  successRate: number
}

export interface ApiEndpoint {
  id: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  title: string
  description: string
  category: string
  scopes: ApiScope[]
  isPremium: boolean
  parameters: Array<{
    name: string
    type: string
    required: boolean
    description: string
    example?: any
  }>
  responses: Array<{
    status: number
    description: string
    schema: any
    example: any
  }>
  errors: Array<{
    code: number
    message: string
    description: string
    solution: string
  }>
}

export interface SdkInfo {
  id: string
  name: string
  language: string
  version: string
  installCommand: string
  githubUrl: string
  npmUrl?: string
  pypiUrl?: string
  basicUsage: string
  examples: Array<{
    title: string
    description: string
    code: string
  }>
}

class DeveloperManager {
  private apiKeys: Map<string, ApiKey> = new Map()
  private webhooks: Map<string, Webhook> = new Map()
  private endpoints: Map<string, ApiEndpoint> = new Map()
  private sdks: Map<string, SdkInfo> = new Map()
  private usage: ApiUsage

  constructor() {
    this.initializeMockData()
    this.usage = this.calculateUsage()
  }

  private initializeMockData() {
    // Mock API Keys
    const apiKeys: ApiKey[] = [
      {
        id: 'key-1',
        name: 'Production Key',
        key: 'sx_live_1234567890abcdef1234567890abcdef12345678',
        maskedKey: 'sx_live_••••••••••••••••••••••••••••••••••••5678',
        scopes: ['chat', 'agents', 'code', 'image'],
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        lastUsed: '2024-01-08T15:30:00Z',
        usageCount: 15420,
        rateLimit: 1000,
        rateLimitRemaining: 847
      },
      {
        id: 'key-2',
        name: 'Development Key',
        key: 'sx_test_abcdef1234567890abcdef1234567890abcdef12',
        maskedKey: 'sx_test_••••••••••••••••••••••••••••••••••••ef12',
        scopes: ['chat', 'code'],
        status: 'active',
        createdAt: '2024-01-05T00:00:00Z',
        lastUsed: '2024-01-08T12:15:00Z',
        usageCount: 2340,
        rateLimit: 100,
        rateLimitRemaining: 78
      }
    ]

    // Mock Webhooks
    const webhooks: Webhook[] = [
      {
        id: 'webhook-1',
        url: 'https://myapp.com/webhooks/synexa',
        events: ['agent.completed', 'job.failed'],
        status: 'active',
        secret: 'whsec_1234567890abcdef',
        createdAt: '2024-01-01T00:00:00Z',
        lastTriggered: '2024-01-08T14:20:00Z',
        successRate: 98.5
      }
    ]

    // Mock API Endpoints
    const endpoints: ApiEndpoint[] = [
      {
        id: 'chat-create',
        method: 'POST',
        path: '/v1/chat/completions',
        title: 'Create Chat Completion',
        description: 'Generate AI responses for chat conversations',
        category: 'Chat',
        scopes: ['chat'],
        isPremium: false,
        parameters: [
          {
            name: 'messages',
            type: 'array',
            required: true,
            description: 'Array of message objects',
            example: [{ role: 'user', content: 'Hello!' }]
          },
          {
            name: 'model',
            type: 'string',
            required: false,
            description: 'Model to use for completion',
            example: 'synexa-chat-v1'
          },
          {
            name: 'max_tokens',
            type: 'integer',
            required: false,
            description: 'Maximum tokens to generate',
            example: 150
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Successful completion',
            schema: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                choices: { type: 'array' },
                usage: { type: 'object' }
              }
            },
            example: {
              id: 'chat-123',
              choices: [{ message: { role: 'assistant', content: 'Hello! How can I help you?' } }],
              usage: { prompt_tokens: 10, completion_tokens: 15, total_tokens: 25 }
            }
          }
        ],
        errors: [
          {
            code: 400,
            message: 'Bad Request',
            description: 'Invalid request parameters',
            solution: 'Check your request format and required parameters'
          },
          {
            code: 401,
            message: 'Unauthorized',
            description: 'Invalid API key',
            solution: 'Ensure your API key is valid and has chat scope'
          }
        ]
      },
      {
        id: 'agents-create',
        method: 'POST',
        path: '/v1/agents/run',
        title: 'Run AI Agent',
        description: 'Execute an AI agent workflow',
        category: 'Agents',
        scopes: ['agents'],
        isPremium: true,
        parameters: [
          {
            name: 'agent_id',
            type: 'string',
            required: true,
            description: 'ID of the agent to run',
            example: 'saas-mvp-builder'
          },
          {
            name: 'inputs',
            type: 'object',
            required: true,
            description: 'Input parameters for the agent',
            example: { project_name: 'My SaaS', features: ['auth', 'billing'] }
          }
        ],
        responses: [
          {
            status: 202,
            description: 'Agent execution started',
            schema: {
              type: 'object',
              properties: {
                job_id: { type: 'string' },
                status: { type: 'string' },
                estimated_duration: { type: 'integer' }
              }
            },
            example: {
              job_id: 'job-456',
              status: 'running',
              estimated_duration: 900
            }
          }
        ],
        errors: [
          {
            code: 402,
            message: 'Payment Required',
            description: 'Premium subscription required for agents',
            solution: 'Upgrade to Premium to access AI Agents API'
          }
        ]
      },
      {
        id: 'code-generate',
        method: 'POST',
        path: '/v1/code/generate',
        title: 'Generate Code',
        description: 'Generate code based on natural language description',
        category: 'Code',
        scopes: ['code'],
        isPremium: false,
        parameters: [
          {
            name: 'prompt',
            type: 'string',
            required: true,
            description: 'Description of the code to generate',
            example: 'Create a React component for a login form'
          },
          {
            name: 'language',
            type: 'string',
            required: false,
            description: 'Programming language',
            example: 'javascript'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Code generated successfully',
            schema: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                language: { type: 'string' },
                explanation: { type: 'string' }
              }
            },
            example: {
              code: 'const LoginForm = () => { ... }',
              language: 'javascript',
              explanation: 'A React functional component with form validation'
            }
          }
        ],
        errors: []
      },
      {
        id: 'image-generate',
        method: 'POST',
        path: '/v1/images/generate',
        title: 'Generate Image',
        description: 'Create images from text descriptions',
        category: 'Image',
        scopes: ['image'],
        isPremium: false,
        parameters: [
          {
            name: 'prompt',
            type: 'string',
            required: true,
            description: 'Description of the image to generate',
            example: 'A modern logo for a tech startup'
          },
          {
            name: 'size',
            type: 'string',
            required: false,
            description: 'Image dimensions',
            example: '1024x1024'
          }
        ],
        responses: [
          {
            status: 200,
            description: 'Image generated successfully',
            schema: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                width: { type: 'integer' },
                height: { type: 'integer' }
              }
            },
            example: {
              url: 'https://api.synexa.ai/images/generated/abc123.png',
              width: 1024,
              height: 1024
            }
          }
        ],
        errors: []
      }
    ]

    // Mock SDKs
    const sdks: SdkInfo[] = [
      {
        id: 'js-sdk',
        name: 'JavaScript SDK',
        language: 'JavaScript',
        version: '1.2.0',
        installCommand: 'npm install @synexa/sdk',
        githubUrl: 'https://github.com/synexa/js-sdk',
        npmUrl: 'https://npmjs.com/package/@synexa/sdk',
        basicUsage: `import { Synexa } from '@synexa/sdk';

const synexa = new Synexa({
  apiKey: 'your-api-key'
});

const response = await synexa.chat.create({
  messages: [{ role: 'user', content: 'Hello!' }]
});`,
        examples: [
          {
            title: 'Chat Completion',
            description: 'Generate AI responses for conversations',
            code: `const response = await synexa.chat.create({
  messages: [
    { role: 'user', content: 'Explain quantum computing' }
  ],
  max_tokens: 150
});

console.log(response.choices[0].message.content);`
          },
          {
            title: 'Run AI Agent',
            description: 'Execute workflow agents',
            code: `const job = await synexa.agents.run({
  agent_id: 'saas-mvp-builder',
  inputs: {
    project_name: 'My SaaS',
    features: ['auth', 'billing', 'dashboard']
  }
});

// Poll for completion
const result = await synexa.agents.waitForCompletion(job.job_id);`
          }
        ]
      },
      {
        id: 'python-sdk',
        name: 'Python SDK',
        language: 'Python',
        version: '1.1.0',
        installCommand: 'pip install synexa',
        githubUrl: 'https://github.com/synexa/python-sdk',
        pypiUrl: 'https://pypi.org/project/synexa/',
        basicUsage: `from synexa import Synexa

client = Synexa(api_key="your-api-key")

response = client.chat.create(
    messages=[{"role": "user", "content": "Hello!"}]
)`,
        examples: [
          {
            title: 'Generate Code',
            description: 'Create code from natural language',
            code: `response = client.code.generate(
    prompt="Create a Python function to calculate fibonacci",
    language="python"
)

print(response.code)
print(response.explanation)`
          },
          {
            title: 'Generate Images',
            description: 'Create images from text descriptions',
            code: `image = client.images.generate(
    prompt="A modern minimalist logo for a tech company",
    size="1024x1024"
)

print(f"Image URL: {image.url}")`
          }
        ]
      }
    ]

    // Initialize data
    apiKeys.forEach(key => this.apiKeys.set(key.id, key))
    webhooks.forEach(webhook => this.webhooks.set(webhook.id, webhook))
    endpoints.forEach(endpoint => this.endpoints.set(endpoint.id, endpoint))
    sdks.forEach(sdk => this.sdks.set(sdk.id, sdk))
  }

  private calculateUsage(): ApiUsage {
    const keys = Array.from(this.apiKeys.values())
    const totalRequests = keys.reduce((sum, key) => sum + key.usageCount, 0)
    
    return {
      totalRequests,
      requestsThisMonth: 17760,
      rateLimitHits: 23,
      topEndpoints: [
        { endpoint: '/v1/chat/completions', count: 12450, percentage: 70 },
        { endpoint: '/v1/code/generate', count: 3540, percentage: 20 },
        { endpoint: '/v1/images/generate', count: 1770, percentage: 10 }
      ],
      usageByDay: [
        { date: '2024-01-01', requests: 1200 },
        { date: '2024-01-02', requests: 1450 },
        { date: '2024-01-03', requests: 1680 },
        { date: '2024-01-04', requests: 1320 },
        { date: '2024-01-05', requests: 1890 },
        { date: '2024-01-06', requests: 2100 },
        { date: '2024-01-07', requests: 2340 },
        { date: '2024-01-08', requests: 1780 }
      ]
    }
  }

  // API Key Management
  getApiKeys(): ApiKey[] {
    return Array.from(this.apiKeys.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getApiKey(id: string): ApiKey | null {
    return this.apiKeys.get(id) || null
  }

  createApiKey(name: string, scopes: ApiScope[]): ApiKey {
    const id = `key-${Date.now()}`
    const keyValue = `sx_${scopes.includes('agents') ? 'live' : 'test'}_${this.generateRandomString(40)}`
    
    const apiKey: ApiKey = {
      id,
      name,
      key: keyValue,
      maskedKey: this.maskApiKey(keyValue),
      scopes,
      status: 'active',
      createdAt: new Date().toISOString(),
      usageCount: 0,
      rateLimit: scopes.includes('agents') ? 1000 : 100,
      rateLimitRemaining: scopes.includes('agents') ? 1000 : 100
    }

    this.apiKeys.set(id, apiKey)
    return apiKey
  }

  rotateApiKey(id: string): ApiKey | null {
    const existingKey = this.apiKeys.get(id)
    if (!existingKey) return null

    const newKeyValue = `sx_${existingKey.scopes.includes('agents') ? 'live' : 'test'}_${this.generateRandomString(40)}`
    const updatedKey: ApiKey = {
      ...existingKey,
      key: newKeyValue,
      maskedKey: this.maskApiKey(newKeyValue),
      createdAt: new Date().toISOString(),
      usageCount: 0,
      rateLimitRemaining: existingKey.rateLimit
    }

    this.apiKeys.set(id, updatedKey)
    return updatedKey
  }

  revokeApiKey(id: string): boolean {
    const key = this.apiKeys.get(id)
    if (!key) return false

    key.status = 'revoked'
    this.apiKeys.set(id, key)
    return true
  }

  private maskApiKey(key: string): string {
    if (key.length < 8) return key
    const prefix = key.substring(0, key.indexOf('_') + 1)
    const suffix = key.slice(-4)
    const middle = '•'.repeat(key.length - prefix.length - suffix.length)
    return `${prefix}${middle}${suffix}`
  }

  private generateRandomString(length: number): string {
    const chars = 'abcdef0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Usage & Analytics
  getUsage(): ApiUsage {
    return this.usage
  }

  // Webhooks
  getWebhooks(): Webhook[] {
    return Array.from(this.webhooks.values())
  }

  createWebhook(url: string, events: WebhookEvent[]): Webhook {
    const id = `webhook-${Date.now()}`
    const webhook: Webhook = {
      id,
      url,
      events,
      status: 'active',
      secret: `whsec_${this.generateRandomString(16)}`,
      createdAt: new Date().toISOString(),
      successRate: 100
    }

    this.webhooks.set(id, webhook)
    return webhook
  }

  deleteWebhook(id: string): boolean {
    return this.webhooks.delete(id)
  }

  testWebhook(id: string): boolean {
    const webhook = this.webhooks.get(id)
    if (!webhook) return false

    // Simulate webhook test
    webhook.lastTriggered = new Date().toISOString()
    this.webhooks.set(id, webhook)
    return true
  }

  // API Documentation
  getEndpoints(): ApiEndpoint[] {
    return Array.from(this.endpoints.values())
  }

  getEndpointsByCategory(): Record<string, ApiEndpoint[]> {
    const endpoints = this.getEndpoints()
    const categories: Record<string, ApiEndpoint[]> = {}

    endpoints.forEach(endpoint => {
      if (!categories[endpoint.category]) {
        categories[endpoint.category] = []
      }
      categories[endpoint.category].push(endpoint)
    })

    return categories
  }

  getEndpoint(id: string): ApiEndpoint | null {
    return this.endpoints.get(id) || null
  }

  searchEndpoints(query: string): ApiEndpoint[] {
    const lowercaseQuery = query.toLowerCase()
    return Array.from(this.endpoints.values())
      .filter(endpoint => 
        endpoint.title.toLowerCase().includes(lowercaseQuery) ||
        endpoint.description.toLowerCase().includes(lowercaseQuery) ||
        endpoint.path.toLowerCase().includes(lowercaseQuery) ||
        endpoint.category.toLowerCase().includes(lowercaseQuery)
      )
  }

  // SDKs
  getSdks(): SdkInfo[] {
    return Array.from(this.sdks.values())
  }

  getSdk(id: string): SdkInfo | null {
    return this.sdks.get(id) || null
  }

  // Utility functions
  formatUsageCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  getRateLimitPercentage(remaining: number, total: number): number {
    return Math.round(((total - remaining) / total) * 100)
  }

  getScopeIcon(scope: ApiScope): string {
    const icons = {
      chat: '💬',
      agents: '🤖',
      code: '💻',
      image: '🎨'
    }
    return icons[scope] || '📄'
  }

  getScopeName(scope: ApiScope): string {
    const names = {
      chat: 'Chat API',
      agents: 'Agents API',
      code: 'Code API',
      image: 'Image API'
    }
    return names[scope] || scope
  }
}

// Singleton instance
export const developerManager = new DeveloperManager()











