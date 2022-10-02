import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className=' bg-white p-4 shadow dark:bg-gray-800 md:flex md:items-center md:justify-between md:p-6'>
      <span className='text-sm text-gray-500 dark:text-gray-400 sm:text-center'>
        © 2022{' '}
        <Link href='https://github.com/nooobcoder' passHref>
          <a
            className='text-gray-500 hover:font-bold hover:underline dark:text-gray-400'
            target='_blank'
            rel='noopener noreferrer'
          >
            nooobcoder™ (ANKUR PAUL)
          </a>
        </Link>
        . All Rights Reserved.
      </span>
      <ul className='mt-3 flex flex-wrap items-center sm:mt-0'>
        <li>
          <a
            href='#'
            className='mr-4 text-sm text-gray-500 hover:underline dark:text-gray-400 md:mr-6'
          >
            About
          </a>
        </li>
        <li>
          <a
            href='#'
            className='mr-4 text-sm text-gray-500 hover:underline dark:text-gray-400 md:mr-6'
          >
            Privacy Policy
          </a>
        </li>
        <li>
          <a
            href='#'
            className='mr-4 text-sm text-gray-500 hover:underline dark:text-gray-400 md:mr-6'
          >
            Licensing
          </a>
        </li>
        <li>
          <a
            href='#'
            className='text-sm text-gray-500 hover:underline dark:text-gray-400'
          >
            Contact
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
