import { assign, createMachine } from 'xstate';

export interface CategoriesContext {
  selected?: string;
  index?: number;
  categories: Array<string>;
}

export type CategoriesEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SELECTED'; value: { selected: string; index: number } }
  | {
      type: 'FILTER_CATEGORY';
      value: Array<string>;
    }
  | {
      type: 'SET_CATEGORY';
      value: Array<string>;
    };

const categoriesMachine = createMachine<CategoriesContext, CategoriesEvent>({
  predictableActionArguments: true,
  id: 'categoriesSelector',
  initial: 'close',
  context: {
    categories: [],
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
        SET_CATEGORY: {
          actions: assign({
            categories: (_, event) => event.value,
          }),
        },
        FILTER_CATEGORY: {
          actions: assign({
            categories: (_, event) => event.value,
          }),
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
        FILTER_CATEGORY: {
          actions: assign({
            categories: (_, event) => event.value,
          }),
        },
        CLOSE: {
          target: 'close',
        },
      },
    },
  },
});

export { categoriesMachine };
