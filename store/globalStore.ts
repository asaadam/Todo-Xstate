import create from 'zustand';

export type Task = {
  isDone: boolean;
  categories: string;
  title: string;
};

type GlobalStore = {
  categories: Array<string>;
  suggestedTittle: Array<string>;
  task: Array<Task>;
  addCategory: (category: string) => void;
  addTitle: (title: string) => void;
  addTask: (task: Task) => void;
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  categories: [
    'Design',
    'Programming',
    'Marketing',
    'Finance',
    'Support',
    'Sleep',
  ],
  suggestedTittle: [],
  task: [],
  addCategory: (category) =>
    set((v) => ({ ...v, categories: [...v.categories, category] })),
  addTitle: (title) =>
    set((v) => ({ ...v, suggestedTittle: [...v.suggestedTittle, title] })),
  addTask: (task) => set((v) => ({ ...v, task: [...v.task, task] })),
}));
