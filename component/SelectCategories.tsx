import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { Categories } from './Categories';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';
import { useEffect, useRef } from 'react';

interface CategoriesContext {
  selected?: string;
}

type CategoriesEvent = { type: 'OPEN' } | { type: 'SELECTED'; value: string };

const categoriesMachine = createMachine<CategoriesContext, CategoriesEvent>({
  id: 'categoriesSelector',
  initial: 'close',
  context: {
    selected: '',
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
            selected: (_, event) => event.value,
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
      {state.value === 'open' && (
        <Categories onClick={(val) => send('SELECTED', { value: val })} />
      )}
    </VStack>
  );
}
