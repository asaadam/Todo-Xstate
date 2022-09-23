import { createMachine, assign } from 'xstate';

interface CounterContext {
  count?: number;
}

type CounterEvent =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SELECTED'; value: number };

const counterMachine = createMachine<CounterContext, CounterEvent>({
  id: 'counterMachine',
  initial: 'notSelected',
  context: { count: undefined },
  states: {
    active: {
      on: {
        INCREMENT: {
          actions: assign({ count: (ctx) => ctx.count! + 1 }),
          cond: (context) => context.count !== undefined,
        },
        DECREMENT: {
          actions: assign({ count: (ctx) => ctx.count! - 1 }),
          cond: (context) => context.count !== undefined,
        },
        SELECTED: {
          actions: assign({
            count: (_, event) => event.value,
          }),
          cond: (context) => context.count !== undefined,
        },
      },
    },
    notSelected: {
      on: {
        SELECTED: {
          target: 'active',
          actions: assign({
            count: (_, event) => event.value,
          }),
        },
      },
    },
  },
});

export { counterMachine };
