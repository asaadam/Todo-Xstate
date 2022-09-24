import { Box, HStack, Text, Tooltip, useToast } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useMachine, useSelector } from '@xstate/react';
import { useEffect, useRef } from 'react';
import { useCategories } from '../store/categoriesStore';
import { inputMachine } from '../machine/InputMachine';
import { ListHandler } from './ListHandler';
import { QuestionIcon } from '@chakra-ui/icons';
import { useGlobalStore } from '../store/globalStore';

export function CustomInput() {
  const { categories, addCategory, addTask, addTitle } = useGlobalStore();
  const [stateInput, sendInput] = useMachine(inputMachine);
  const { service } = useCategories();
  const filteredCategory = useSelector(
    service,
    (state) => state.context.categories
  );

  const selectedCategories = useSelector(
    service,
    (state) => state.context.selected
  );

  const { send } = service;
  const inputRef = useRef(null);
  const ulRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    if (categories) {
      send('SET_CATEGORY', {
        value: categories,
      });
    }
  }, [categories, send]);

  useEffect(() => {
    if (stateInput.context.text?.includes('@')) {
      const splitInput = stateInput.context.text.split('@');
      if (!splitInput[1].includes(' ')) {
        const filtered = categories.filter((val) => {
          if (val.toLowerCase().indexOf(splitInput[1]) > -1) {
            return val;
          }
        });
        sendInput('TYPING_CATEGORY');
        send('FILTER_CATEGORY', {
          value: filtered,
        });
      }
    } else {
      sendInput('TYPING', {
        value: stateInput.context.text,
      });
    }
  }, [
    stateInput.context.text,
    sendInput,
    stateInput.context.category,
    categories,
    send,
  ]);

  return (
    <Box position="relative">
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
            if (e.key === 'Enter') {
              if (selectedCategories) {
                addTask({
                  categories: selectedCategories!,
                  isDone: false,
                  title: stateInput.context.text,
                });
                return sendInput('SUBMIT');
              }
              toast({
                title: 'Error',
                description: 'Please select categories first',
                status: 'error',
              });
            }
          }}
          ref={inputRef}
          onChange={(e) => {
            sendInput('TYPING', { value: e.target.value });
          }}
        />
        <Tooltip label="Try type @, and you can choose category" fontSize="md">
          <QuestionIcon />
        </Tooltip>
      </HStack>
      <Box position="absolute" backgroundColor="gray.300" zIndex={4}>
        {stateInput.value === 'categoriesSelected' && (
          <ListHandler ref={ulRef} prevRef={inputRef}>
            {filteredCategory.length > 0
              ? filteredCategory.map((val, index) => {
                  return (
                    <Box
                      _hover={{ backgroundColor: 'gray.400' }}
                      _focus={{ backgroundColor: 'gray.400' }}
                      onClick={() => {
                        if (inputRef.current) {
                          const currentRef = inputRef.current as HTMLElement;
                          setTimeout(() => currentRef.focus(), 0);
                        }
                        send('SELECTED', {
                          value: { selected: val, index: index },
                        });
                        sendInput('SELECTING_CATEGORY');
                      }}
                      w="100%"
                      p="4"
                      key={`${val} ${index}`}
                    >
                      <Text>{val}</Text>
                    </Box>
                  );
                })
              : [
                  <Box
                    _hover={{ backgroundColor: 'gray.400' }}
                    _focus={{ backgroundColor: 'gray.400' }}
                    p="4"
                    onClick={() => {
                      addCategory(stateInput.context.text.split('@')[1]);

                      if (inputRef.current) {
                        const currentRef = inputRef.current as HTMLElement;
                        setTimeout(() => currentRef.focus(), 0);
                      }
                    }}
                    key={'newData'}
                  >
                    <Text>
                      Add{' '}
                      <Text as={'span'} textColor={'red.400'}>
                        {stateInput.context.text.split('@')[1]}{' '}
                      </Text>
                      to category
                    </Text>
                  </Box>,
                ]}
          </ListHandler>
        )}
      </Box>
    </Box>
  );
}
