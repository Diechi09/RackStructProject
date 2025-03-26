export interface ClothingItem {
  id: string;
  name: string;
  type: string;
  color: string;
  location: string;
  size?: string;
}

export interface Rack {
  id: string;
  name: string;
  items: ClothingItem[];
  highlighted?: boolean;
  selected?: boolean;
}