import { Box, HStack, Text, Tooltip } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useMachine, useSelector } from '@xstate/react';
import { useEffect, useRef } from 'react';
import { useCategories } from '../store/categoriesStore';
import { inputMachine } from '../machine/InputMachine';
import { ListHandler } from './ListHandler';
import { QuestionIcon } from '@chakra-ui/icons';
import { useGlobalStore } from '../store/globalStore';

export function CustomInput() {
  const { categories } = useGlobalStore();
  const [stateInput, sendInput] = useMachine(inputMachine);
  const { service } = useCategories();
  const { send } = service;
  const inputRef = useRef(null);
  const ulRef = useRef(null);

  useEffect(() => {
    if (stateInput.context.text.includes('@')) {
      sendInput('TYPING_CATEGORIE', { value: '' });
    }
  }, [stateInput.context.text, sendInput]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Box>
        <HStack>
          <Input
            value={stateInput.context.text}
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
            ref={inputRef}
            onChange={(e) => {
              sendInput('TYPING', { value: e.target.value });
            }}
          />
          <Tooltip
            label="Try type @, and you can choose category"
            fontSize="md"
          >
            <QuestionIcon />
          </Tooltip>
        </HStack>
        {stateInput.value === 'categoriesSelected' && (
          <ListHandler ref={ulRef}>
            {categories.map((val, index) => (
              <Box
                onClick={() => {
                  send('SELECTED', {
                    value: { selected: val, index: index },
                  });
                  sendInput('SELECTING_CATEGORIE');
                  if (inputRef.current) {
                    const currentRef = inputRef.current as HTMLElement;
                    currentRef.focus();
                  }
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
    </form>
  );
}
