import { List, ListItem, VStack } from '@chakra-ui/react';
import { MutableRefObject, useEffect } from 'react';
import React from 'react';

type Props = {
  children: Array<React.ReactNode>;
  defaultSelectedIndex?: number;
  prevRef?: MutableRefObject<null>;
};

type TypeKeys = {
  38: number;
  40: number;
};

const keys: TypeKeys = { 38: 1, 40: 1 };

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
  ({ children, defaultSelectedIndex, prevRef }, ref) => {
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
              _focus={{ backgroundColor: 'gray.100', color: 'Black' }}
              onClick={(e) => {
                e.currentTarget.focus();
              }}
              cursor="pointer"
              onMouseOver={(e) => {
                e.currentTarget.focus();
              }}
              onMouseOut={(e) => {
                e.currentTarget.blur();
              }}
              tabIndex={index}
              key={index}
              onKeyDown={(e) => {
                const eventTarget = e.target as HTMLInputElement;
                if (e.keyCode === 40) {
                  const next = eventTarget.nextSibling as HTMLElement;
                  if (!next) {
                    return;
                  } else {
                    next.focus();
                  }
                } else if (e.keyCode === 38) {
                  const prev = eventTarget.previousSibling as HTMLElement;
                  if (prev) {
                    prev.focus();
                  } else if (prevRef) {
                    const previousRef =
                      prevRef.current as unknown as HTMLElement;
                    previousRef.focus();
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
