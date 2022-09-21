import { Box, VStack } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useMachine } from '@xstate/react';
import { counterMachine } from './CounterMachine';
import React from 'react';

type Props = {
  children: Array<React.ReactNode>;
};

export function ListHandler({ children }: Props) {
  const [state, send] = useMachine(counterMachine);
  const buttonRef = useRef<HTMLDivElement>(null);

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
        if (key === 'Enter' && state.context.count) {
          if (buttonRef.current?.children[0]) {
            const button = buttonRef.current?.children[0] as HTMLElement | null;
            if (button) {
              button.click();
            }
          }
        }
      }
    };
    window.addEventListener('keydown', downHandlerXstate);
    return () => {
      window.removeEventListener('keydown', downHandlerXstate);
    };
  }, [children, send, state.value, state.context.count, buttonRef]);

  return (
    <VStack w="100%">
      {children.map((data, index) => (
        <Box
          ref={index === state.context.count ? buttonRef : null}
          w="100%"
          onMouseEnter={() => {
            send('SELECTED', { value: index });
          }}
          backgroundColor={
            index === state.context.count ? 'gray.400' : 'gray.200'
          }
          key={index}
        >
          {data}
        </Box>
      ))}
    </VStack>
  );
}
