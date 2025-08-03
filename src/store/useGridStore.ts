import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppData, Grid, GridItem, ItemList } from "@/types";

interface GridStore extends AppData {
  // Actions
  createGrid: (title?: string) => string;
  deleteGrid: (gridId: string) => void;
  selectGrid: (gridId: string) => void;
  updateGridTitle: (title: string) => void;
  createList: (title: string) => void;
  updateList: (listId: string, updates: Partial<ItemList>) => void;
  deleteList: (listId: string) => void;
  addItem: (listId: string, title: string) => void;
  updateItem: (listId: string, item: GridItem) => void;
  deleteItem: (listId: string, itemId: string) => void;
  reorderLists: (listIds: string[]) => void;
  reorderItems: (listId: string, itemIds: string[]) => void;
}

export const useGridStore = create<GridStore>()(
  persist(
    (set, get) => ({
      grids: [],
      currentGridId: null,

      createGrid: (title = "New Grid") => {
        const newGrid: Grid = {
          id: nanoid(),
          title,
          lists: [],
        };

        set((state) => ({
          grids: [...state.grids, newGrid],
          currentGridId: newGrid.id,
        }));

        return newGrid.id;
      },

      deleteGrid: (gridId: string) => {
        const { grids, currentGridId } = get();

        // Remove the grid
        const newGrids = grids.filter((grid) => grid.id !== gridId);

        // If we're deleting the current grid, select another one or set to null
        let newCurrentGridId = currentGridId;
        if (currentGridId === gridId) {
          newCurrentGridId = newGrids.length > 0 ? newGrids[0].id : null;
        }

        set({
          grids: newGrids,
          currentGridId: newCurrentGridId,
        });
      },

      selectGrid: (gridId: string) => {
        set({ currentGridId: gridId });
      },

      updateGridTitle: (title: string) => {
        const { currentGridId } = get();
        if (!currentGridId) return;

        set((state) => ({
          grids: state.grids.map((grid) => (grid.id === currentGridId ? { ...grid, title } : grid)),
        }));
      },

      createList: (title: string) => {
        const { currentGridId, grids } = get();
        if (!currentGridId) return;

        const currentGrid = grids.find((g) => g.id === currentGridId);
        const newList: ItemList = {
          id: nanoid(),
          title,
          items: [],
          order: currentGrid?.lists.length || 0,
        };

        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === currentGridId ? { ...grid, lists: [...grid.lists, newList] } : grid,
          ),
        }));
      },

      updateList: (listId: string, updates: Partial<ItemList>) => {
        const { currentGridId } = get();
        if (!currentGridId) return;

        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === currentGridId
              ? {
                  ...grid,
                  lists: grid.lists.map((list) =>
                    list.id === listId ? { ...list, ...updates } : list,
                  ),
                }
              : grid,
          ),
        }));
      },

      deleteList: (listId: string) => {
        const { currentGridId } = get();
        if (!currentGridId) return;

        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === currentGridId
              ? { ...grid, lists: grid.lists.filter((list) => list.id !== listId) }
              : grid,
          ),
        }));
      },

      addItem: (listId: string, title: string) => {
        const { currentGridId, grids } = get();
        if (!currentGridId) return;

        const currentGrid = grids.find((g) => g.id === currentGridId);
        const list = currentGrid?.lists.find((l) => l.id === listId);
        if (!list) return;

        const newItem: GridItem = {
          id: nanoid(),
          title,
          order: list.items.length,
        };

        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === currentGridId
              ? {
                  ...grid,
                  lists: grid.lists.map((l) =>
                    l.id === listId ? { ...l, items: [...l.items, newItem] } : l,
                  ),
                }
              : grid,
          ),
        }));
      },

      updateItem: (listId: string, item: GridItem) => {
        const { currentGridId } = get();
        if (!currentGridId) return;

        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === currentGridId
              ? {
                  ...grid,
                  lists: grid.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          items: list.items.map((i) => (i.id === item.id ? item : i)),
                        }
                      : list,
                  ),
                }
              : grid,
          ),
        }));
      },

      deleteItem: (listId: string, itemId: string) => {
        const { currentGridId } = get();
        if (!currentGridId) return;

        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === currentGridId
              ? {
                  ...grid,
                  lists: grid.lists.map((list) =>
                    list.id === listId
                      ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
                      : list,
                  ),
                }
              : grid,
          ),
        }));
      },

      reorderLists: (listIds: string[]) => {
        const { currentGridId } = get();
        if (!currentGridId) return;

        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === currentGridId
              ? {
                  ...grid,
                  lists: listIds
                    .map((id, index) => {
                      const list = grid.lists.find((l) => l.id === id);
                      return list ? { ...list, order: index } : list;
                    })
                    .filter(Boolean) as ItemList[],
                }
              : grid,
          ),
        }));
      },

      reorderItems: (listId: string, itemIds: string[]) => {
        const { currentGridId } = get();
        if (!currentGridId) return;

        set((state) => ({
          grids: state.grids.map((grid) =>
            grid.id === currentGridId
              ? {
                  ...grid,
                  lists: grid.lists.map((list) =>
                    list.id === listId
                      ? {
                          ...list,
                          items: itemIds
                            .map((id, index) => {
                              const item = list.items.find((i) => i.id === id);
                              return item ? { ...item, order: index } : item;
                            })
                            .filter(Boolean) as GridItem[],
                        }
                      : list,
                  ),
                }
              : grid,
          ),
        }));
      },
    }),
    {
      name: "task-organizer-store",
      version: 1,
    },
  ),
);
