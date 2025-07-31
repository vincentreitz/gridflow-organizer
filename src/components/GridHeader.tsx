import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InlineEdit } from '@/components/ui/inline-edit';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Grid } from '@/types';

interface GridHeaderProps {
  currentGrid: Grid | null;
  grids: Grid[];
  onGridSelect: (gridId: string) => void;
  onGridCreate: () => void;
  onGridTitleUpdate: (title: string) => void;
}

export function GridHeader({
  currentGrid,
  grids,
  onGridSelect,
  onGridCreate,
  onGridTitleUpdate,
}: GridHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-border/40 bg-gradient-card">
      <div className="flex-1" />
      
      <div className="flex-1 flex justify-center">
        {currentGrid && (
          <InlineEdit
            value={currentGrid.title}
            onSave={onGridTitleUpdate}
            variant="title"
            placeholder="Untitled Grid"
            className="text-center"
          />
        )}
      </div>

      <div className="flex-1 flex justify-end items-center gap-2">
        <Button
          onClick={onGridCreate}
          size="sm"
          variant="secondary"
          className="gap-2 shadow-card"
        >
          <Plus className="h-4 w-4" />
          New Grid
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 shadow-card">
              <span className="max-w-32 truncate">
                {currentGrid?.title || 'Select Grid'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {grids.map((grid) => (
              <DropdownMenuItem
                key={grid.id}
                onClick={() => onGridSelect(grid.id)}
                className={grid.id === currentGrid?.id ? 'bg-accent' : ''}
              >
                <span className="truncate">{grid.title || 'Untitled Grid'}</span>
              </DropdownMenuItem>
            ))}
            {grids.length === 0 && (
              <DropdownMenuItem disabled>
                No grids available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}