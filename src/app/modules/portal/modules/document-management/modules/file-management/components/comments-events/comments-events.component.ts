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
      const selectedDocumentId = localStorage.getItem('selectedDocumentId');

      // Cargar comentarios de archivo
      this.apiService.listCommentsArchive(this.archiveId).subscribe((response) => {
        console.log('Archive Comments Response:', response);
        if (response && response.body) {
          console.log('Comments:', response.body.result.items);
          const filteredComments = response.body.result.items.map((comment: any) => ({
            ...comment,
            username: comment.username || 'Unknown User',
            isOwnComment: comment.username === this.currentUser.username,
            eventType: 'expedientComment',
            dateTime: new Date(comment.ctime)  // Usar directamente ctime
          }));

          this.commentsAndEvents = [...filteredComments];

          // Cargar eventos de archivo
          this.apiService.listEvents('archive', this.archiveId!).subscribe((eventResponse) => {
            console.log('Archive Events Response:', eventResponse);
            if (eventResponse && eventResponse.body && eventResponse.body.result) {
              const events = eventResponse.body.result.map((event: any) => ({
                ...event,
                username: event.username || 'Unknown User',
                description: `Action: ${event.action}, Object: ${event.object}, Object ID: ${event.object_id}`,
                eventType: 'expedientEvent',
                dateTime: new Date(event.timestamp)  // Usar directamente timestamp
              }));
              this.commentsAndEvents.push(...events);

              if (selectedDocumentId) {
                // Cargar comentarios de documento
                this.apiService.listCommentsDocument(Number(selectedDocumentId)).subscribe((docResponse) => {
                  console.log('Document Comments Response:', docResponse);
                  if (docResponse && docResponse.body) {
                    const docComments = docResponse.body.result.items.map((comment: any) => ({
                      ...comment,
                      username: comment.username || 'Unknown User',
                      isOwnComment: comment.username === this.currentUser.username,
                      eventType: 'documentComment',
                      dateTime: new Date(comment.ctime)  // Usar directamente ctime
                    }));
                    this.commentsAndEvents.push(...docComments);
                  }

                  // Cargar eventos de documento
                  this.apiService.listEvents('document', Number(selectedDocumentId)).subscribe((docEventResponse) => {
                    console.log('Document Events Response:', docEventResponse);
                    if (docEventResponse && docEventResponse.body && docEventResponse.body.result) {
                      const docEvents = docEventResponse.body.result.map((event: any) => ({
                        ...event,
                        username: event.username || 'Unknown User',
                        description: `Action: ${event.action}, Object: ${event.object}, Object ID: ${event.object_id}`,
                        eventType: 'documentEvent',
                        dateTime: new Date(event.timestamp)  // Usar directamente timestamp
                      }));
                      this.commentsAndEvents.push(...docEvents);

                      // Ordenar todos los comentarios y eventos por fecha
                      this.commentsAndEvents.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

                      this.applyFilter();
                    }
                  });
                });
              } else {
                // Si solo hay expediente, aplicar el filtro directamente
                this.commentsAndEvents.sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
                this.applyFilter();
              }
            }
          });
        }
      });
    }
  }

  formatRFC3339Date(date: string, time: 'start' | 'end'): string {
    const dateObj = new Date(date);
    if (time === 'start') {
      dateObj.setHours(0, 0, 0, 0);
    } else if (time === 'end') {
      dateObj.setUTCHours(23, 59, 59, 999);
    }
    return dateObj.toISOString();
  }  

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  applyFilter() {
    if (this.selectedFilters.length === 0) {
      this.filteredCommentsAndEvents = [];
    } else {
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
      if (this.archiveId !== null) {
        const targetId = this.commentLevel === 'archive' ? this.archiveId : localStorage.getItem('selectedDocumentId');
        const commentMethod = this.commentLevel === 'archive' ? this.apiService.createCommentArchive : this.apiService.createCommentDocument;
        
        if (targetId) {
          commentMethod.call(this.apiService, Number(targetId), this.newComment).subscribe(() => {
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
