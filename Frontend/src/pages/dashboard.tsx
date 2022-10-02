import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import toast, { Toaster } from 'react-hot-toast';
import Lottie from 'react-lottie';

import animationData from '@/lib/lottie-animations/78790-hello.json';

// Dashboard
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function Dashboard() {
  const router = useRouter();
  const [cookie] = useCookies(['user']);

  // Check if userCookie.user is undefined
  useEffect(() => {
    if (cookie.user) {
      // Toast a logged in message
      toast.success(
        `Logged in as ${cookie.user.username} (${cookie.user.role})`,
        {
          position: 'bottom-right',
        }
      );

      return;
    } else {
      router.push('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Layout>
      <Seo />
      <Head>
        <title>Dashboard</title>
      </Head>
      <main>
        <Header />
        {cookie?.user ? (
          <>
            <section className='bg-white'>
              <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
                <Lottie
                  options={defaultOptions}
                  height={400}
                  width={400}
                  isClickToPauseDisabled={true}
                />
                <h1 className='mt-4'>Welcome, {cookie.user?.username}.</h1>
                <p className='mt-2 text-sm text-gray-800'>
                  This is the dashboard page. You are logged in as a{' '}
                  {cookie.user?.role}
                </p>
              </div>
            </section>
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
          </>
        ) : (
          <></>
        )}
      </main>
    </Layout>
  );
}
