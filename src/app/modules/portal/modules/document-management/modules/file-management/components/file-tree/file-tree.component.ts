import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ServicesService } from '../../../../services/services.service';
import { FileNode, FlatNode } from '../../interfaces/tree.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FolderModalComponent } from '../folder-modal/folder-modal.component';
import { ConfirmModalComponent } from '../../../../../../../../shared/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../../../../../../../../services/loader.service';

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent implements OnInit {
  @ViewChild('treeContainer') treeContainer!: ElementRef;
  @ViewChild('contextMenu') contextMenu!: ElementRef;
  @Output() fileSelected = new EventEmitter<{ url: string, name: string }>();
  isExpanded = false;
  originalParent: HTMLElement | null = null;
  selectedNode: FlatNode | null = null;
  selectedOptionsButton: HTMLElement | null = null;

  private transformer = (node: FileNode, level: number): FlatNode => {
    return {
      expandable: node.type === 'folder',
      name: node.name,
      level: level,
      type: node.type,
      url: node.url,
      id: node.id
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener<FileNode, FlatNode>(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children || []
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  idExpediente: number = 1;

  constructor(
    private renderer: Renderer2,
    private service: ServicesService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    const storedExpedientId = localStorage.getItem('selectedExpedientId');
    if (storedExpedientId) {
      this.idExpediente = Number(storedExpedientId);
    }
    this.loadFileTree(this.idExpediente);
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  mapTreeData(node: any): FileNode {
    const children = node.children?.map((child: any) => this.mapTreeData(child)) || [];
    const documents = node.documents?.map((doc: any) => ({
      name: doc.name,
      type: doc.doc_type.split('/').pop(),
      url: doc.url,
      children: []
    })) || [];

    return {
      name: node.name,
      type: node.type,
      id: node.id,
      children: [...children, ...documents]
    };
  }

  loadFileTree(expedientId: number) {
    this.loaderService.showLoader();
    this.service.getFileTree(expedientId).subscribe(response => {
      const treeData = response.body.result;
      const mappedTreeData = this.mapTreeData(treeData);
      this.dataSource.data = [mappedTreeData];
      setTimeout(() => {
        this.loaderService.hideLoader();
      }, 1000);
    }, error => {
      console.error('Error al cargar el árbol de archivos:', error);
      this.loaderService.hideLoader();
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

  selectFile(node: FlatNode) {
    if (node.type !== 'folder' && node.url) {
      this.fileSelected.emit({ url: node.url, name: node.name });
    }
  }

  onOptionsClick(event: MouseEvent, node: FlatNode) {
    event.preventDefault();
    this.selectedNode = node;
    const button = event.currentTarget as HTMLElement;
    const contextMenu = this.contextMenu.nativeElement;

    if (contextMenu.style.display === 'block' && this.selectedOptionsButton === button) {
      this.closeContextMenu();
    } else {
      if (this.selectedOptionsButton) {
        this.selectedOptionsButton.classList.remove('active');
      }

      button.classList.add('active');
      this.selectedOptionsButton = button;
      const rect = button.getBoundingClientRect();
      contextMenu.style.display = 'block';
      contextMenu.style.left = `${rect.left}px`;
      contextMenu.style.top = `${rect.bottom}px`;
    }
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      this.originalParent = this.treeContainer.nativeElement.parentElement;
      this.renderer.appendChild(document.body, this.treeContainer.nativeElement);
      const contextMenu = this.contextMenu.nativeElement;
      this.renderer.appendChild(document.body, contextMenu);
    } else {
      if (this.originalParent) {
        this.renderer.appendChild(this.originalParent, this.treeContainer.nativeElement);
        this.renderer.appendChild(this.treeContainer.nativeElement.parentElement, this.contextMenu.nativeElement);
      }
    }
  }

  closeContextMenu() {
    const contextMenu = this.contextMenu.nativeElement;
    contextMenu.style.display = 'none';
    if (this.selectedOptionsButton) {
      this.selectedOptionsButton.classList.remove('active');
      this.selectedOptionsButton = null;
    }
  }

  deleteFolder() {
    this.closeContextMenu();
    if (!this.selectedNode) return;

    const separatorId = this.selectedNode.id;
    const folderName = this.selectedNode.name;
    const modalRef = this.modalService.open(ConfirmModalComponent);

    this.translate.get('¿Está seguro de querer eliminar el separador?', { folderName }).subscribe((translatedText: string) => {
      modalRef.componentInstance.message = translatedText;
    });

    modalRef.result.then((result) => {
      if (result === 'confirm' && separatorId) {
        this.loaderService.showLoader();
        this.service.deleteSeparator(separatorId).subscribe(response => {
          this.loadFileTree(this.idExpediente);
          setTimeout(() => {
            this.loaderService.hideLoader();
          }, 1000);
        }, error => {
          console.error('Error al eliminar el separador:', error);
          this.loaderService.hideLoader();
        });
      }
    }).catch((error) => {
      console.log('Modal cerrado sin confirmar', error);
    });
  }

  createFolder() {
    const modalRef = this.modalService.open(FolderModalComponent);
    modalRef.componentInstance.isEditMode = false;

    modalRef.result.then((folderName) => {
      if (folderName) {
        const resolvedParentId = this.selectedNode?.id ?? null;
        this.loaderService.showLoader();
        this.service.createSeparator(folderName, resolvedParentId, this.idExpediente).subscribe(response => {
          this.loadFileTree(this.idExpediente);
          setTimeout(() => {
            this.loaderService.hideLoader();
          }, 1000);
        }, error => {
          console.error('Error al crear el separador:', error);
          this.loaderService.hideLoader();
        });
      }
    }).catch((error) => {
      console.log('Modal dismissed', error);
    });
  }

  renameFolder() {
    this.closeContextMenu();
    if (!this.selectedNode) return;

    const separatorId = this.selectedNode.id;
    const currentFolderName = this.selectedNode.name;
    const modalRef = this.modalService.open(FolderModalComponent);
    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.data = { folderName: currentFolderName };

    modalRef.result.then((newFolderName) => {
      if (newFolderName && separatorId) {
        this.loaderService.showLoader();
        this.service.updateSeparator(separatorId, newFolderName).subscribe(response => {
          this.loadFileTree(this.idExpediente);
          setTimeout(() => {
            this.loaderService.hideLoader();
          }, 1000);
        }, error => {
          console.error('Error al renombrar el separador:', error);
          this.loaderService.hideLoader();
        });
      }
    }).catch((error) => {
      console.log('Modal cerrado sin cambios', error);
    });
  }

  createFile() {
    this.closeContextMenu();
    console.log('Crear archivo');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.contextMenu.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeContextMenu();
    }
  }
}
