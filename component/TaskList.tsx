import { Checkbox, HStack, Text, VStack } from '@chakra-ui/react';
import { useGlobalStore } from '../store/globalStore';
import { ListHandler } from './ListHandler';

function TaskList() {
  const { task } = useGlobalStore();
  return (
    <>
      {task.length > 0 ? (
        <ListHandler>
          {task.map((data, index) => (
            <Checkbox
              _hover={{ backgroundColor: 'green.100', color: 'Black' }}
              _focus={{ backgroundColor: 'gray.100', color: 'Black' }}
              w="100%"
              key={`${data.title} ${index}`}
            >
              <HStack>
                <VStack>
                  <Text color="gray.600">{data.title}</Text>
                  <Text color="gray.400">{data.categories}</Text>
                </VStack>
              </HStack>
            </Checkbox>
          ))}
        </ListHandler>
      ) : (
        <h1>task list goes here</h1>
      )}
    </>
  );
}

export { TaskList };
