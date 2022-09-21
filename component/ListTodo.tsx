import { Box, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { counterMachine } from './CounterMachine';

type Props = {
  children: Array<React.ReactNode>;
};

export function ListContainer({ children }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [state, send] = useMachine(counterMachine);

  useEffect(() => {
    const downHandlerXstate = ({ key }: KeyboardEvent) => {
      if (state.value === 'notSelected') {
        send('SELECTED', { value: 0 });
      } else if (state.value === 'active') {
        if (
          key === 'ArrowDown' &&
          state.context.count! <= children.length - 2
        ) {
          send('INCREMENT');
        }
        if (key === 'ArrowUp' && state.context.count! > 0) {
          send('DECREMENT');
        }
      }
    };
    window.addEventListener('keydown', downHandlerXstate);
    return () => {
      window.removeEventListener('keydown', downHandlerXstate);
    };
  }, [
    selectedIndex,
    setSelectedIndex,
    children,
    send,
    state.value,
    state.context.count,
  ]);

  return (
    <VStack>
      <VStack w="100%">
        {children.map((data, index) => (
          <Box
            onMouseEnter={() => {
              setSelectedIndex(index);
              send('SELECTED', { value: index });
            }}
            backgroundColor={
              index === state.context.count ? 'ActiveBorder' : 'ActiveCaption'
            }
            color={
              index === state.context.count ? 'ActiveCaption' : 'ActiveBorder'
            }
            key={index}
          >
            {data}
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
