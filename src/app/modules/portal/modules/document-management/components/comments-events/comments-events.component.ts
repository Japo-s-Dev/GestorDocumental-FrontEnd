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

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    const storedExpedientId = localStorage.getItem('selectedExpedientId');
    if (storedExpedientId) {
      this.archiveId = Number(storedExpedientId);
      this.loadCommentsAndEvents();
    } else {
      console.error('No expedient ID found in localStorage.');
    }
  }

  loadCommentsAndEvents() {
    if (this.archiveId !== null) {
      this.servicesService.listComments().subscribe(response => {
        if (response && response.body) {
          const filteredComments = response.body.result.filter((comment: any) => comment.archive_id === this.archiveId);
  
          this.servicesService.listEvents(this.archiveId!).subscribe(eventResponse => {
            if (eventResponse && eventResponse.body) {
              const events = eventResponse.body.result.map((event: any) => {
                return {
                  ...event,
                  description: `Action: ${event.action}, Object: ${event.object}, Object ID: ${event.object_id}`,
                  timestamp: event.timestamp
                };
              });
  
              this.commentsAndEvents = [...filteredComments, ...events];
  
              // Sort by timestamp to maintain chronological order
              this.commentsAndEvents.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            }
          });
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
