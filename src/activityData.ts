export type FiducaroActivity = {
  id: string;
  type: 'Private Send' | 'Full Decrypt' | 'Partial Decrypt';
  status: 'Complete' | 'Pending';
  amount?: string;
  destination: string;
  transactionHash: string;
  date: string;
  stage?: string;
};

// Shared preview source for the Activity page and activity-based Bridge estimates.
export const fiducaroActivities: FiducaroActivity[] = [];

export const countActiveUsers = (activities: FiducaroActivity[]) =>
  new Set(activities.map(({ destination }) => destination.toLowerCase())).size;
