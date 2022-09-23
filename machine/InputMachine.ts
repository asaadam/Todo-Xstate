import { createMachine, assign } from 'xstate';

interface CategoriesContext {
  text: string;
  categorie: string;
}

type CategoriesEvent =
  | {
      type: 'TYPING';
      value: string;
    }
  | {
      type: 'TYPING_CATEGORIE';
      value: string;
    }
  | {
      type: 'SELECTING_CATEGORIE';
    };

const inputMachine = createMachine<CategoriesContext, CategoriesEvent>({
  id: 'categoriesSelector',
  initial: 'start',
  context: {
    categorie: '',
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
        TYPING_CATEGORIE: {
          actions: assign({
            categorie: (_, event) => event.value,
          }),
          target: 'categoriesSelected',
        },
      },
    },
    categoriesSelected: {
      on: {
        SELECTING_CATEGORIE: {
          target: 'start',
          actions: assign({ text: (ctx) => ctx.text.replace('@', '') }),
        },
      },
    },
  },
});

export { inputMachine };
