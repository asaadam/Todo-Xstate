import { interpret, Interpreter } from 'xstate';
import {
  CategoriesContext,
  CategoriesEvent,
  categoriesMachine,
} from '../machine/CategoriesMachine';
import create from 'zustand';

type Store = {
  service: Interpreter<
    CategoriesContext,
    any,
    CategoriesEvent,
    {
      value: any;
      context: CategoriesContext;
    }
  >;
};

export const useCategories = create<Store>((set: any): Store => {
  const categoriesService = interpret(categoriesMachine)
    .onTransition((state) => {
      const initialStateChanged =
        state.changed === undefined && Object.keys(state.children).length;

      if (state.changed || initialStateChanged) {
        set({ state });
      }
    })
    .start();
  return {
    state: categoriesService.state,
    service: categoriesService,
  } as unknown as Store;
});
