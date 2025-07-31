import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineEdit } from '@/components/ui/inline-edit';
import { ItemCard } from './ItemCard';
import { ItemList as ItemListType, GridItem } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ItemListProps {
  list: ItemListType;
  onUpdate: (list: ItemListType) => void;
  onDelete: (id: string) => void;
  onItemAdd: (listId: string, title: string) => void;
  onItemUpdate: (listId: string, item: GridItem) => void;
  onItemDelete: (listId: string, itemId: string) => void;
}

export function ItemList({
  list,
  onUpdate,
  onDelete,
  onItemAdd,
  onItemUpdate,
  onItemDelete,
}: ItemListProps) {
  const [newItemTitle, setNewItemTitle] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.id });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `list-${list.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleUpdate = (title: string) => {
    onUpdate({ ...list, title });
  };

  const handleAddItem = () => {
    if (newItemTitle.trim()) {
      onItemAdd(list.id, newItemTitle.trim());
      setNewItemTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div
      ref={setSortableRef}
      style={style}
      className={`flex flex-col w-80 min-w-80 max-w-96 bg-gradient-card rounded-xl border border-border/40 shadow-card hover:shadow-elevated transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {/* List Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            {...attributes}
            {...listeners}
            className="text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          
          <InlineEdit
            value={list.title}
            onSave={handleTitleUpdate}
            variant="subtitle"
            placeholder="Untitled List"
            className="flex-1 min-w-0"
          />
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete List</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{list.title || 'Untitled List'}"? 
                This action cannot be undone and will remove all items in this list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(list.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Items */}
      <div
        ref={setDroppableRef}
        className="flex-1 p-4 min-h-[200px] max-h-[600px] overflow-y-auto"
      >
        <div className="flex flex-col space-y-2">
          <SortableContext items={list.items.map(item => item.id)} strategy={verticalListSortingStrategy}>
            {list.items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onUpdate={(updatedItem) => onItemUpdate(list.id, updatedItem)}
                onDelete={(itemId) => onItemDelete(list.id, itemId)}
              />
            ))}
          </SortableContext>
        </div>
      </div>

      {/* Add Item */}
      <div className="p-4 border-t border-border/30">
        <div className="flex gap-2">
          <Input
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new item..."
            className="flex-1 bg-background/50"
          />
          <Button
            onClick={handleAddItem}
            size="sm"
            disabled={!newItemTitle.trim()}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}