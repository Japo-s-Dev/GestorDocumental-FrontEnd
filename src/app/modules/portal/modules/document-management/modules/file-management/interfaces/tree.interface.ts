export interface FileNode {
  id?: number;
  name: string;
  type: string;
  url?: string;
  children?: FileNode[];
}

export interface FlatNode {
  id?: number;
  expandable: boolean;
  name: string;
  level: number;
  type: string;
  url?: string;
}
