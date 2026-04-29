import { create } from 'zustand';

export type StorylineIntro = {
  label: string;
  heading: string;
};

type StorylineIntroStore = {
  current: StorylineIntro | null;
  show: (intro: StorylineIntro) => void;
  clear: () => void;
};

export const useStorylineIntroStore = create<StorylineIntroStore>((set) => ({
  current: null,
  show: (intro) => set({ current: intro }),
  clear: () => set({ current: null }),
}));
