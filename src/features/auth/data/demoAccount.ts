import type { DemoAccount } from '../types';

// Local demo account for this lab only; not a production authentication method.
export const DEMO_ACCOUNT: DemoAccount = {
  username: 'fitmember01',
  password: '123456',
  profile: {
    id: 'member-01',
    username: 'fitmember01',
    fullName: 'Nguyen Minh Anh',
    memberCode: 'FIT-2408',
    planName: 'Premium Monthly',
    sessions: [
      { id: 'TR-01', title: 'Strength Basics', day: 'Monday · 18:00', durationMinutes: 50 },
      { id: 'TR-02', title: 'Cardio Interval', day: 'Wednesday · 17:30', durationMinutes: 40 },
      { id: 'TR-03', title: 'Mobility & Stretch', day: 'Saturday · 08:00', durationMinutes: 45 },
    ],
  },
};
