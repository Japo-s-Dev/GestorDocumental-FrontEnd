export interface FileNode {
  name: string;
  type: string;
  url?: string; // Hacemos la URL opcional
  children?: FileNode[];
}

export interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  type: string;
  url?: string; // Hacemos la URL opcional también aquí
}
