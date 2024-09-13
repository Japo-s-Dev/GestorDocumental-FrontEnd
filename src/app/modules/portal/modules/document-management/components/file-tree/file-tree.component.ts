import { Component } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

interface FileNode {
  name: string;
  type: string;
  children?: FileNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent {
  private transformer = (node: FileNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    const TREE_DATA: FileNode[] = [
      {
        name: 'Root Folder',
        type: 'folder',
        children: [
          { name: 'File 1.txt', type: 'file' },
          { name: 'File 2.txt', type: 'file' },
          {
            name: 'Sub Folder',
            type: 'folder',
            children: [
              { name: 'File 3.txt', type: 'file' },
              { name: 'File 4.txt', type: 'file' },
            ],
          },
        ],
      },
    ];

    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;
}
