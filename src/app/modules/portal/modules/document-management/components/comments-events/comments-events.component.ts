import { UserCrudService } from '../../../admin/modules/users/services/users-crud.service';
import { ServicesService } from '../../services/services.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments-events',
  templateUrl: './comments-events.component.html',
  styleUrls: ['./comments-events.component.css']
})
export class CommentsEventsComponent implements OnInit {
  commentsAndEvents: any[] = [];
  newComment: string = '';
  archiveId: number | null = null;
  users: any[] = []; // Store the list of users
  currentUser: any = {};

  constructor(
    private servicesService: ServicesService,
    private userCrudService: UserCrudService // Inject the user service
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
          this.users = response.body.result;
          console.log('Users loaded:', this.users);
          this.loadCommentsAndEvents(); // Now that users are loaded, load comments and events
        }
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  loadCommentsAndEvents() {
    if (this.archiveId !== null) {
      this.servicesService.listComments().subscribe((response) => {
        if (response && response.body) {
          const filteredComments = response.body.result.filter(
            (comment: any) => comment.archive_id === this.archiveId
          );

          // Add username and check if it's the current user's comment
          filteredComments.forEach((comment: any) => {
            const user = this.users.find((u) => u.id === comment.user_id);
            comment.username = user ? user.username : 'Unknown User';
            comment.isOwnComment = comment.username === this.currentUser.username;
          });

          this.servicesService.listEvents(this.archiveId!).subscribe(
            (eventResponse) => {
              if (eventResponse && eventResponse.body) {
                const events = eventResponse.body.result.map((event: any) => {
                  const user = this.users.find((u) => u.id === event.user_id);
                  return {
                    ...event,
                    username: user ? user.username : 'Unknown User',
                    description: `Action: ${event.action}, Object: ${event.object}, Object ID: ${event.object_id}`,
                    timestamp: event.timestamp
                  };
                });

                this.commentsAndEvents = [...filteredComments, ...events];

                // Sort by timestamp to maintain chronological order
                this.commentsAndEvents.sort(
                  (a, b) =>
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );
              }
            }
          );
        }
      });
    }
  }

  addComment() {
    if (this.newComment.trim() && this.archiveId !== null) {
      this.servicesService.createComment(this.archiveId, this.newComment).subscribe(response => {
        this.newComment = '';
        this.loadCommentsAndEvents(); // Reload comments and events
      });
    }
  }
}
