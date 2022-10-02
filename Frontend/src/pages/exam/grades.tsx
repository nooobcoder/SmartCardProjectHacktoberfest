import { Skeleton } from '@mui/material';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Suspense, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { Data as ExamScoreType } from '@/components/datagrid/consts';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { BACKEND_URL, USER_PRIVILEGES } from '@/utils/consts';

interface Props {
  grades: ExamScoreType[];
}

const DynamicExamScoreDatagrid = dynamic(
  () => import('@/components/datagrid/ExamScoreDatagrid'),
  {
    suspense: true,
  }
);

const ExamScore: React.FC<Props> = ({ grades }) => {
  const [examGrades] = useState(grades);

  // Get the user from the cookies
  const [cookies, _, removeCookie] = useCookies(['user']);
  const user = cookies.user;

  const router = useRouter();

  // If user.role===`STU`, then redirect the user to /exam/scores/[studentId]
  useEffect(() => {
    // useCallback handleLogout
    const handleLogoutCallback = async () => {
      await removeCookie('user');
      // Redirect to /auth/login
      router.push('/auth/login');
    };

    if (user?.role === USER_PRIVILEGES.Student.name) {
      router.push(`/exam/grades/${user.userId}`);
    }

    if (!user) handleLogoutCallback();

    return;
  }, [user, router, removeCookie]);

  return (
    <>
      <Seo
        title='Exam Score'
        description='Exam Score of students'
        image='/images/seo/seo.png'
      />
      <Layout>
        <Header />
        <Suspense
          fallback={
            <Skeleton
              variant='rounded'
              animation='pulse'
              sx={{
                height: '100vh',
              }}
            />
          }
        >
          <div className='flex items-center justify-center rounded-md bg-red-300 p-5 sm:mx-11 lg:mx-44'>
            <div className='font-SpaceMono font-extrabold sm:text-sm lg:text-2xl'>
              Exam Scores
            </div>
          </div>
          <div className='flex items-center justify-center rounded-md  p-5 sm:mx-11 lg:mx-44'>
            {user?.role === USER_PRIVILEGES.Admin.name ||
            user?.role === USER_PRIVILEGES.Teacher.name ? (
              <div className='flex flex-row'>
                <input
                  type='text'
                  className='h-10 w-64 rounded-md border-2 border-gray-300 p-2'
                  placeholder='Enter Student ID'
                />
                <button className='ml-2 h-10 w-32 rounded-md bg-red-500 font-SpaceMono font-extrabold text-white '>
                  Fetch Marks
                </button>
              </div>
            ) : (
              <div>
                Your User Id: <code>{user?.userId}</code>
                <span className='mx-3 rounded-md bg-green-800 px-2 text-white'>
                  {user?.role}
                </span>
              </div>
            )}
          </div>
          <div className='flex items-center justify-center rounded-md  p-5 sm:mx-11 lg:mx-44'>
            <DynamicExamScoreDatagrid columns={[]} rows={examGrades} />
          </div>
        </Suspense>
      </Layout>
    </>
  );
};

export default ExamScore;

// The below function gets all the marks from the database
const fetchExamScores = async (): Promise<ExamScoreType[]> => {
  const { data } = await axios.get(`${BACKEND_URL}/examMarks`);

  return data;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const grades = await fetchExamScores();

  return {
    props: {
      grades,
    },
  };
};
