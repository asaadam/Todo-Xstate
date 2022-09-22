import { Box, List, ListItem, VStack } from '@chakra-ui/react';
import { KeyboardEventHandler, useEffect, useRef } from 'react';
import { useMachine } from '@xstate/react';
import { counterMachine } from './CounterMachine';
import React from 'react';
import { send } from 'xstate';

type Props = {
  children: Array<React.ReactNode>;
  defaultSelectedIndex?: number;
};

export function ListHandler({ children, defaultSelectedIndex }: Props) {
  const ulRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (ulRef.current && defaultSelectedIndex !== undefined) {
      const target = ulRef.current.childNodes[
        defaultSelectedIndex
      ] as HTMLElement;
      target.focus();
    }
  }, [defaultSelectedIndex, ulRef]);

  return (
    <VStack w="100%" alignItems="flex-start">
      <List ref={ulRef} pt="2" w="100%">
        {children.map((data, index) => (
          <ListItem
            cursor="pointer"
            onMouseEnter={(e) => {
              e.currentTarget.focus();
            }}
            tabIndex={index}
            _hover={{ backgroundColor: 'gray.400' }}
            _focus={{ backgroundColor: 'gray.400' }}
            key={index}
            onKeyDown={(e) => {
              const eventTarget = e.target as HTMLInputElement;
              if (e.keyCode === 40) {
                const next = eventTarget.nextSibling as HTMLElement;
                if (!next) return;
                next.focus();
              } else if (e.keyCode === 38) {
                const prev = eventTarget.previousSibling as HTMLElement;
                if (prev) {
                  prev.focus();
                }
              } else if (e.keyCode === 13) {
                const children = e.currentTarget.childNodes[0] as HTMLElement;
                children.click();
              }
            }}
          >
            {data}
          </ListItem>
        ))}
      </List>
    </VStack>
  );
}
