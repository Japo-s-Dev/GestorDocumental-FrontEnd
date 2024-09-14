import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
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
  type: string;
}

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent {
  @ViewChild('treeContainer') treeContainer!: ElementRef;
  isExpanded = false;
  originalParent: HTMLElement | null = null; // Variable para almacenar el contenedor original

  private transformer = (node: FileNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      type: node.type,
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

  constructor(private renderer: Renderer2) {
    const TREE_DATA: FileNode[] = [
      {
        name: 'Carpeta Padre1',
        type: 'folder',
        children: [
          { name: 'Document1.pdf', type: 'pdf' },
          { name: 'Image1.jpg', type: 'image' },
          {
            name: 'Sub Folder 1',
            type: 'folder',
            children: [
              { name: 'Presentation.pptx', type: 'presentation' },
              { name: 'Spreadsheet.xlsx', type: 'spreadsheet' },
              {
                name: 'Sub Folder 2',
                type: 'folder',
                children: [
                  { name: 'TextFile.txt', type: 'text' },
                  { name: 'Document2.docx', type: 'document' },
                  { name: 'Image2.png', type: 'image' },
                  { name: 'Archive.zip', type: 'archive' }
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'Carpeta Padre 2',
        type: 'folder',
        children: [
          { name: 'Music.mp3', type: 'audio' },
          { name: 'Video.mp4', type: 'video' },
          { name: 'Script.js', type: 'code' },
          { name: 'Stylesheet.css', type: 'code' }
        ],
      },
      {
        name: 'Carpeta Padre 3',
        type: 'folder',
        children: [
          { name: 'Presentation.pptx', type: 'presentation' }
        ],
      },
    ];

    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  getIcon(node: FlatNode) {
    switch (node.type) {
      case 'folder':
        return 'folder';
      case 'pdf':
        return 'picture_as_pdf';
      case 'image':
        return 'image';
      case 'presentation':
        return 'slideshow';
      case 'spreadsheet':
        return 'table_chart';
      case 'text':
        return 'description';
      case 'document':
        return 'article';
      case 'archive':
        return 'archive';
      case 'audio':
        return 'audiotrack';
      case 'video':
        return 'videocam';
      case 'code':
        return 'code';
      default:
        return 'insert_drive_file';
    }
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      // Guardar el contenedor original antes de moverlo
      this.originalParent = this.treeContainer.nativeElement.parentElement;
      // Mover al final del body
      this.renderer.appendChild(document.body, this.treeContainer.nativeElement);
    } else {
      // Regresar al contenedor original si existe
      if (this.originalParent) {
        this.renderer.appendChild(this.originalParent, this.treeContainer.nativeElement);
      }
    }
  }
}
