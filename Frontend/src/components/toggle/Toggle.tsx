import { Switch } from '@headlessui/react';
import { useState } from 'react';

function Toggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    // Span padding
    <span className='ml-10'>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? 'bg-primary-500' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className='sr-only'>Enable notifications</span>
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white`}
        />
      </Switch>
    </span>
  );
}

export default Toggle;
