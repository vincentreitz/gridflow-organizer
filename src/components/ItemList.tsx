import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { InlineEdit } from "@/components/ui/inline-edit";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { GridItem, ItemList as ItemListType } from "@/types";
import { ItemCard } from "./ItemCard";

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
  const [newItemTitle, setNewItemTitle] = useState("");

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
      setNewItemTitle("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  return (
    <Card
      ref={setSortableRef}
      style={style}
      className={cn(
        "flex flex-col w-80 min-w-80 max-w-96 h-fit shadow-sm hover:shadow-md transition-all",
        isDragging && "opacity-50",
      )}
    >
      {/* List Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
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
                  Are you sure you want to delete "{list.title || "Untitled List"}"? This action
                  cannot be undone and will remove all items in this list.
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
      </CardHeader>

      <Separator />

      {/* Items */}
      <CardContent className="flex-1 p-4">
        <div ref={setDroppableRef} className="flex flex-col space-y-2">
          <SortableContext
            items={list.items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
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
      </CardContent>

      <Separator />

      {/* Add Item */}
      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Input
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new item..."
            className="flex-1"
          />
          <Button onClick={handleAddItem} size="sm" disabled={!newItemTitle.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
