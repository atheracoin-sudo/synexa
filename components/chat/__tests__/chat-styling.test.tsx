/**
 * Test file to verify chat styling improvements
 * This ensures our dark theme contrast fixes work correctly
 */

import { render } from '@testing-library/react'
import { MessageBubble } from '../MessageBubble'

// Mock message data
const mockUserMessage = {
  id: '1',
  role: 'user' as const,
  content: 'Hello, this is a test message from the user.',
  timestamp: new Date(),
}

const mockAssistantMessage = {
  id: '2',
  role: 'assistant' as const,
  content: 'Hello! This is a response from the AI assistant with **markdown** support and `code` snippets.',
  timestamp: new Date(),
}

describe('Chat Styling', () => {
  it('renders user message with proper styling', () => {
    const { container } = render(<MessageBubble message={mockUserMessage} />)
    
    // Check if user message has primary background
    const messageContainer = container.querySelector('.bg-primary')
    expect(messageContainer).toBeInTheDocument()
    
    // Check if text is white for contrast
    const textElement = container.querySelector('.text-white')
    expect(textElement).toBeInTheDocument()
  })

  it('renders assistant message with proper styling', () => {
    const { container } = render(<MessageBubble message={mockAssistantMessage} />)
    
    // Check if assistant message has card background
    const messageContainer = container.querySelector('.bg-card')
    expect(messageContainer).toBeInTheDocument()
    
    // Check if proper text color is applied
    const textElement = container.querySelector('.text-card-foreground')
    expect(textElement).toBeInTheDocument()
  })

  it('applies proper typography classes', () => {
    const { container } = render(<MessageBubble message={mockAssistantMessage} />)
    
    // Check for improved typography
    const textElement = container.querySelector('[class*="text-\\[15px\\]"]')
    expect(textElement).toBeInTheDocument()
    
    // Check for proper line height
    const lineHeightElement = container.querySelector('[class*="leading-\\[1\\.6\\]"]')
    expect(lineHeightElement).toBeInTheDocument()
  })

  it('includes accessibility features', () => {
    const { container } = render(<MessageBubble message={mockAssistantMessage} />)
    
    // Check for focus-visible styles on action buttons
    const actionButton = container.querySelector('[class*="focus-visible:outline-none"]')
    expect(actionButton).toBeInTheDocument()
  })
})