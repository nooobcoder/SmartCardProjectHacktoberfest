import axios from 'axios';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import Button from '@/components/buttons/Button';
import AttendanceDatagrid from '@/components/datagrid/Attendance/AttendanceDatagrid';
import type { Data as AttendanceType } from '@/components/datagrid/Attendance/consts';
import AttendanceForm from '@/components/forms/AttendanceForm';
import GenericModal from '@/components/layout/GenericModal';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';

import type { LeaveType, UserCookie } from '@/utils/consts';
import { BACKEND_URL, USER_PRIVILEGES } from '@/utils/consts';

interface Props {
  attendances: AttendanceType[];
}

const Attendance: React.FC<Props> = ({ attendances }) => {
  const [userAttendances] = useState<AttendanceType[]>(attendances);

  const router = useRouter();
  const [cookies, _, removeCookie] = useCookies(['user']);
  const user: UserCookie = cookies.user;

  const [leaveTypes] = useState<Array<LeaveType>>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // If user.role===`STU`, then redirect the user to /exam/scores/[studentId]
  useEffect(() => {
    // useCallback handleLogout
    const handleLogoutCallback = async () => {
      await removeCookie('user');
      // Redirect to /auth/login
      router.push('/auth/login');
    };

    if (user?.role === USER_PRIVILEGES.Student.name) {
      router.push(`/attendances/attendance/${user.userId}`);
    }

    if (!user) handleLogoutCallback();

    return;
  }, [user, router, removeCookie]);

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
            disabled={user?.role !== `ADM`}
            className='disabled:bg-gray-500 disabled:hover:bg-gray-600'
            onClick={() => setModalOpen(true)}
          >
            ADD ATTENDANCE
          </Button>
        </div>
        <div>
          <GenericModal open={modalOpen} setModalOpen={setModalOpen}>
            {/* Form with inputs for User_Id, Date, Time, Status */}
            <AttendanceForm leaveTypes={leaveTypes} />
          </GenericModal>
        </div>
        <div>
          <AttendanceDatagrid columns={[]} rows={userAttendances} />
        </div>
      </Layout>
    </>
  );
};

export default Attendance;

// The below function gets all the marks from the database
const fetchAttendances = async (): Promise<AttendanceType[]> => {
  const { data } = await axios.get(`${BACKEND_URL}/attendance`);

  return data;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const attendances = await fetchAttendances();

  return {
    props: {
      attendances,
    },
  };
};
