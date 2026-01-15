import { Server } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import { verifyToken } from './authService'

interface SyncEvent {
  type: 'chat_message' | 'workspace_update' | 'user_status' | 'heartbeat'
  data: any
  timestamp: number
  userId?: string
}

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string
  isAlive?: boolean
}

export class WebSocketService {
  private wss: WebSocketServer
  private clients: Map<string, AuthenticatedWebSocket[]> = new Map()

  constructor(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    })

    this.wss.on('connection', this.handleConnection.bind(this))
    this.startHeartbeat()
    
    console.log('[WebSocket] Server initialized on /ws')
  }

  private handleConnection(ws: AuthenticatedWebSocket, request: any) {
    console.log('[WebSocket] New connection')
    
    // Extract token from query params
    const url = new URL(request.url, `http://${request.headers.host}`)
    const token = url.searchParams.get('token')
    
    if (token) {
      const payload = verifyToken(token)
      if (payload) {
        ws.userId = payload.userId
        this.addClient(payload.userId, ws)
        console.log(`[WebSocket] Authenticated user: ${payload.userId}`)
      } else {
        console.log('[WebSocket] Invalid token, closing connection')
        ws.close(1008, 'Invalid token')
        return
      }
    }

    ws.isAlive = true
    
    ws.on('message', (data) => {
      try {
        const event: SyncEvent = JSON.parse(data.toString())
        this.handleMessage(ws, event)
      } catch (error) {
        console.warn('[WebSocket] Invalid message format:', data.toString())
      }
    })

    ws.on('pong', () => {
      ws.isAlive = true
    })

    ws.on('close', () => {
      console.log('[WebSocket] Connection closed')
      if (ws.userId) {
        this.removeClient(ws.userId, ws)
      }
    })

    ws.on('error', (error) => {
      console.error('[WebSocket] Connection error:', error)
    })

    // Send welcome message
    this.sendToClient(ws, {
      type: 'user_status',
      data: { status: 'connected' },
      timestamp: Date.now()
    })
  }

  private handleMessage(ws: AuthenticatedWebSocket, event: SyncEvent) {
    console.log(`[WebSocket] Received ${event.type} from ${ws.userId}`)

    switch (event.type) {
      case 'heartbeat':
        // Respond to heartbeat
        this.sendToClient(ws, {
          type: 'heartbeat',
          data: { status: 'alive' },
          timestamp: Date.now()
        })
        break

      case 'chat_message':
        // Broadcast chat message to all user's clients
        if (ws.userId) {
          this.broadcastToUser(ws.userId, {
            type: 'chat_message',
            data: event.data,
            timestamp: Date.now(),
            userId: ws.userId
          })
        }
        break

      case 'workspace_update':
        // Broadcast workspace update to all user's clients
        if (ws.userId) {
          this.broadcastToUser(ws.userId, {
            type: 'workspace_update',
            data: event.data,
            timestamp: Date.now(),
            userId: ws.userId
          })
        }
        break

      default:
        console.warn(`[WebSocket] Unknown event type: ${event.type}`)
    }
  }

  private addClient(userId: string, ws: AuthenticatedWebSocket) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, [])
    }
    this.clients.get(userId)!.push(ws)
  }

  private removeClient(userId: string, ws: AuthenticatedWebSocket) {
    const userClients = this.clients.get(userId)
    if (userClients) {
      const index = userClients.indexOf(ws)
      if (index > -1) {
        userClients.splice(index, 1)
      }
      if (userClients.length === 0) {
        this.clients.delete(userId)
      }
    }
  }

  private sendToClient(ws: AuthenticatedWebSocket, event: SyncEvent) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(event))
    }
  }

  public broadcastToUser(userId: string, event: SyncEvent) {
    const userClients = this.clients.get(userId)
    if (userClients) {
      userClients.forEach(ws => {
        this.sendToClient(ws, event)
      })
    }
  }

  public broadcastToAll(event: SyncEvent) {
    this.clients.forEach((clients) => {
      clients.forEach(ws => {
        this.sendToClient(ws, event)
      })
    })
  }

  private startHeartbeat() {
    setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
        if (ws.isAlive === false) {
          console.log('[WebSocket] Terminating dead connection')
          ws.terminate()
          return
        }

        ws.isAlive = false
        ws.ping()
      })
    }, 30000) // 30 seconds
  }

  public getStats() {
    return {
      totalConnections: this.wss.clients.size,
      authenticatedUsers: this.clients.size,
      userConnections: Array.from(this.clients.entries()).map(([userId, clients]) => ({
        userId,
        connections: clients.length
      }))
    }
  }
}

let wsService: WebSocketService | null = null

export function initWebSocketService(server: Server): WebSocketService {
  if (!wsService) {
    wsService = new WebSocketService(server)
  }
  return wsService
}

export function getWebSocketService(): WebSocketService | null {
  return wsService
}












