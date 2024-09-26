import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ServicesService } from '../../services/services.service';
import { FileNode, FlatNode } from '../../interfaces/tree.interface';

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent implements OnInit {
  @ViewChild('treeContainer') treeContainer!: ElementRef;
  @Output() fileSelected = new EventEmitter<{ url: string, name: string }>(); // Emitir nombre también
  isExpanded = false;
  originalParent: HTMLElement | null = null;

  // Declaramos primero el transformer
  private transformer = (node: FileNode, level: number): FlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      type: node.type,
      url: node.url, // Asigna la URL si está presente, puede ser undefined
    };
  };

  // Luego el treeControl y treeFlattener
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener<FileNode, FlatNode>(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  idExpediente: number = 1;

  constructor(private renderer: Renderer2, private service: ServicesService) {}

  ngOnInit(): void {
    this.loadFileTree(this.idExpediente);
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  mapTreeData(node: any): FileNode {
    const children = node.children?.map((child: any) => this.mapTreeData(child)) || [];
    const documents = node.documents?.map((doc: any) => ({
      name: doc.name,
      type: doc.doc_type.split('/').pop(), // Extraemos el tipo de archivo (ej. 'pdf', 'docx')
      url: doc.url,
      children: [] // Los documentos no tienen hijos, pero necesitamos mantener la estructura
    })) || [];

    return {
      name: node.name,
      type: 'folder', // Los nodos con hijos son carpetas
      children: [...children, ...documents] // Incluimos tanto subcarpetas como documentos
    };
  }

  loadFileTree(expedientId: number) {
    this.service.getFileTree(expedientId).subscribe(response => {
      const treeData = response.body.result; // Asegúrate de que 'result' tenga la estructura del árbol
      const mappedTreeData = this.mapTreeData(treeData); // Mapeamos la estructura del backend
      this.dataSource.data = [mappedTreeData]; // Asignamos el árbol mapeado a la dataSource
      console.log('Árbol de archivos cargado:', mappedTreeData);
    }, error => {
      console.error('Error al cargar el árbol de archivos:', error);
    });
  }

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
