import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { useRef } from 'react';
import { ListHandler } from './ListHandler';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

const LIST_CATEGORIES = ['Design', 'Programming', 'Marketing', 'Finance'];

interface CategoriesContext {
  selected?: string;
  index?: number;
}

type CategoriesEvent =
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
      },
    },
  },
});

export function SelectCategories() {
  const [state, send] = useMachine(categoriesMachine);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ulRef = useRef(null);
  useOnClickOutside(ulRef, () => send('OPEN'));

  return (
    <VStack w="lg">
      <Button
        onKeyDown={(e) => {
          if (e.keyCode === 40) {
            const ulEl = ulRef.current as unknown as HTMLElement;
            if (ulEl) {
              const liEl = ulEl.children[0] as HTMLElement;
              if (liEl) {
                liEl.focus();
              }
            }
          }
        }}
        ref={buttonRef}
        onClick={() => {
          send('OPEN');
        }}
      >
        <Text>{state.context.selected || 'Categories'}</Text>
        <ChevronDownIcon />
      </Button>
      <Box width="100%" height="150px" overflowY="auto">
        {state.value === 'open' && (
          <ListHandler ref={ulRef} defaultSelectedIndex={state.context.index}>
            {LIST_CATEGORIES.map((val, index) => (
              <Box
                onClick={() => {
                  send('SELECTED', { value: { selected: val, index: index } });
                }}
                w="100%"
                p="4"
                key={`${val} ${index}`}
              >
                <Text>{val}</Text>
              </Box>
            ))}
          </ListHandler>
        )}
      </Box>
    </VStack>
  );
}
