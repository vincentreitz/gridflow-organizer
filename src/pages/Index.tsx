import { useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
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

import { GridHeader } from '@/components/GridHeader';
import { ItemList } from '@/components/ItemList';
import { CreateListPlaceholder } from '@/components/CreateListPlaceholder';
import { useGridData } from '@/hooks/useGridData';
import { useState } from 'react';
import { ItemList as ItemListType } from '@/types';

const Index = () => {
  const {
    data,
    currentGrid,
    createGrid,
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
  } = useGridData();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDraggedItem, setActiveDraggedItem] = useState<ItemListType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Create first grid if none exists
  useEffect(() => {
    if (data.grids.length === 0) {
      createGrid('My Task Board');
    }
  }, [data.grids.length, createGrid]);

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
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Grid Selected</h1>
          <p className="text-muted-foreground">Create your first grid to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <GridHeader
        currentGrid={currentGrid}
        grids={data.grids}
        onGridSelect={selectGrid}
        onGridCreate={() => createGrid()}
        onGridTitleUpdate={updateGridTitle}
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
          <div className="flex gap-6 overflow-x-auto pb-6">
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
};

export default Index;
