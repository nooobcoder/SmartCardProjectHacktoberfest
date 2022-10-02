import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import toast, { Toaster } from 'react-hot-toast';
import Lottie from 'react-lottie';

import animationData from '@/lib/lottie-animations/22807-people-morph-flow.json';

import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Modal from '@/components/layout/Modal';

const Login = () => {
  // Use router
  const router = useRouter();

  // Use cookies
  const [cookies, setCookie] = useCookies(['user']);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: '',
    pin: '',
  });

  // const notify = async (e: React.FormEvent<HTMLFormElement>) =>
  //   toast.promise(handleSubmit(e), {
  //     loading: 'Logging in...',
  //     error: (err) => `Error: ${err}`,
  //     success: `Logged in as ${userDetails.username}`,
  //   });

  useEffect(() => {
    if (cookies.user) {
      router.push('/dashboard');
    }
  }, [cookies, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Send request using axios to /api/loginUser with userDetails as the request body
    try {
      const resp = await axios.post('/api/loginUser', userDetails, {
        withCredentials: true,
      });

      // If the response is successful, redirect to /dashboard
      if (resp.status === 200) {
        // Set the cookie after successful login
        setCookie('user', JSON.stringify(resp.data), {
          // Cookie for a day
          maxAge: 1000 * 60 * 60 * 24,
          sameSite: true,
        });
        router.push('/dashboard');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data as string;
        toast.error(errorMessage || `Error logging in`);
      }
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <>
      <Layout>
        <Header />
        <div className='-mt-28 flex min-h-screen flex-col items-center justify-center py-2 sm:px-6 lg:px-8'>
          <Lottie
            options={defaultOptions}
            height={180}
            width={100}
            title='avatar'
            isClickToPauseDisabled={true}
          />
          {/* Wrapper box with thin borders and light background*/}
          <div className='h-96 w-full max-w-md space-y-8 rounded-2xl border border-gray-200 bg-pink-100 p-8'>
            <div>
              <Image
                className='mx-auto h-12 w-auto'
                src='https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg'
                alt='Workflow'
                width={92}
                height={32}
              />
              <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                Sign in to your account
              </h2>
            </div>
            <div className='mt-8'>
              <div className='mt-6'>
                <form
                  className='space-y-6'
                  method='POST'
                  onSubmit={handleSubmit}
                >
                  <input type='hidden' name='remember' defaultValue='true' />
                  <div className='-space-y-px rounded-md shadow-sm'>
                    <div>
                      <label htmlFor='username' className='sr-only'>
                        Username
                      </label>
                      <input
                        id='username'
                        name='username'
                        type='text'
                        autoComplete='username'
                        required
                        className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                        placeholder='Username'
                        onChange={handleInputChange}
                        value={userDetails.username}
                      />
                    </div>
                    <div>
                      <label htmlFor='pin' className='sr-only'>
                        PIN
                      </label>
                      <input
                        id='pin'
                        name='pin'
                        type='password'
                        autoComplete='current-password'
                        required
                        value={userDetails.pin}
                        className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                        placeholder='PIN'
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ''
                          );
                          e.target.value = e.target.value.slice(0, 4);
                          handleInputChange(e);
                        }}
                      />
                      {/* Add a eye icon in the input to toggle visibility of the pin */}
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <input
                        id='remember-me'
                        name='remember-me'
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                      />
                      <label
                        htmlFor='remember-me'
                        className='ml-2 block text-sm text-gray-900'
                      >
                        Remember me
                      </label>
                    </div>

                    <div className='text-sm'>
                      <a
                        href='#'
                        className='font-medium text-green-600 hover:text-green-500'
                        onClick={() => setModalIsOpen(true)}
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  {modalIsOpen && (
                    <Modal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} />
                  )}
                  <div>
                    <button
                      type='submit'
                      className='hover:bg-inorangedigo-700 group relative flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 '
                    >
                      <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                        <svg
                          className='text-indorangeigo-500 h-5 w-5 group-hover:text-orange-400'
                          viewBox='0 0 20 20'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='currentColor'
                          aria-hidden='true'
                        >
                          <path
                            fillRule='evenodd'
                            d='M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm4 10a1 1 0 00.707.293l4-1a1 1 0 10-.414-1.914l-4 1A1 1 0 007 13z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </span>
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Toaster
          reverseOrder={false}
          gutter={8}
          containerClassName=''
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: '',
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },

            // Default options for specific types
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      </Layout>
    </>
  );
};

export default Login;
