import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import Button from '@/components/buttons/Button';
import AttendanceForm from '@/components/forms/AttendanceForm';
import GenericModal from '@/components/layout/GenericModal';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';

import type { LeaveType } from '@/utils/consts';
import { getLeaveTypes } from '@/utils/consts';

const Attendance = () => {
  const router = useRouter();
  const [cookie] = useCookies(['user']);

  const [leaveTypes, setLeaveTypes] = useState<Array<LeaveType>>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Using an IIFE
    (async function anon() {
      const data = await getLeaveTypes();
      setLeaveTypes(data);
    })();

    // Check if userCookie.user is undefined
    if (!cookie.user) {
      router.push('/auth/login');
    }
  }, [cookie, router]);

  return (
    <>
      <Layout>
        <Header />
        <div className='flex items-center justify-center rounded-md bg-red-300 p-5 sm:mx-11 lg:mx-44'>
          <div className='font-SpaceMono font-extrabold sm:text-sm lg:text-2xl'>
            Attendance Form
          </div>
        </div>
        <div className='flex items-center justify-center rounded-md p-5 font-sans sm:mx-11 lg:mx-44'>
          <Button
            disabled={cookie.user?.role !== `ADM`}
            className='disabled:bg-gray-500 disabled:hover:bg-gray-600'
            onClick={() => setModalOpen(true)}
          >
            ADD ATTENDANCE
          </Button>
        </div>
        <GenericModal open={modalOpen} setModalOpen={setModalOpen}>
          {/* Form with inputs for User_Id, Date, Time, Status */}
          <AttendanceForm leaveTypes={leaveTypes} />
        </GenericModal>
      </Layout>
    </>
  );
};

export default Attendance;
