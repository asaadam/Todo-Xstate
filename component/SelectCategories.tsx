import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { Categories } from './Categories';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { useEffect, useRef } from 'react';

interface CategoriesContext {
  selected?: string;
  index?: number;
}

type CategoriesEvent =
  | { type: 'OPEN' }
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
        OPEN: 'close',
      },
    },
  },
});
export function SelectCategories() {
  const [state, send] = useMachine(categoriesMachine);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleDown = () => {
      buttonRef.current?.blur();
    };
    window.addEventListener('keydown', handleDown);
    return () => {
      window.removeEventListener('keydown', handleDown);
    };
  }, [buttonRef]);

  return (
    <VStack w="lg">
      <Box>
        <Button
          ref={buttonRef}
          onClick={() => {
            send('OPEN');
          }}
        >
          <Text>{state.context.selected || 'Categories'}</Text>
          <ChevronDownIcon />
        </Button>
      </Box>
      <Box width="100%" height="150px" overflowY="auto">
        {state.value === 'open' && (
          <Categories
            defaultSelectedIndex={state.context.index}
            onClick={(val, index) =>
              send('SELECTED', { value: { selected: val, index: index } })
            }
          />
        )}
      </Box>
    </VStack>
  );
}
