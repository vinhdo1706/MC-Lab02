export interface TrainingSession {
  id: string;
  title: string;
  day: string;
  durationMinutes: number;
}

export interface FitnessMember {
  id: string;
  username: string;
  fullName: string;
  memberCode: string;
  planName: string;
  sessions: TrainingSession[];
}

export interface DemoAccount {
  username: string;
  password: string;
  profile: FitnessMember;
}
