import { assign, createMachine } from 'xstate';

export interface CategoriesContext {
  selected?: string;
  index?: number;
}

export type CategoriesEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SELECTED'; value: { selected: string; index: number } };

const categoriesMachine = createMachine<CategoriesContext, CategoriesEvent>({
  id: 'categoriesSelector',
  initial: 'close',
  context: {
    selected: '',
    index: undefined,
  },
  states: {
    close: {
      on: {
        OPEN: 'open',
        SELECTED: {
          actions: assign({
            selected: (_, event) => event.value.selected,
            index: (_, event) => event.value.index,
          }),
          target: 'close',
        },
      },
    },
    open: {
      on: {
        SELECTED: {
          actions: assign({
            selected: (_, event) => event.value.selected,
            index: (_, event) => event.value.index,
          }),
          target: 'close',
        },
        CLOSE: {
          target: 'close',
        },
      },
    },
  },
});

export { categoriesMachine };
