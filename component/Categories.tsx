import { Box, Text } from '@chakra-ui/react';
import { ListHandler } from './ListHandler';

const LIST_CATEGORIES = ['Design', 'Programming', 'Marketing', 'Finance'];

type Props = {
  onClick: (val: string) => void;
};

export function Categories({ onClick }: Props) {
  return (
    <ListHandler>
      {LIST_CATEGORIES.map((val) => (
        <Box
          onClick={(e) => {
            onClick(val);
          }}
          w="100%"
          p="4"
          key={val}
        >
          <Text>{val}</Text>
        </Box>
      ))}
    </ListHandler>
  );
}
