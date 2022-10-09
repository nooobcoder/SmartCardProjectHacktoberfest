import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid/';
import { Fragment } from 'react';

import type {
  HeaderLink,
  MenuProps,
  Reader,
  SimpleDropdownProps,
  Trigger,
} from '@/utils/consts';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SimpleDropdown({
  items,
  setSelectedItem,
  dropdownName = `Untitled`,
}: SimpleDropdownProps) {
  return (
    <Menu
      as='div'
      className='drop-shadow-gray-400 relative mx-3 mt-3 mb-3 inline-block inline-flex text-left shadow-lg'
    >
      <div>
        <Menu.Button className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-100'>
          {dropdownName}
          <ChevronDownIcon className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute left-0 mt-2 h-44 w-56 origin-top-right overflow-scroll overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='py-1'>
            {items?.map(
              (item: Reader | Trigger | HeaderLink, index: number) => (
                <Menu.Item key={index}>
                  {({ active }: MenuProps) => (
                    <button
                      // href={item?.name || '#'}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'hover: border-b-gray inline  w-full space-y-2 border-2 px-4 py-2 text-sm font-medium hover:border-b-black hover:bg-pink-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-100'
                      )}
                      onClick={() => setSelectedItem(item)}
                    >
                      {/* If item of type HeaderLinks */}
                      {item?.name}
                    </button>
                  )}
                </Menu.Item>
              )
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
