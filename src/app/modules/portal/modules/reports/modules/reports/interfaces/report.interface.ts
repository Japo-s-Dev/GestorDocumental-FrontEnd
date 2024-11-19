export interface EventData {
    action: string;
    object: string;
    object_id: number;
    old_data: any;
    new_data: any;
    timestamp: string;
    username?: string;
  }
  