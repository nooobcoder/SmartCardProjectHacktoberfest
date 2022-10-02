import { FastForwardIcon } from '@heroicons/react/solid';
import axios from 'axios';
import type { GetServerSideProps } from 'next/types';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import SimpleDropdown from '@/components/dropdown/SimpleDropdown';
import Footer from '@/components/Footer';
import Input from '@/components/Input';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';

import { BACKEND_URL, Reader, Response, Trigger } from '@/utils/consts';
import { triggers } from '@/utils/consts';

interface Props {
  readers: Array<{ name: string }>;
}

// This component is responsible for the UI of the page.
const POC = ({ readers }: Props) => {
  // const router = useRouter();
  const [selectedReader, setSelectedReader] = useState<Reader>(readers[0]);
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger>(triggers[2]);

  const [apduResponse, setResponse] = useState<null | Response>(null);

  const sendAPDU = async () => {
    setResponse(null);
    const API_URL = selectedTrigger?.url || `${BACKEND_URL}/readers/SendAPDU`;
    const data = {
      reader_name: selectedReader?.name,
      apdu: selectedTrigger?.name,
    };
    // Use axios to send API request
    const resp: Response = await (await axios.post(API_URL, data)).data;
    setResponse(resp);
    return resp;
  };

  const notify = () =>
    toast.promise(sendAPDU(), {
      loading: 'Sending...',
      error: (err) => `Error: ${err}`,
      success: `Sent "${selectedTrigger.name.toUpperCase()}" APDU to PC/SC.`,
    });

  useEffect(() => {
    toast.success(
      selectedTrigger === null
        ? `Please select a trigger`
        : `Selected Trigger: ${selectedTrigger.name}`,
      {
        // Custom Icon
        icon: '🖱',
        position: 'top-right',
        // Change colors of success/error/loading icon
        iconTheme: {
          primary: '#000',
          secondary: '#fff',
        },
        // Aria
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
        style: {
          background: '#4608ad',
          color: '#fff',
        },
      }
    );
  }, [selectedTrigger]);

  useEffect(() => {
    toast.success(
      selectedReader === undefined
        ? `No card readers detected`
        : `Selected Reader: ${selectedReader?.name}`,
      {
        style: {
          background: '#4608ad',
          color: '#fff',
        },
        // Custom Icon
        icon: '💳',
        position: 'top-right',
        // Change colors of success/error/loading icon
        iconTheme: {
          primary: '#000',
          secondary: '#fff',
        },
        // Aria
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      }
    );
  }, [selectedReader]);

  const translateMessage = async () => {
    const API_URL = `${BACKEND_URL}/readers/ConvertHexToString`;
    const data = {
      reader_name: selectedReader?.name,
      apdu: apduResponse?.response.message,
    };

    // Use axios to send API request
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resp: any = await (await axios.post(API_URL, data)).data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setResponse((p: any) => ({
      ...p,
      response: { ...p.response, message: resp.decoded },
    }));
    return resp;
  };

  // toast.success('Sent APDU to PC/SC.', {
  //   // Custom Icon
  //   icon: '👏',

  //   position: 'top-right',
  //   // Change colors of success/error/loading icon
  //   iconTheme: {
  //     primary: '#000',
  //     secondary: '#fff',
  //   },

  //   // Aria
  //   ariaProps: {
  //     role: 'status',
  //     'aria-live': 'polite',
  //   },
  // });
  // Center the button in the page using tailwind.
  return (
    <>
      <div className='text-brown-500 w-120 -z-20 flex h-screen animate-shine flex-col items-center justify-center'>
        <ArrowLink
          as={ButtonLink}
          variant='light'
          className='drop-shadow-gray-400 inline-flex items-center shadow-lg'
          href='/'
          direction='left'
          color='brown'
        >
          Home 🏡
        </ArrowLink>
        <div className='group relative flex cursor-pointer items-center justify-center '>
          {/* Animation from: https://birdeatsbug.com/blog/creating-hover-effects-with-tailwind-css */}
          <div className='z-5 absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine' />
          <h1 className='mb-2 mt-4 rounded-lg  bg-lime-300 px-10 py-8 text-center text-[50px] text-red-600 shadow-xl shadow-amber-100'>
            Project POC
          </h1>
        </div>
        <p className='mt-2 text-sm italic text-gray-800 underline'>
          This is a proof of concept page.
        </p>

        <span className='z-20 justify-between space-x-24 space-y-6'>
          {readers.length > 0 && (
            <SimpleDropdown
              items={readers}
              setSelectedItem={setSelectedReader}
              dropdownName='Card Readers'
            />
          )}
          <SimpleDropdown
            items={triggers}
            setSelectedItem={setSelectedTrigger}
            dropdownName={selectedTrigger.name}
            // dropdownName='Triggers'
          />
        </span>

        {/* <div className='my-5'>
          Notifications?
          <Toggle />
        </div> */}

        <form className='pt-5'>
          <Input placeholder='Data Value' />
        </form>
        <button
          className='my-8 border-spacing-2 transform rounded border border-double border-gray-600 bg-blue-200 p-8 py-2 px-4 text-xl font-bold text-gray-900 shadow-xl shadow-blue-200  transition duration-500 ease-in-out hover:-translate-y-1  hover:scale-110 hover:bg-blue-400'
          onClick={() => notify()}
        >
          Send APDU to {}
          {/* Purple color text div */}
          <span className='text-purple-500'>
            PC/SC
            <FastForwardIcon className='ml-3 inline h-8 w-12 fill-purple-700' />
          </span>
        </button>
        <div className='my-8 w-2/4'>
          <div className='rounded-md bg-pink-200 p-6 shadow-md shadow-pink-700'>
            {apduResponse ? (
              <table className='w-full table-auto border-dashed '>
                <thead>
                  <tr>
                    <th className='w-4/6 border border-black px-4 py-2 text-left text-gray-800'>
                      <span className='text-sm font-bold'>Response Bytes</span>
                    </th>
                    <th className='border border-black px-4 py-2 text-left text-gray-800'>
                      <span className='text-sm font-bold'>Status Word</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={12}>
                    <td className='border border-black px-4 py-2 text-left text-gray-800'>
                      {apduResponse.response.message}
                      <button
                        className='ml-4 rounded-md bg-gray-200 p-2 text-sm font-bold text-gray-800'
                        onClick={() => translateMessage()}
                      >
                        <span className='text-sm font-bold'>TRANSLATE</span>
                      </button>
                    </td>
                    <td className='border border-black px-4 py-2 text-left text-gray-800'>
                      {apduResponse.status.code}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              `No response received. Try clicking the SEND APDU BUTTON`
            )}
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
      <Footer />
    </>
  );
};

const getServerSideProps: GetServerSideProps = async () => {
  let readers: Array<Reader> | null = null;
  const getReaders = async () => {
    const API_URL = `${BACKEND_URL}/readers`;
    // Use axios to send API request
    const { data } = await axios.get(API_URL);
    return data;
  };

  readers = await getReaders();
  return { props: { readers } };
};

export default POC;
export { getServerSideProps };
