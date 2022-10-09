import Image from 'next/image';
import { useRouter } from 'next/router';
import InfineonLogo from 'public/images/infineon-logo.png';
import { useCookies } from 'react-cookie';

import SimpleDropdown from '@/components/dropdown/SimpleDropdown';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';

import { HEADER_LINKS } from '@/utils/consts';
import { shimmer, toBase64 } from '@/utils/imageBlur';

export default function Header() {
  const [cookie, _, removeCookie] = useCookies(['user']);
  // Use router
  const router = useRouter();
  const { pathname } = router;

  // If userCookie.user is undefined, the user is not logged in thus redirect to login
  const handleLogout = async () => {
    await removeCookie('user');
    // Redirect to /auth/login
    router.push('/auth/login');
  };

  return (
    <header className='sticky top-0 z-50 flex bg-purple-200 to-red-500 py-1'>
      <div className='layout flex h-14 items-center justify-around'>
        <div className='flex items-center justify-center space-x-5 align-middle '>
          <Image
            src={InfineonLogo}
            alt='Infineon Logo'
            width={80}
            height={30}
            placeholder='blur'
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(700, 475)
            )}`}
          />
          <ArrowLink
            as={ButtonLink}
            variant='light'
            className='drop-shadow-gray-400 mt-3 mb-3 inline-flex shadow-lg'
            href={
              pathname === `/auth/login`
                ? `/`
                : cookie.user
                ? `/`
                : `/auth/login`
            }
            direction='left'
            color='brown'
          >
            {pathname === `/auth/login`
              ? `Back to Home 🏡`
              : cookie.user
              ? `Back to Home 🏡`
              : `Login`}
          </ArrowLink>
        </div>
        <nav>
          <ul className='flex items-center space-x-4'>
            <SimpleDropdown
              items={
                // Filter links based on user role
                HEADER_LINKS.filter((link) =>
                  link.accessor.includes(cookie.user?.role || 'GEN')
                )
              }
              dropdownName='Options'
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              setSelectedItem={(setItem: any) => {
                router.push(setItem?.href);
              }}
            />
          </ul>
          {/* <ul
            className='flex items-center justify-between w-full h-full space-x-4 overflow-x-auto bg-purple-200 to-red-500 '
          >
            {links.map((link) => (
              <li key={link.href}>
                {link.accessor === 'GEN' && (
                  <UnstyledLink
                    href={link.href}
                    className='inline-flex items-center px-4 py-2 text-sm font-bold text-white transition duration-150 ease-in-out bg-purple-500 rounded hover:bg-purple-600 hover:text-gray-300 hover:underline focus:text-gray-800 focus:underline focus:outline-none '
                  >
                    {link.name}
                  </UnstyledLink>
                )}
              </li>
            ))}
            {links.map(
              ({ href, name, accessor }) =>
                // Render if user.role is admin and accessor is admin
                cookie.user?.role === 'ADM' &&
                accessor === 'ADM' && (
                  <li key={`${href}${name}`}>
                    <UnstyledLink
                      href={href}
                      className='inline-flex items-center px-4 py-2 text-sm font-bold text-white transition duration-150 ease-in-out bg-purple-500 rounded hover:bg-purple-600 hover:text-gray-300 hover:underline focus:text-gray-800 focus:underline focus:outline-none '
                    >
                      {name}
                    </UnstyledLink>
                  </li>
                )
            )}
          </ul> */}
        </nav>

        {/* Logout Button */}
        {cookie.user && (
          <button
            className='ml-4 inline-flex items-center rounded bg-red-500 px-4 py-2 text-sm font-bold text-white transition duration-150 ease-in-out hover:bg-red-600 hover:text-gray-300 hover:underline focus:text-gray-800 focus:underline focus:outline-none '
            onClick={handleLogout}
          >
            Logout
            <Image
              src={`https://avatars.dicebear.com/api/avataaars/${cookie?.user?.username}.svg`}
              alt='user-avatar'
              width={24}
              height={24}
              className='ml-2'
            />
          </button>
        )}
      </div>
    </header>
  );
}
