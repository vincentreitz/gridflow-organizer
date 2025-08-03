export interface GridItem {
  id: string;
  title: string;
  order: number;
}

export interface ItemList {
  id: string;
  title: string;
  items: GridItem[];
  order: number;
}

export interface Grid {
  id: string;
  title: string;
  lists: ItemList[];
}

export interface AppData {
  grids: Grid[];
  currentGridId: string | null;
}
