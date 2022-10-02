import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import toast, { Toaster } from 'react-hot-toast';
import Lottie from 'react-lottie';

import animationData from '@/lib/lottie-animations/85795-man-and-woman-say-hi.json';

import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';

import { BACKEND_URL, USER_PRIVILEGES } from '@/utils/consts';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    pin: '',
    role: USER_PRIVILEGES[`Student`].name,
  });

  const router = useRouter();
  // Use cookies
  const [cookies] = useCookies(['user']);

  useEffect(() => {
    // If user is not admin, redirect to /dashboard
    if (cookies?.user?.role !== USER_PRIVILEGES[`Admin`].name) {
      router.push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmission = async (
    e: React.FormEvent<HTMLFormElement | HTMLButtonElement>
  ) => {
    e.preventDefault();

    // Check if the username and pin is not empty
    if (formData.username && formData.pin) {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/auth/CreateUser`,
          formData
        );
        if (response.status === 200) {
          toast.success('User created successfully');
        } else {
          toast.error('Error creating user');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Get errror message from the response
          const errorMessage = error.response?.data;
          toast.error(errorMessage as string);
        } else {
          toast.error(`Generic Error: ${error}`);
        }
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
        <h2
          className='
        mt-4
        mb-8
        text-gray-800
      '
        >
          Create User
          <div className='flex flex-col items-start'>
            <Lottie
              options={defaultOptions}
              height={300}
              width={300}
              title='avatar'
              isClickToPauseDisabled={true}
            />
          </div>
        </h2>
        {/* Form to create user with the fields as described above */}

        <form
          className='ocus:ring-gray-400 mt-12 w-full max-w-2xl items-center justify-center rounded-lg border border-gray-300 bg-gray-100 p-4 shadow-lg ring-gray-300 focus:outline-none  focus:ring-2 focus:ring-opacity-50 focus:ring-offset-2 disabled:opacity-50'
          onSubmit={handleFormSubmission}
        >
          <div className='mb-6 md:flex md:items-center'>
            <div className='md:w-1/3'>
              <label
                className='mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right'
                htmlFor='username'
              >
                Username
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                className='w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none'
                id='username'
                name='username'
                type='text'
                placeholder='Username here'
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className='mb-6 md:flex md:items-center'>
            <div className='md:w-1/3'>
              <label
                className='mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right'
                htmlFor='pin'
              >
                PIN
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                className='w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-none'
                id='pin'
                type='password'
                name='pin'
                value={formData.pin}
                placeholder='****'
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  e.target.value = e.target.value.slice(0, 4);
                  handleInputChange(e);
                }}
              />
            </div>
          </div>
          <div className='mb-6 md:flex md:items-center'>
            <div className='md:w-1/3'>
              <label
                className='mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right'
                htmlFor='role'
              >
                Role
              </label>
            </div>
            <div className='md:w-2/3'>
              <select
                name='role'
                id='role'
                value={formData.role}
                className='w-full max-w-xs appearance-none rounded border-2 border-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-purple-500 focus:outline-none'
                onChange={handleInputChange}
              >
                {Object.keys(USER_PRIVILEGES).map((key) => (
                  <option
                    key={USER_PRIVILEGES[key].id}
                    value={USER_PRIVILEGES[key].name}
                    className={`${USER_PRIVILEGES[key].className} `}
                  >
                    {key} ({USER_PRIVILEGES[key].name})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='mt-24 md:flex md:items-center'>
            <div className='md:w-1/3'></div>
            <div className='md:w-2/3'>
              <button
                className='focus:shadow-outline rounded bg-purple-500 py-2 px-4 font-bold text-white shadow hover:bg-purple-400 focus:outline-none'
                type='button'
                onClick={handleFormSubmission}
              >
                Create User 📝
              </button>
            </div>
          </div>
        </form>
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

export default CreateUser;
