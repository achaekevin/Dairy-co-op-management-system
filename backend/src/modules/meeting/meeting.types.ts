export interface CreateMeetingData {
  meetingNumber: string;
  title: string;
  meetingType: 'BOARD' | 'GENERAL' | 'COMMITTEE' | 'SPECIAL' | 'AGM';
  date: Date;
  time: string;
  venue: string;
  agenda: string;
  conductedBy: string;
}

export interface UpdateMeetingData {
  title?: string;
  meetingType?: 'BOARD' | 'GENERAL' | 'COMMITTEE' | 'SPECIAL' | 'AGM';
  date?: Date;
  time?: string;
  venue?: string;
  agenda?: string;
  conductedBy?: string;
  totalAttendees?: number;
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
  minutes?: string;
  decisions?: string;
}

export interface MeetingFilters {
  meetingType?: 'BOARD' | 'GENERAL' | 'COMMITTEE' | 'SPECIAL' | 'AGM';
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface MeetingStats {
  totalMeetings: number;
  scheduledMeetings: number;
  completedMeetings: number;
  cancelledMeetings: number;
  postponedMeetings: number;
}
