import { MoreVertical, Edit, Trash2, ExternalLink, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getBlockTypeInfo, formatDate } from '@/utils/helpers';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function CowBlockCard({ block, onEdit, onDelete, onDuplicate }) {
  const blockType = getBlockTypeInfo(block.type);
  const language = block.data?.language || 'pt-BR';

  return (
    <Card className="group hover:border-primary/50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-2xl">
              {blockType.icon}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{block.blockName}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {blockType.label}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {block.isActive === false && (
              <div className="flex items-center justify-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium whitespace-nowrap">
                Inativo
              </div>
            )}
            <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[180px] bg-background border border-border rounded-lg p-1 shadow-lg z-50"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-accent outline-none"
                  onSelect={() => onEdit(block)}
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-accent outline-none"
                  onSelect={() => onDuplicate(block)}
                >
                  <Copy className="h-4 w-4" />
                  Duplicar
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-border my-1" />
                <DropdownMenu.Item
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-destructive/10 text-destructive outline-none"
                  onSelect={() => onDelete(block)}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-muted-foreground">Idioma:</span>
            <span className="text-foreground">{language}</span>
          </div>

          {block.createdAt && (
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-muted-foreground">Criado:</span>
              <span className="text-foreground">{formatDate(block.createdAt)}</span>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground line-clamp-2">
            {blockType.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
