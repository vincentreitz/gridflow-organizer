import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { InlineEdit } from "@/components/ui/inline-edit";
import { cn } from "@/lib/utils";
import type { Grid } from "@/types";

interface BoardTitleWithDeleteProps {
  currentGrid: Grid;
  onGridTitleUpdate: (title: string) => void;
  onGridDelete: (gridId: string) => void;
  grids: Grid[];
  className?: string;
}

export function BoardTitleWithDelete({
  currentGrid,
  onGridTitleUpdate,
  onGridDelete,
  grids,
  className,
}: BoardTitleWithDeleteProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300); // 300ms delay before hiding
  };

  const handleDelete = () => {
    onGridDelete(currentGrid.id);
    setIsOpen(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Don't show delete button if it's the only grid
  const canDelete = grids.length > 1;

  return (
    <fieldset
      className={cn("relative flex items-center justify-center group border-none p-0", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <InlineEdit
        value={currentGrid.title}
        onSave={onGridTitleUpdate}
        variant="title"
        placeholder="Untitled Grid"
        className="text-center"
      />

      {canDelete && (
        <>
          {/* Extended hover area to bridge the gap between title and button */}
          <div className="absolute inset-y-0 right-0 w-8 -mr-2" />

          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={cn(
                  "absolute -right-6 h-6 w-6 p-0 text-muted-foreground hover:text-destructive transition-all duration-200 z-10",
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95",
                )}
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Delete board</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Board</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{currentGrid.title}"? This action cannot be
                  undone. All lists and items in this board will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Board
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </fieldset>
  );
}
