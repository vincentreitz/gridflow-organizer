import { Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InlineEdit } from '@/components/ui/inline-edit';
import { GridItem } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface ItemCardProps {
  item: GridItem;
  onUpdate: (item: GridItem) => void;
  onDelete: (id: string) => void;
}

export function ItemCard({ item, onUpdate, onDelete }: ItemCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleUpdate = (title: string) => {
    onUpdate({ ...item, title });
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative shadow-sm hover:shadow-md transition-all",
        isDragging && "opacity-50"
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="text-muted-foreground hover:text-foreground transition-colors mt-1 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          
          <div className="flex-1 min-w-0">
            <InlineEdit
              value={item.title}
              onSave={handleTitleUpdate}
              placeholder="Enter item title..."
              className="w-full"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}