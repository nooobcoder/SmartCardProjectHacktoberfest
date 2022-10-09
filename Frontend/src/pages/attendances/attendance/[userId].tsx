import axios from 'axios';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import AttendanceDatagrid from '@/components/datagrid/Attendance/AttendanceDatagrid';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import type { AttendanceType, UserCookie } from '@/utils/consts';
import { BACKEND_URL } from '@/utils/consts';

interface Props {
  attendances: Array<AttendanceType>;
  userId: number;
}

const UserAttendance: React.FC<Props> = ({ userId, attendances }) => {
  const router = useRouter();

  // Get the user from the cookies
  const [cookies] = useCookies(['user']);
  const user: UserCookie = cookies.user;

  useEffect(() => {
    if (
      parseInt(router.query.userId as string) !== user.userId &&
      user.role !== 'ADM'
    ) {
      alert(`You are not authorized to view this user's attendance`);
      router.push(`/attendances/attendance/${user.userId}`).then();
    }
    if (attendances.length === 0) {
      alert(
        `This user doesn't have any attendance records. Kindly check for the correctness of the User ID.`
      );
      router.back();
    }
  }, [attendances, user, router]);

  return (
    <>
      <Seo
        title='Exam Score'
        description='Exam Score of students'
        image='/images/seo/seo.png'
      />
      <Layout>
        <Header />
        {parseInt(router.query.userId as string) === user?.userId ||
        user?.role === 'ADM' ? (
          <>
            <div className='flex items-center justify-center rounded-md bg-red-300 p-5 sm:mx-11 lg:mx-44'>
              <div className='font-SpaceMono font-extrabold sm:text-sm lg:text-2xl'>
                Attendance for User ID: {userId}
              </div>
            </div>
            <div className='flex items-center justify-center rounded-md  p-5 sm:mx-11 lg:mx-44'>
              <AttendanceDatagrid columns={[]} rows={attendances} />
            </div>
          </>
        ) : (
          <div className='flex items-center justify-center rounded-md bg-red-300 p-5 sm:mx-11 lg:mx-44'>
            <div className='font-SpaceMono font-extrabold sm:text-sm lg:text-2xl'>
              You are not authorized to view this {`user's`} attendance
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

// Function to get the attendance of the user by userId
const getUserAttendance = async (userId: number) => {
  try {
    const { data } = await axios.get<Array<AttendanceType>>(
      `${BACKEND_URL}/attendance/${userId}`
    );
    return data;
  } catch (err) {
    // Handle error better way
    return [];
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the userId from the url
  const { userId } = context.query;
  const userIdInt = parseInt(userId as string);

  const attendances = await getUserAttendance(userIdInt);

  return { props: { attendances, userId } };
};

export default UserAttendance;
