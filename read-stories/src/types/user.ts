export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  joinDate: Date;
  stats: {
    storiesRead: number;
    favoriteCount: number;
    readingTimeHours: number;
    completedStories: number;
  };
  vipStatus: boolean;
}