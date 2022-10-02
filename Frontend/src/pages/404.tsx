import * as React from 'react';

import PrimaryLink from '@/components/links/PrimaryLink';
import Seo from '@/components/Seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo templateTitle='Not Found' />
      <main>
        <section className='bg-white'>
          <video
            id='background-video'
            loop
            autoPlay
            muted
            playsInline
            className='absolute h-full w-full object-cover'
            src='/videos/NotFound.mp4'
          ></video>
          {/* Div at center of page*/}
          <div className='layout flex min-h-screen select-none flex-col items-center justify-center text-center shadow-xl hover:cursor-none'>
            <h1 className='relative animate-flicker text-4xl text-white md:text-6xl'>
              Page Not Found
            </h1>
            {/* ButtonLink */}
            <div className='relative mt-8'>
              <PrimaryLink
                href='/'
                className='relative rounded-lg bg-purple-200 px-8 py-5 text-2xl md:text-3xl'
              >
                <span className='text-2xl text-black'>Go Home! 🏡</span>
              </PrimaryLink>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
