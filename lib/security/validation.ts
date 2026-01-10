// Request validation utilities

export const REQUEST_SIZE_LIMITS = {
  CHAT: 50 * 1024, // 50KB for chat messages
  CODE: 500 * 1024, // 500KB for code workspaces
  DESIGN: 100 * 1024, // 100KB for design data
} as const

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  status: number
}

export interface ApiSuccess<T = any> {
  success: true
  data: T
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError

export function createErrorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: any
): ApiError {
  return {
    success: false,
    error: {
      code,
      message,
      details
    },
    status
  }
}

export function createSuccessResponse<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data
  }
}

export function validateRequestSize(
  body: any,
  limit: number,
  type: string
): ApiError | null {
  const size = JSON.stringify(body).length
  
  if (size > limit) {
    return createErrorResponse(
      'REQUEST_TOO_LARGE',
      `Request size (${Math.round(size / 1024)}KB) exceeds limit (${Math.round(limit / 1024)}KB) for ${type}`,
      413,
      { size, limit, type }
    )
  }
  
  return null
}

export function validateChatRequest(body: any): ApiError | null {
  if (!body.messages || !Array.isArray(body.messages)) {
    return createErrorResponse(
      'INVALID_MESSAGES',
      'Messages array is required'
    )
  }

  if (body.messages.length === 0) {
    return createErrorResponse(
      'EMPTY_MESSAGES',
      'At least one message is required'
    )
  }

  if (body.messages.length > 50) {
    return createErrorResponse(
      'TOO_MANY_MESSAGES',
      'Maximum 50 messages allowed per request'
    )
  }

  // Validate message structure
  for (const [index, message] of body.messages.entries()) {
    if (!message.role || !['user', 'assistant'].includes(message.role)) {
      return createErrorResponse(
        'INVALID_MESSAGE_ROLE',
        `Invalid role at message ${index}. Must be 'user' or 'assistant'`
      )
    }

    if (!message.content || typeof message.content !== 'string') {
      return createErrorResponse(
        'INVALID_MESSAGE_CONTENT',
        `Invalid content at message ${index}. Must be a non-empty string`
      )
    }

    if (message.content.length > 10000) {
      return createErrorResponse(
        'MESSAGE_TOO_LONG',
        `Message ${index} exceeds 10,000 characters`
      )
    }
  }

  return null
}

export function validateCodeRequest(body: any): ApiError | null {
  if (!body.prompt || typeof body.prompt !== 'string') {
    return createErrorResponse(
      'INVALID_PROMPT',
      'Prompt is required and must be a string'
    )
  }

  if (body.prompt.length > 2000) {
    return createErrorResponse(
      'PROMPT_TOO_LONG',
      'Prompt cannot exceed 2,000 characters'
    )
  }

  if (!body.files || typeof body.files !== 'object') {
    return createErrorResponse(
      'INVALID_FILES',
      'Files object is required'
    )
  }

  const fileCount = Object.keys(body.files).length
  if (fileCount > 50) {
    return createErrorResponse(
      'TOO_MANY_FILES',
      'Maximum 50 files allowed per workspace'
    )
  }

  // Validate file paths and content
  for (const [path, content] of Object.entries(body.files)) {
    if (typeof path !== 'string' || typeof content !== 'string') {
      return createErrorResponse(
        'INVALID_FILE_FORMAT',
        'File paths and content must be strings'
      )
    }

    // Basic path validation
    if (path.includes('..') || path.startsWith('/') || path.includes('\\')) {
      return createErrorResponse(
        'INVALID_FILE_PATH',
        `Invalid file path: ${path}`
      )
    }

    if ((content as string).length > 50000) {
      return createErrorResponse(
        'FILE_TOO_LARGE',
        `File ${path} exceeds 50,000 characters`
      )
    }
  }

  return null
}

export function validateDesignRequest(body: any): ApiError | null {
  if (!body.prompt || typeof body.prompt !== 'string') {
    return createErrorResponse(
      'INVALID_PROMPT',
      'Prompt is required and must be a string'
    )
  }

  if (body.prompt.length > 1000) {
    return createErrorResponse(
      'PROMPT_TOO_LONG',
      'Prompt cannot exceed 1,000 characters'
    )
  }

  if (body.width && (typeof body.width !== 'number' || body.width < 100 || body.width > 4000)) {
    return createErrorResponse(
      'INVALID_WIDTH',
      'Width must be a number between 100 and 4000'
    )
  }

  if (body.height && (typeof body.height !== 'number' || body.height < 100 || body.height > 4000)) {
    return createErrorResponse(
      'INVALID_HEIGHT',
      'Height must be a number between 100 and 4000'
    )
  }

  return null
}
