import { ServicesService } from '../../services/services.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments-events',
  templateUrl: './comments-events.component.html',
  styleUrl: './comments-events.component.css'
})
export class CommentsEventsComponent implements OnInit {
  comments: any[] = [];
  newComment: string = '';
  archiveId: number | null = null; // Nullable archiveId

  constructor(private servicesService: ServicesService) {}

  ngOnInit(): void {
    // Retrieve the selected expedient ID from localStorage
    const storedExpedientId = localStorage.getItem('selectedExpedientId');
    if (storedExpedientId) {
      this.archiveId = Number(storedExpedientId);
      this.loadComments();
    } else {
      console.error('No expedient ID found in localStorage.');
    }
  }

  loadComments() {
    if (this.archiveId !== null) {
      this.servicesService.listComments().subscribe(response => {
        if (response && response.body) {
          this.comments = response.body.result; // Adapt this if your API response format differs
        }
      });
    }
  }

  addComment() {
    if (this.newComment.trim() && this.archiveId !== null) {
      this.servicesService.createComment(this.archiveId, this.newComment).subscribe(response => {
        this.newComment = '';
        this.loadComments();
      });
    }
  }
}
