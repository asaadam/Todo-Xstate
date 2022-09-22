import { List, ListItem, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import React from 'react';

type Props = {
  children: Array<React.ReactNode>;
  defaultSelectedIndex?: number;
};

type TypeKeys = {
  37: number;
  38: number;
  39: number;
  40: number;
};

const keys: TypeKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefaultForScrollKeys(e: KeyboardEvent) {
  const keyKode = e.keyCode as keyof TypeKeys;
  if (keys[keyKode]) {
    e.preventDefault();
    return false;
  }
}

function disableScroll() {
  window.addEventListener('keydown', preventDefaultForScrollKeys);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('keydown', preventDefaultForScrollKeys);
}

// eslint-disable-next-line react/display-name
const ListHandler = React.forwardRef<HTMLUListElement, Props>(
  ({ children, defaultSelectedIndex }, ref) => {
    useEffect(() => {
      const newRef = ref as React.RefObject<HTMLUListElement>;
      if (newRef && newRef?.current && defaultSelectedIndex !== undefined) {
        const target = newRef.current.childNodes[
          defaultSelectedIndex
        ] as HTMLElement;
        target.focus();
      }
    }, [defaultSelectedIndex, ref]);

    useEffect(() => {
      disableScroll();
      return () => {
        enableScroll();
      };
    }, []);

    return (
      <VStack w="100%" alignItems="flex-start">
        <List ref={ref} pt="2" w="100%">
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
);

export { ListHandler };
