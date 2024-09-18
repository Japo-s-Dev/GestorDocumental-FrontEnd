import { Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

interface FileNode {
  name: string;
  type: string;
  url?: string; // Hacemos la URL opcional
  children?: FileNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  type: string;
  url?: string; // Hacemos la URL opcional también aquí
}

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent {
  @ViewChild('treeContainer') treeContainer!: ElementRef;
  @Output() fileSelected = new EventEmitter<{ url: string, name: string }>(); // Emitir nombre también
  isExpanded = false;
  originalParent: HTMLElement | null = null;

  private transformer = (node: FileNode, level: number): FlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      type: node.type,
      url: node.url, // Asigna la URL si está presente, puede ser undefined
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<FileNode, FlatNode>(
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
          { name: 'Tarea Japo.pdf', type: 'pdf', url: 'https://documents-evogd.s3.amazonaws.com/54ed0070-82d3-40fd-b352-b272ff78b2c7' },
          { name: 'Imagen Japo.jpg', type: 'image', url: 'https://documents-evogd.s3.amazonaws.com/screenshot123_26082024_232602.jpg' },
        ],
      },
      {
        name: 'Carpeta Padre 2',
        type: 'folder',
        children: [
          { name: 'Music.mp3', type: 'audio', url: 'https://example.com/video.mp4' },
          { name: 'Reporte.xlms', type: 'file', url: 'https://documents-evogd.s3.amazonaws.com/Reporte.xls' },
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
      case 'audio':
        return 'audiotrack';
      case 'video':
        return 'videocam';
      default:
        return 'insert_drive_file';
    }
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      this.originalParent = this.treeContainer.nativeElement.parentElement;
      this.renderer.appendChild(document.body, this.treeContainer.nativeElement);
    } else {
      if (this.originalParent) {
        this.renderer.appendChild(this.originalParent, this.treeContainer.nativeElement);
      }
    }
  }

  selectFile(node: FlatNode) {
    if (node.type !== 'folder' && node.url) {
      // Emitir tanto la URL como el nombre del archivo
      this.fileSelected.emit({ url: node.url, name: node.name });
    }
  }
}
