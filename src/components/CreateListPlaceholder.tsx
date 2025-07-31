import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface CreateListPlaceholderProps {
  onCreateList: (title: string) => void;
}

export function CreateListPlaceholder({ onCreateList }: CreateListPlaceholderProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');

  const handleCreate = () => {
    if (title.trim()) {
      onCreateList(title.trim());
      setTitle('');
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      setTitle('');
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <Card className="w-80 min-w-80 max-w-96 p-4 bg-gradient-card border-border/40 shadow-card">
        <div className="space-y-3">
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={() => {
              if (!title.trim()) {
                setIsCreating(false);
              }
            }}
            placeholder="Enter list title..."
            className="bg-background/50"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleCreate}
              size="sm"
              disabled={!title.trim()}
              className="bg-gradient-primary hover:opacity-90 flex-1"
            >
              Create List
            </Button>
            <Button
              onClick={() => {
                setTitle('');
                setIsCreating(false);
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="w-80 min-w-80 max-w-96 h-48 flex items-center justify-center border-2 border-dashed border-border/60 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group"
      onClick={() => setIsCreating(true)}
    >
      <div className="text-center">
        <Plus className="h-8 w-8 mx-auto text-muted-foreground group-hover:text-foreground transition-colors mb-2" />
        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          Add new list
        </p>
      </div>
    </Card>
  );
}