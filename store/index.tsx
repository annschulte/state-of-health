// store.ts
import { create } from "zustand";

interface NeedState {
  needs: Need[];
  addNeed: (newNeed: Need | any) => void;
  setNeeds: (needs: Need[] | any) => void;
  voteStatuses: Record<string, "green" | "yellow" | "red">;
  setVoteStatusForNeed: (
    needId: string,
    voteStatus: "green" | "yellow" | "red"
  ) => void;
}

export const useStore = create<NeedState>((set: any) => ({
  needs: [],
  setNeeds: (needs: Need[]) => set({ needs }),
  addNeed: (newNeed: Need) =>
    set((state: any) => ({ needs: [...state.needs, newNeed] })),
  voteStatuses: {},
  setVoteStatusForNeed: (needId, voteStatus) =>
    set((state: any) => ({
      voteStatuses: { ...state.voteStatuses, [needId]: voteStatus },
    })),
}));

interface PublicNeedState {
  publicNeeds: Need[];
  setPublicNeeds: (publicNeeds: Need[]) => void;
}

export const usePublicNeedsStore = create<PublicNeedState>((set: any) => ({
  publicNeeds: [],
  setPublicNeeds: (publicNeeds: Need[]) => set({ publicNeeds }),
}));
