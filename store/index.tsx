// store.ts
import { create } from "zustand";

export interface Activity {
  id: string;
  item: string;
  date: string;
  user_id: string;
}

interface ActivityState {
  activities: Activity[];
  setActivities: (activities: Activity[] | any) => void;
  addActivity: (activity: Activity) => void;
}

export const useActivitiesStore = create<ActivityState>((set: any) => ({
  activities: [],
  setActivities: (activities: Activity[]) => set({ activities }),
  addActivity: (activity: Activity) =>
    set((state: any) => ({ activities: [activity, ...state.activities] })),
}));
