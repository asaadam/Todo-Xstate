import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useSelector } from '@xstate/react';
import { useRef } from 'react';
import { ListHandler } from './ListHandler';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { useCategories } from '../store/categoriesStore';

const LIST_CATEGORIES = [
  'Design',
  'Programming',
  'Marketing',
  'Finance',
  'Support',
  'Sleep',
];

type Props = {
  variant?: 'default' | 'hiddenButton';
};

export function SelectCategories({ variant = 'default' }: Props) {
  const { service } = useCategories();
  const isOpen = useSelector(service, (state) => state.matches('open'));
  const index = useSelector(service, (state) => state.context.index);
  const selected = useSelector(service, (state) => state.context.selected);
  const { send } = service;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ulRef = useRef(null);
  useOnClickOutside(ulRef, () => send('CLOSE'));

  return (
    <VStack w="lg" position="relative">
      {variant === 'default' && (
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
          <Text>{selected || 'Categories'}</Text>
          <ChevronDownIcon />
        </Button>
      )}

      {isOpen && (
        <Box
          width="100%"
          height="150px"
          overflowY="auto"
          zIndex={4}
          backgroundColor="blackAlpha.500"
          position="absolute"
        >
          <ListHandler ref={ulRef} defaultSelectedIndex={index}>
            {LIST_CATEGORIES.map((val, index) => (
              <Box
                onClick={() => {
                  send('SELECTED', {
                    value: { selected: val, index: index },
                  });
                }}
                w="100%"
                p="4"
                key={`${val} ${index}`}
              >
                <Text>{val}</Text>
              </Box>
            ))}
          </ListHandler>
        </Box>
      )}
    </VStack>
  );
}
