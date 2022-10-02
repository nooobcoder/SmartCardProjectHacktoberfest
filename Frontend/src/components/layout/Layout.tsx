import * as React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <div className='rounded-all mx-14 min-h-screen flex-col justify-start rounded-lg bg-gray-100'>
      {children}
    </div>
  );
}
