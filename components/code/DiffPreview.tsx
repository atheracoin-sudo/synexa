'use client'

import { memo, useMemo } from 'react'
import { CodePatch } from '@/lib/types'
import { File, Plus, Minus, Edit, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge, Card } from '@/components/ui'

interface DiffPreviewProps {
  patch: CodePatch
}

function DiffPreview({ patch }: DiffPreviewProps) {
  const stats = useMemo(() => {
    const operations = patch?.operations || []
    const writes = operations.filter(op => op.op === 'write').length
    const deletes = operations.filter(op => op.op === 'delete').length
    const renames = operations.filter(op => op.op === 'rename').length
    const total = operations.length
    const hasDestructive = deletes > 0
    
    return { writes, deletes, renames, total, hasDestructive }
  }, [patch?.operations])

  const getOperationIcon = (op: string) => {
    switch (op) {
      case 'write':
        return <Edit className="h-4 w-4" />
      case 'delete':
        return <Minus className="h-4 w-4" />
      case 'rename':
        return <Edit className="h-4 w-4" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const getOperationLabel = (op: string) => {
    switch (op) {
      case 'write':
        return 'Düzenle/Oluştur'
      case 'delete':
        return 'Sil'
      case 'rename':
        return 'Yeniden Adlandır'
      default:
        return 'Bilinmeyen'
    }
  }

  const getOperationStyles = (op: string) => {
    switch (op) {
      case 'write':
        return {
          border: 'border-blue-500/30',
          bg: 'bg-blue-500/5',
          icon: 'text-blue-500',
          badge: 'default' as const,
        }
      case 'delete':
        return {
          border: 'border-destructive/30',
          bg: 'bg-destructive/5',
          icon: 'text-destructive',
          badge: 'destructive' as const,
        }
      case 'rename':
        return {
          border: 'border-yellow-500/30',
          bg: 'bg-yellow-500/5',
          icon: 'text-yellow-500',
          badge: 'warning' as const,
        }
      default:
        return {
          border: 'border-border',
          bg: 'bg-secondary/50',
          icon: 'text-muted-foreground',
          badge: 'default' as const,
        }
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Stats Summary */}
      <div className="flex items-center flex-wrap gap-2">
        <Badge variant="default" >
          {stats.total} değişiklik
        </Badge>
        {stats.writes > 0 && (
          <Badge variant="default" >
            <Plus className="h-3 w-3 mr-1" />
            {stats.writes} yazma
          </Badge>
        )}
        {stats.deletes > 0 && (
          <Badge variant="destructive" >
            <Minus className="h-3 w-3 mr-1" />
            {stats.deletes} silme
          </Badge>
        )}
        {stats.renames > 0 && (
          <Badge variant="warning" >
            <Edit className="h-3 w-3 mr-1" />
            {stats.renames} yeniden adlandırma
          </Badge>
        )}
      </div>

      {/* Risk Warning */}
      {stats.hasDestructive && (
        <Card variant="outline" padding="sm" className="border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <p className="text-xs font-medium">
              Bu işlem {stats.deletes} dosyayı silecek. Dikkatli olun!
            </p>
          </div>
        </Card>
      )}

      {/* Operations List */}
      {(patch?.operations || []).map((operation, index) => {
        const styles = getOperationStyles(operation.op)
        
        return (
          <Card
            key={index}
            variant="outline"
            padding="md"
            className={cn(styles.border, styles.bg)}
          >
            {/* Operation Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("p-1.5 rounded-md bg-background/50", styles.icon)}>
                {getOperationIcon(operation.op)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant={styles.badge} >
                    {getOperationLabel(operation.op)}
                  </Badge>
                </div>
                <code className="text-xs text-muted-foreground mt-1 block truncate">
                  {operation.path}
                </code>
              </div>
            </div>

            {/* Rename Arrow */}
            {operation.op === 'rename' && operation.newPath && (
              <div className="text-sm text-muted-foreground mb-3 pl-9">
                <span className="font-mono text-xs">
                  → {operation.newPath}
                </span>
              </div>
            )}

            {/* Code Preview */}
            {operation.op === 'write' && operation.content && (
              <div className="bg-background/80 rounded-lg border border-border/50 overflow-hidden">
                <div className="px-3 py-1.5 border-b border-border/50 bg-secondary/30">
                  <span className="text-xs text-muted-foreground">Önizleme</span>
                </div>
                <pre className="p-3 text-xs overflow-x-auto max-h-48 scrollbar-thin">
                  <code className="text-foreground">{operation.content}</code>
                </pre>
              </div>
            )}

            {/* Delete Message */}
            {operation.op === 'delete' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground pl-9">
                <Minus className="h-3.5 w-3.5 text-destructive" />
                <span>Bu dosya kalıcı olarak silinecek</span>
              </div>
            )}
          </Card>
        )
      })}

      {/* Empty State */}
      {(patch?.operations || []).length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          <File className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Değişiklik bulunamadı</p>
        </div>
      )}
    </div>
  )
}

export default memo(DiffPreview)
