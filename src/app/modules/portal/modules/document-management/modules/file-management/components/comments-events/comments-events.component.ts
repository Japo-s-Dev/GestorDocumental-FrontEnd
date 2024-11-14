import { Component, OnInit } from '@angular/core';
import { FileManagementService } from '../../services/file-management.service';
import { UserCrudService } from '../../../../../admin/modules/users/services/users-crud.service';

@Component({
  selector: 'app-comments-events',
  templateUrl: './comments-events.component.html',
  styleUrls: ['./comments-events.component.css'],
})
export class CommentsEventsComponent implements OnInit {
  commentsAndEvents: any[] = [];
  filteredCommentsAndEvents: any[] = [];
  newComment: string = '';
  archiveId: number | null = null;
  users: any[] = [];
  currentUser: any = {};
  selectedFilters: string[] = [];
  allFilters = ['expedientComment', 'expedientEvent', 'documentComment', 'documentEvent'];
  isAllSelected = false;
  dropdownOpen = false;
  commentLevel: 'archive' | 'document' = 'archive';  // Controla si es comentario a nivel de expediente o documento
  documentSelected: boolean = false;
  viewComments: boolean = true;
  viewEvents: boolean = true;

  constructor(
    private apiService: FileManagementService,
    private userCrudService: UserCrudService
  ) {}

  ngOnInit(): void {
    const storedExpedientId = localStorage.getItem('selectedExpedientId');
    const storedUserStatus = localStorage.getItem('userStatus');

    if (storedUserStatus) {
      this.currentUser = JSON.parse(storedUserStatus);
    }

    if (storedExpedientId) {
      this.archiveId = Number(localStorage.getItem('selectedExpedientId')) || null;
      this.documentSelected = !!localStorage.getItem('selectedDocumentId');
      this.loadUsers();
    } else {
      console.error('No expedient ID found in localStorage.');
    }
  }

  loadUsers(): void {
    this.userCrudService.listUsers().subscribe(
      (response) => {
        if (response && response.body.result) {
          this.users = response.body.result.items;
          this.loadCommentsAndEvents();
        }
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  loadCommentsAndEvents() {
    this.commentsAndEvents = [];
    const selectedDocumentId = this.commentLevel === 'document' ? localStorage.getItem('selectedDocumentId') : null;

    if (this.commentLevel === 'archive' && this.archiveId !== null) {
      // Cargar comentarios de archivo
      this.apiService.listCommentsArchive(this.archiveId).subscribe(response => {
        const comments = response.body.result.items.map((comment: any) => ({
          ...comment,
          username: this.getUserNameById(comment.user_id),
          isOwnComment: this.getUserNameById(comment.user_id) === this.currentUser.username, // Marcar si es comentario propio
          eventType: 'expedientComment',
          dateTime: new Date(comment.ctime)
        }));
        this.commentsAndEvents.push(...comments);
        this.sortCommentsAndEvents(); // Ordenar después de agregar comentarios
        this.applyFilter(); // Aplicar filtro después de cargar comentarios
      });

      // Cargar eventos de archivo
      this.apiService.listEvents('archive', this.archiveId).subscribe(eventResponse => {
        const events = eventResponse.body.result.map((event: any) => ({
          ...event,
          username: event.username || 'Unknown User',
          isOwnComment: event.username === this.currentUser.username, // Marcar si es evento propio
          eventType: 'expedientEvent',
          dateTime: new Date(event.timestamp)
        }));
        this.commentsAndEvents.push(...events);
        this.sortCommentsAndEvents(); // Ordenar después de agregar eventos
        this.applyFilter(); // Aplicar filtro después de cargar eventos
      });
    }

    if (this.commentLevel === 'document' && selectedDocumentId) {
      // Cargar comentarios de documento
      this.apiService.listCommentsDocument(Number(selectedDocumentId)).subscribe(response => {
        const comments = response.body.result.items.map((comment: any) => ({
          ...comment,
          username: this.getUserNameById(comment.user_id),
          isOwnComment: this.getUserNameById(comment.user_id) === this.currentUser.username, // Marcar si es comentario propio
          eventType: 'documentComment',
          dateTime: new Date(comment.ctime)
        }));
        this.commentsAndEvents.push(...comments);
        this.sortCommentsAndEvents(); // Ordenar después de agregar comentarios
        this.applyFilter(); // Aplicar filtro después de cargar comentarios
      });

      // Cargar eventos de documento
      this.apiService.listEvents('document', Number(selectedDocumentId)).subscribe(eventResponse => {
        const events = eventResponse.body.result.map((event: any) => ({
          ...event,
          username: event.username || 'Unknown User',
          isOwnComment: event.username === this.currentUser.username, // Marcar si es evento propio
          eventType: 'documentEvent',
          dateTime: new Date(event.timestamp)
        }));
        this.commentsAndEvents.push(...events);
        this.sortCommentsAndEvents(); // Ordenar después de agregar eventos
        this.applyFilter(); // Aplicar filtro después de cargar eventos
      });
    }
  }

  getUserNameById(userId: number): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown User';
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleViewOption(option: 'comments' | 'events'): void {
    if (option === 'comments') {
      this.viewComments = !this.viewComments;
    } else {
      this.viewEvents = !this.viewEvents;
    }
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredCommentsAndEvents = this.commentsAndEvents.filter(item => {
      if (item.eventType.includes('Comment') && this.viewComments) return true;
      if (item.eventType.includes('Event') && this.viewEvents) return true;
      return false;
    });
  }

  sortCommentsAndEvents(): void {
    // Ordenar por fecha y hora de manera descendente (del más reciente al más antiguo)
    this.commentsAndEvents.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  }

  setCommentLevel(level: 'archive' | 'document'): void {
    if (level === 'document' && !this.documentSelected) {
      alert('Seleccione un documento para comentar a nivel de documento');
      return;
    }
    this.commentLevel = level;
    this.loadCommentsAndEvents();
  }

  addComment(): void {
    if (this.newComment.trim()) {
        const targetId = this.commentLevel === 'archive' ? this.archiveId : localStorage.getItem('selectedDocumentId');
        
        if (!targetId) {
            alert('Seleccione un documento antes de comentar a nivel de documento');
            return;
        }

        const commentMethod = this.commentLevel === 'archive'
            ? this.apiService.createCommentArchive
            : this.apiService.createCommentDocument;

        commentMethod.call(this.apiService, Number(targetId), this.newComment).subscribe(
            () => {
                // Limpiar el campo de comentario después de enviarlo exitosamente
                this.newComment = '';
                // Recargar los comentarios y eventos
                this.loadCommentsAndEvents();
            },
            (error) => {
                console.error('Error al agregar el comentario:', error);
            }
        );
    }
  }

  toggleFilterSelection(filter: string, event: any) {
    if (event.target.checked) {
      if (!this.selectedFilters.includes(filter)) {
        this.selectedFilters.push(filter);
      }
    } else {
      this.selectedFilters = this.selectedFilters.filter(f => f !== filter);
    }

    this.isAllSelected = this.selectedFilters.length === this.allFilters.length;
    this.applyFilter();
  }
}
