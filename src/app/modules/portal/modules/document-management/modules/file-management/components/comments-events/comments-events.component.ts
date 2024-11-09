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
      this.archiveId = Number(storedExpedientId);
      this.loadUsers();
    } else {
      console.error('No expedient ID found in localStorage.');
    }
  }

  loadUsers(): void {
    this.userCrudService.listUsers().subscribe(
      (response) => {
        console.log('Users loaded:', response);
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
    if (this.archiveId !== null) {
      this.apiService.listCommentsArchive(this.archiveId).subscribe((response) => {
        if (response && response.body) {
          const filteredComments = response.body.result.items.filter(
            (comment: any) => comment.archive_id === this.archiveId
          );
  
          filteredComments.forEach((comment: any) => {
            const user = this.users.find((u) => u.id === comment.user_id);
            comment.username = user ? user.username : 'Unknown User';
            comment.isOwnComment = comment.username === this.currentUser.username;
            comment.eventType = 'expedientComment';
            comment.dateTime = new Date(comment.ctime);
          });
  
          // Cargar eventos de archivo
          this.apiService.listEventsArchive(this.archiveId!).subscribe(
            (eventResponse) => {
              if (eventResponse && eventResponse.body) {
                const events = eventResponse.body.result.items.map((event: any) => {
                  const user = this.users.find((u) => u.id === event.user_id);
                  return {
                    ...event,
                    username: user ? user.username : 'Unknown User',
                    description: `Action: ${event.action}, Object: ${event.object}, Object ID: ${event.object_id}`,
                    timestamp: event.timestamp,
                    eventType: 'expedientEvent',
                    dateTime: new Date(event.timestamp),
                  };
                });
  
                this.commentsAndEvents = [...filteredComments, ...events];
  
                // Cargar comentarios y eventos a nivel de documento si el nivel es 'document'
                if (this.commentLevel === 'document') {
                  const selectedDocumentId = localStorage.getItem('selectedDocumentId');
                  if (selectedDocumentId) {
                    this.apiService.listCommentsDocument(Number(selectedDocumentId)).subscribe((docResponse) => {
                      console.log('Document Comments Response:', docResponse); // Log para depuración
                      const docComments = docResponse.body.result.filter(
                        (comment: any) => comment.document_id === Number(selectedDocumentId)
                      );
  
                      docComments.forEach((comment: any) => {
                        const user = this.users.find((u) => u.id === comment.user_id);
                        comment.username = user ? user.username : 'Unknown User';
                        comment.isOwnComment = comment.username === this.currentUser.username;
                        comment.eventType = 'documentComment';
                        comment.dateTime = new Date(comment.ctime);
                      });
  
                      this.commentsAndEvents.push(...docComments);
  
                      // Cargar eventos de documento
                      this.apiService.listEventsDocument(Number(selectedDocumentId)).subscribe(
                        (docEventResponse) => {
                          const docEvents = docEventResponse.body.result.map((event: any) => {
                            const user = this.users.find((u) => u.id === event.user_id);
                            return {
                              ...event,
                              username: user ? user.username : 'Unknown User',
                              description: `Action: ${event.action}, Object: ${event.object}, Object ID: ${event.object_id}`,
                              timestamp: event.timestamp,
                              eventType: 'documentEvent',
                              dateTime: new Date(event.timestamp),
                            };
                          });
  
                          this.commentsAndEvents.push(...docEvents);
  
                          // Ordenar todos los comentarios y eventos por fecha
                          this.commentsAndEvents.sort(
                            (a, b) => a.dateTime.getTime() - b.dateTime.getTime()
                          );
  
                          this.applyFilter();
                        }
                      );
                    });
                  }
                } else {
                  // Si estamos en el nivel de archivo, aplicar el filtro directamente
                  this.applyFilter();
                }
              }
            }
          );
        }
      });
    }
  }
  

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  applyFilter() {
    if (this.selectedFilters.length === 0) {
      this.filteredCommentsAndEvents = [];
    } else {
      console.log('Filtered Comments and Events:', this.filteredCommentsAndEvents);
      this.filteredCommentsAndEvents = this.commentsAndEvents.filter((item) =>
        this.selectedFilters.includes(item.eventType)
      );
    }
  
    this.isAllSelected = this.selectedFilters.length === this.allFilters.length;
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectedFilters = [...this.allFilters];
    } else {
      this.selectedFilters = [];
    }
    this.applyFilter();
  }

  // Cambia el nivel de comentario entre expediente y documento
  setCommentLevel(level: 'archive' | 'document') {
    this.commentLevel = level;
    console.log('Comment level:', this.commentLevel);
  }

  addComment() {
    if (this.newComment.trim()) {
      if (this.commentLevel === 'archive' && this.archiveId !== null) {
        // Comentario a nivel de expediente
        this.apiService.createCommentArchive(this.archiveId, this.newComment).subscribe(() => {
          this.newComment = '';
          this.loadCommentsAndEvents();
        });
      } else if (this.commentLevel === 'document' && this.archiveId !== null) {
        // Comentario a nivel de documento
        const selectedDocumentId = localStorage.getItem('selectedDocumentId');
        console.log('Selected document ID:', selectedDocumentId); // Verifica el ID del documento
        if (selectedDocumentId) {
          this.apiService.createCommentDocument(Number(selectedDocumentId), this.newComment).subscribe(() => {
            this.newComment = '';
            this.loadCommentsAndEvents();
          });
        }
      }
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
