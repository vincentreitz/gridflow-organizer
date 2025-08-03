import { ChevronDown, Plus } from "lucide-react";
import { BoardTitleWithDelete } from "@/components/BoardTitleWithDelete";
import { SimpleThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Grid } from "@/types";

interface GridHeaderProps {
  currentGrid: Grid | null;
  grids: Grid[];
  onGridSelect: (gridId: string) => void;
  onGridCreate: () => void;
  onGridTitleUpdate: (title: string) => void;
  onGridDelete: (gridId: string) => void;
}

export function GridHeader({
  currentGrid,
  grids,
  onGridSelect,
  onGridCreate,
  onGridTitleUpdate,
  onGridDelete,
}: GridHeaderProps) {
  return (
    <Card className="flex items-center justify-between p-6 shadow-md">
      <div className="flex-1" />

      <div className="flex-1 flex justify-center">
        {currentGrid && (
          <BoardTitleWithDelete
            currentGrid={currentGrid}
            onGridTitleUpdate={onGridTitleUpdate}
            onGridDelete={onGridDelete}
            grids={grids}
            className="text-center"
          />
        )}
      </div>

      <div className="flex-1 flex justify-end items-center gap-2">
        <SimpleThemeToggle />

        <Button onClick={onGridCreate} size="sm" variant="secondary" className="gap-2 shadow-card">
          <Plus className="h-4 w-4" />
          New Grid
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 shadow-card">
              <span className="max-w-32 truncate">{currentGrid?.title || "Select Grid"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {grids.map((grid) => (
              <DropdownMenuItem
                key={grid.id}
                onClick={() => onGridSelect(grid.id)}
                className={grid.id === currentGrid?.id ? "bg-accent" : ""}
              >
                <span className="truncate">{grid.title || "Untitled Grid"}</span>
              </DropdownMenuItem>
            ))}
            {grids.length === 0 && <DropdownMenuItem disabled>No grids available</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
