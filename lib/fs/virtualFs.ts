import { FileNode, Workspace } from '@/lib/types'

export class VirtualFileSystem {
  private static readonly STORAGE_KEY = 'synexa-workspaces'
  
  static getWorkspaces(): Workspace[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load workspaces:', error)
      return []
    }
  }
  
  static saveWorkspaces(workspaces: Workspace[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workspaces))
    } catch (error) {
      console.error('Failed to save workspaces:', error)
    }
  }
  
  static createDefaultWorkspace(): Workspace {
    return {
      id: 'default',
      name: 'My Project',
      files: {
        'README.md': `# My Project

Welcome to your new project! This is a sample workspace where you can:

- Write and edit code with AI assistance
- Create new files and folders
- Get AI-powered suggestions and patches

## Getting Started

1. Edit files in the Monaco editor
2. Use the AI panel to request changes
3. Apply patches to update your code

Happy coding! 🚀`,
        'src/index.ts': `// Main entry point
export function main() {
  console.log('Hello, World!')
  
  // TODO: Add your application logic here
}

// Run the main function
if (require.main === module) {
  main()
}`,
        'src/utils.ts': `// Utility functions
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}`,
        'package.json': `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A sample TypeScript project",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node": "^10.0.0",
    "@types/node": "^20.0.0"
  }
}`
      },
      activeFile: 'src/index.ts'
    }
  }
  
  static getWorkspace(id: string): Workspace | null {
    const workspaces = this.getWorkspaces()
    return workspaces.find(w => w.id === id) || null
  }
  
  static saveWorkspace(workspace: Workspace): void {
    const workspaces = this.getWorkspaces()
    const index = workspaces.findIndex(w => w.id === workspace.id)
    
    if (index >= 0) {
      workspaces[index] = workspace
    } else {
      workspaces.push(workspace)
    }
    
    this.saveWorkspaces(workspaces)
  }
  
  static deleteWorkspace(id: string): void {
    const workspaces = this.getWorkspaces()
    const filtered = workspaces.filter(w => w.id !== id)
    this.saveWorkspaces(filtered)
  }
  
  static buildFileTree(files: Record<string, string>): FileNode[] {
    const tree: FileNode[] = []
    const pathMap = new Map<string, FileNode>()
    
    // Sort paths to ensure parent directories come before children
    const sortedPaths = Object.keys(files).sort()
    
    for (const path of sortedPaths) {
      const parts = path.split('/')
      let currentPath = ''
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const parentPath = currentPath
        currentPath = currentPath ? `${currentPath}/${part}` : part
        
        if (!pathMap.has(currentPath)) {
          const isFile = i === parts.length - 1
          const node: FileNode = {
            id: currentPath,
            name: part,
            type: isFile ? 'file' : 'folder',
            path: currentPath,
            content: isFile ? files[path] : undefined,
            children: isFile ? undefined : [],
            isExpanded: true
          }
          
          pathMap.set(currentPath, node)
          
          if (parentPath) {
            const parent = pathMap.get(parentPath)
            if (parent && parent.children) {
              parent.children.push(node)
            }
          } else {
            tree.push(node)
          }
        }
      }
    }
    
    return tree
  }
  
  static getFileContent(workspace: Workspace, path: string): string {
    return workspace.files[path] || ''
  }
  
  static updateFileContent(workspace: Workspace, path: string, content: string): Workspace {
    return {
      ...workspace,
      files: {
        ...workspace.files,
        [path]: content
      }
    }
  }
  
  static createFile(workspace: Workspace, path: string, content: string = ''): Workspace {
    return this.updateFileContent(workspace, path, content)
  }
  
  static deleteFile(workspace: Workspace, path: string): Workspace {
    const newFiles = { ...workspace.files }
    delete newFiles[path]
    
    return {
      ...workspace,
      files: newFiles,
      activeFile: workspace.activeFile === path ? undefined : workspace.activeFile
    }
  }
  
  static renameFile(workspace: Workspace, oldPath: string, newPath: string): Workspace {
    const newFiles = { ...workspace.files }
    
    if (newFiles[oldPath] !== undefined) {
      newFiles[newPath] = newFiles[oldPath]
      delete newFiles[oldPath]
    }
    
    return {
      ...workspace,
      files: newFiles,
      activeFile: workspace.activeFile === oldPath ? newPath : workspace.activeFile
    }
  }
}
