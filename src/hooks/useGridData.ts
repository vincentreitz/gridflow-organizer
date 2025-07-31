import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { AppData, Grid, ItemList, GridItem } from '@/types';
import { nanoid } from 'nanoid';

const defaultData: AppData = {
  grids: [],
  currentGridId: null,
};

export function useGridData() {
  const [data, setData] = useLocalStorage<AppData>('task-organizer-data', defaultData);

  const currentGrid = data.grids.find(g => g.id === data.currentGridId) || null;

  const createGrid = useCallback((title: string = 'New Grid') => {
    const newGrid: Grid = {
      id: nanoid(),
      title,
      lists: [],
    };

    setData(prev => ({
      grids: [...prev.grids, newGrid],
      currentGridId: newGrid.id,
    }));

    return newGrid.id;
  }, [setData]);

  const selectGrid = useCallback((gridId: string) => {
    setData(prev => ({
      ...prev,
      currentGridId: gridId,
    }));
  }, [setData]);

  const updateGridTitle = useCallback((title: string) => {
    if (!data.currentGridId) return;

    setData(prev => ({
      ...prev,
      grids: prev.grids.map(grid =>
        grid.id === data.currentGridId
          ? { ...grid, title }
          : grid
      ),
    }));
  }, [data.currentGridId, setData]);

  const createList = useCallback((title: string) => {
    if (!data.currentGridId) return;

    const newList: ItemList = {
      id: nanoid(),
      title,
      items: [],
      order: currentGrid?.lists.length || 0,
    };

    setData(prev => ({
      ...prev,
      grids: prev.grids.map(grid =>
        grid.id === data.currentGridId
          ? { ...grid, lists: [...grid.lists, newList] }
          : grid
      ),
    }));
  }, [data.currentGridId, currentGrid?.lists.length, setData]);

  const updateList = useCallback((listId: string, updates: Partial<ItemList>) => {
    if (!data.currentGridId) return;

    setData(prev => ({
      ...prev,
      grids: prev.grids.map(grid =>
        grid.id === data.currentGridId
          ? {
              ...grid,
              lists: grid.lists.map(list =>
                list.id === listId ? { ...list, ...updates } : list
              ),
            }
          : grid
      ),
    }));
  }, [data.currentGridId, setData]);

  const deleteList = useCallback((listId: string) => {
    if (!data.currentGridId) return;

    setData(prev => ({
      ...prev,
      grids: prev.grids.map(grid =>
        grid.id === data.currentGridId
          ? { ...grid, lists: grid.lists.filter(list => list.id !== listId) }
          : grid
      ),
    }));
  }, [data.currentGridId, setData]);

  const addItem = useCallback((listId: string, title: string) => {
    if (!data.currentGridId) return;

    const list = currentGrid?.lists.find(l => l.id === listId);
    if (!list) return;

    const newItem: GridItem = {
      id: nanoid(),
      title,
      order: list.items.length,
    };

    setData(prev => ({
      ...prev,
      grids: prev.grids.map(grid =>
        grid.id === data.currentGridId
          ? {
              ...grid,
              lists: grid.lists.map(l =>
                l.id === listId
                  ? { ...l, items: [...l.items, newItem] }
                  : l
              ),
            }
          : grid
      ),
    }));
  }, [data.currentGridId, currentGrid?.lists, setData]);

  const updateItem = useCallback((listId: string, item: GridItem) => {
    if (!data.currentGridId) return;

    setData(prev => ({
      ...prev,
      grids: prev.grids.map(grid =>
        grid.id === data.currentGridId
          ? {
              ...grid,
              lists: grid.lists.map(list =>
                list.id === listId
                  ? {
                      ...list,
                      items: list.items.map(i =>
                        i.id === item.id ? item : i
                      ),
                    }
                  : list
              ),
            }
          : grid
      ),
    }));
  }, [data.currentGridId, setData]);

  const deleteItem = useCallback((listId: string, itemId: string) => {
    if (!data.currentGridId) return;

    setData(prev => ({
      ...prev,
      grids: prev.grids.map(grid =>
        grid.id === data.currentGridId
          ? {
              ...grid,
              lists: grid.lists.map(list =>
                list.id === listId
                  ? { ...list, items: list.items.filter(item => item.id !== itemId) }
                  : list
              ),
            }
          : grid
      ),
    }));
  }, [data.currentGridId, setData]);

  const reorderLists = useCallback((listIds: string[]) => {
    if (!data.currentGridId) return;

    setData(prev => ({
      ...prev,
      grids: prev.grids.map(grid =>
        grid.id === data.currentGridId
          ? {
              ...grid,
              lists: listIds.map((id, index) => {
                const list = grid.lists.find(l => l.id === id);
                return list ? { ...list, order: index } : list;
              }).filter(Boolean) as ItemList[],
            }
          : grid
      ),
    }));
  }, [data.currentGridId, setData]);

  const reorderItems = useCallback((listId: string, itemIds: string[]) => {
    if (!data.currentGridId) return;

    setData(prev => ({
      ...prev,
      grids: prev.grids.map(grid =>
        grid.id === data.currentGridId
          ? {
              ...grid,
              lists: grid.lists.map(list =>
                list.id === listId
                  ? {
                      ...list,
                      items: itemIds.map((id, index) => {
                        const item = list.items.find(i => i.id === id);
                        return item ? { ...item, order: index } : item;
                      }).filter(Boolean) as GridItem[],
                    }
                  : list
              ),
            }
          : grid
      ),
    }));
  }, [data.currentGridId, setData]);

  return {
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
  };
}