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
        name: 'Caso 2002',
        type: 'folder',
        children: [
          {
            name: 'Documentos del caso',
            type: 'folder',
            children: [
              {
                name: 'Demanda',
                type: 'folder',
                children: [
                  { name: 'Modelo de Demanda.doc', type: 'doc', url: 'https://documents-evogd.s3.amazonaws.com/Modelo+de+Demanda.doc' },
                  { name: 'Entidad Judicial.pdf', type: 'pdf', url: 'https://documents-evogd.s3.amazonaws.com/Entidad+Judicial.pdf' },
                  { name: 'Datps Judiciales.docx', type: 'docx', url: 'https://documents-evogd.s3.amazonaws.com/Judicial.docx' },
                ]
              },
              { name: 'personas registradas.csv', type: 'csv', url: 'https://documents-evogd.s3.amazonaws.com/personas+registradas.csv' },
            ]
          },
          {
            name: 'Datos del Demandante',
            type: 'folder',
            children: [
              { name: 'DPI Gabriel Paz.pdf', type: 'pdf', url: 'https://documents-evogd.s3.amazonaws.com/DPI.pdf' },
              { name: 'Datos Gabriel', type: 'docx', url: 'https://documents-evogd.s3.amazonaws.com/Gabriel+Paz.txt' },
              { name: 'Abogado.jpg', type: 'image', url: 'https://documents-evogd.s3.amazonaws.com/Abogado.jpg' }
            ]
          }
        ]
      }
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
