import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { GridHeader } from '@/components/GridHeader';
import { ItemList } from '@/components/ItemList';
import { CreateListPlaceholder } from '@/components/CreateListPlaceholder';
import { useGridStore } from '@/store/useGridStore';
import { useState } from 'react';
import { ItemList as ItemListType } from '@/types';
import { cn } from '@/lib/utils';

function IndexPage() {
  const {
    grids,
    currentGridId,
    createGrid,
    deleteGrid,
    selectGrid,
    updateGridTitle,
    createList,
    updateList,
    deleteList,
    addItem,
    updateItem,
    deleteItem,
    reorderLists,
    reorderItems,
  } = useGridStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDraggedItem, setActiveDraggedItem] = useState<ItemListType | null>(null);

  const currentGrid = grids.find(g => g.id === currentGridId) || null;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Create first grid if none exists
  useEffect(() => {
    if (grids.length === 0) {
      createGrid('My Task Board');
    }
  }, [grids.length, createGrid]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    
    // Store the dragged item for overlay
    if (currentGrid) {
      const draggedList = currentGrid.lists.find(list => list.id === event.active.id);
      if (draggedList) {
        setActiveDraggedItem(draggedList);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Handle moving items between lists
    if (activeId.startsWith('item-') && overId.startsWith('list-')) {
      const sourceListId = activeId.split('-')[1];
      const targetListId = overId.split('-')[1];
      
      if (sourceListId !== targetListId && currentGrid) {
        // Move item to different list logic would go here
        // For now, we'll handle this in drag end
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !currentGrid) {
      setActiveId(null);
      setActiveDraggedItem(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Reorder lists
    if (currentGrid.lists.some(list => list.id === activeId) && 
        currentGrid.lists.some(list => list.id === overId)) {
      
      const oldIndex = currentGrid.lists.findIndex(list => list.id === activeId);
      const newIndex = currentGrid.lists.findIndex(list => list.id === overId);

      if (oldIndex !== newIndex) {
        const newOrder = [...currentGrid.lists];
        const [removed] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, removed);
        reorderLists(newOrder.map(list => list.id));
      }
    }

    // Reorder items within the same list
    const activeList = currentGrid.lists.find(list => 
      list.items.some(item => item.id === activeId)
    );
    const overList = currentGrid.lists.find(list => 
      list.items.some(item => item.id === overId)
    );

    if (activeList && overList && activeList.id === overList.id) {
      const oldIndex = activeList.items.findIndex(item => item.id === activeId);
      const newIndex = activeList.items.findIndex(item => item.id === overId);

      if (oldIndex !== newIndex) {
        const newOrder = [...activeList.items];
        const [removed] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, removed);
        reorderItems(activeList.id, newOrder.map(item => item.id));
      }
    }

    setActiveId(null);
    setActiveDraggedItem(null);
  };

  if (!currentGrid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center max-w-md">
          <CardHeader>
            <CardTitle>No Grid Selected</CardTitle>
            <CardDescription>
              Create your first grid to get started organizing your tasks.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <GridHeader
        currentGrid={currentGrid}
        grids={grids}
        onGridSelect={selectGrid}
        onGridCreate={() => createGrid()}
        onGridTitleUpdate={updateGridTitle}
        onGridDelete={deleteGrid}
      />

      <div className="p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <ScrollArea className="w-full">
            <div className="flex gap-6 pb-6">
              <SortableContext
                items={currentGrid.lists.map(list => list.id)}
                strategy={horizontalListSortingStrategy}
              >
                {currentGrid.lists.map((list) => (
                  <ItemList
                    key={list.id}
                    list={list}
                    onUpdate={(updatedList) => updateList(list.id, updatedList)}
                    onDelete={deleteList}
                    onItemAdd={addItem}
                    onItemUpdate={updateItem}
                    onItemDelete={deleteItem}
                  />
                ))}
              </SortableContext>

              <CreateListPlaceholder onCreateList={createList} />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <DragOverlay>
            {activeId && activeDraggedItem ? (
              <div className="transform rotate-2 opacity-90">
                <ItemList
                  list={activeDraggedItem}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  onItemAdd={() => {}}
                  onItemUpdate={() => {}}
                  onItemDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/')({
  component: IndexPage,
});