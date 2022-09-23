import { createMachine, assign } from 'xstate';

interface CategoriesContext {
  text: string;
  category: string;
}

type CategoriesEvent =
  | {
      type: 'TYPING';
      value: string;
    }
  | {
      type: 'TYPING_CATEGORY';
      value: string;
    }
  | {
      type: 'SELECTING_CATEGORY';
    };

const inputMachine = createMachine<CategoriesContext, CategoriesEvent>({
  id: 'categoriesSelector',
  initial: 'start',
  context: {
    category: '',
    text: '',
  },
  states: {
    start: {
      on: {
        TYPING: {
          actions: assign({
            text: (_, event) => event.value,
          }),
        },
        TYPING_CATEGORY: {
          target: 'categoriesSelected',
        },
      },
    },
    categoriesSelected: {
      on: {
        TYPING: {
          actions: assign({
            text: (_, event) => event.value,
          }),
          target: 'start',
        },
        TYPING_CATEGORY: {
          actions: assign({
            category: (_, event) => event.value,
          }),
        },
        SELECTING_CATEGORY: {
          target: 'start',
          actions: assign({ text: (ctx) => ctx.text.replace('@', '') }),
        },
      },
    },
  },
});

export { inputMachine };
