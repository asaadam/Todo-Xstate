import { Box, Text } from '@chakra-ui/react';
import { ListHandler } from './ListHandler';

const LIST_CATEGORIES = ['Design', 'Programming', 'Marketing', 'Finance'];

type Props = {
  onClick: (val: string, index: number) => void;
  defaultSelectedIndex?: number;
};

export function Categories({ onClick, defaultSelectedIndex }: Props) {
  return (
    <ListHandler defaultSelectedIndex={defaultSelectedIndex}>
      {LIST_CATEGORIES.map((val, index) => (
        <Box
          onClick={() => {
            onClick(val, index);
          }}
          w="100%"
          p="4"
          key={`${val} ${index}`}
        >
          <Text>{val}</Text>
        </Box>
      ))}
    </ListHandler>
  );
}
