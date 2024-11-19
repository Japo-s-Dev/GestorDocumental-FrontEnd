import { UserCrudService } from '../../../../../admin/modules/users/services/users-crud.service';
import { Component, OnInit } from '@angular/core';
import { FileManagementService } from '../../services/file-management.service';

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
  selectedFilters: string[] = ['expedientComment', 'expedientEvent'];
  allFilters = ['expedientComment', 'expedientEvent', 'documentComment', 'documentEvent'];
  isAllSelected = false;
  dropdownOpen = false;

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
      this.apiService.listComments().subscribe((response) => {
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

          this.apiService.listEvents(this.archiveId!).subscribe(
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

                this.commentsAndEvents.sort(
                  (a, b) => a.dateTime.getTime() - b.dateTime.getTime()
                );

                this.applyFilter();
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

  addComment() {
    if (this.newComment.trim() && this.archiveId !== null) {
      this.apiService.createComment(this.archiveId, this.newComment).subscribe(() => {
        this.newComment = '';
        this.loadCommentsAndEvents();
      });
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
