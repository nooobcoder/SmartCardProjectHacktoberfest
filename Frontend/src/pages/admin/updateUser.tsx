import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import toast, { Toaster } from 'react-hot-toast';
import Lottie from 'react-lottie';

import animationData from '@/lib/lottie-animations/71048-screen-loading.json';

import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';

import { BACKEND_URL, USER_PRIVILEGES } from '@/utils/consts';

const UpdateUser = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    pin: '',
  });

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

    if (formData.username && formData.pin) {
      try {
        const response = await axios.put(
          `${BACKEND_URL}/auth/UpdateUserPin`,
          formData
        );
        if (response.status === 200) {
          toast.success('User PIN updated successfully');

          // Reset the form data
          setFormData({
            username: '',
            pin: '',
          });
        } else {
          toast.error('Error updating user PIN');
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
    <div>
      <Layout>
        <Header />
        <div
          className='md:p-w w-full max-w-sm items-center justify-around rounded-lg border border-gray-200 shadow-md sm:p-6
      '
        >
          <h5 className='text-xl font-medium text-gray-900 '>Update User</h5>
          <Lottie options={defaultOptions} height={220} width={150} speed={2} />
          <form
            className='m-auto space-y-6 rounded-lg bg-blue-200 p-8'
            onSubmit={handleFormSubmission}
          >
            <div>
              <label
                htmlFor='username'
                className='mb-2 block text-sm font-medium text-gray-900'
              >
                Username
              </label>
              <input
                type='text'
                name='username'
                id='username'
                required
                value={formData.username}
                className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-orange-500 focus:ring-orange-500 '
                placeholder='john.doe'
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label
                htmlFor='pin'
                className='mb-2 block text-sm font-medium text-gray-900 '
              >
                New PIN
              </label>
              <input
                type='password'
                name='pin'
                id='pin'
                placeholder='••••'
                required
                value={formData.pin}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                  e.target.value = e.target.value.slice(0, 4);
                  handleInputChange(e);
                }}
                className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-orange-500 focus:ring-orange-500'
              />
            </div>
            <button
              type='submit'
              onClick={handleFormSubmission}
              className='w-full rounded-lg bg-orange-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300 '
            >
              Update User PIN
            </button>
          </form>
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
    </div>
  );
};

export default UpdateUser;
