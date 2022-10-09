import axios from 'axios';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import type { Data as ExamScoreType } from '@/components/datagrid/ExamScore/consts';
import ExamScoreDatagrid from '@/components/datagrid/ExamScore/ExamScoreDatagrid';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { BACKEND_URL } from '@/utils/consts';

interface Props {
  grades: ExamScoreType[];
  studentId: number;
}

const StudentGrades: React.FC<Props> = ({ grades, studentId }) => {
  const [examGrades] = useState(grades);

  // useEffect: If grades.length===0, then redirect the user to the dashboard.
  const router = useRouter();

  useEffect(() => {
    if (grades.length === 0) {
      alert(
        `This student doesn't have any grades. Kindly check for the correctness of the Student ID.`
      );
      router.push('/dashboard');
    }
  }, [grades.length, router]);

  return (
    <>
      <Seo
        title='Exam Score'
        description='Exam Score of students'
        image='/images/seo/seo.png'
      />
      <Layout>
        <Header />
        <div className='flex items-center justify-center rounded-md bg-red-300 p-5 sm:mx-11 lg:mx-44'>
          <div className='font-SpaceMono font-extrabold sm:text-sm lg:text-2xl'>
            Exam Scores for User ID: {studentId}
          </div>
        </div>
        <div className='flex items-center justify-center rounded-md  p-5 sm:mx-11 lg:mx-44'>
          <ExamScoreDatagrid columns={[]} rows={examGrades} />
        </div>
      </Layout>
    </>
  );
};

export default StudentGrades;

// Function to get the grades of the student by studentId
const getStudentGrades = async (studentId: number) => {
  const { data } = await axios.get(`${BACKEND_URL}/examMarks/ByStudentId`, {
    data: {
      studentId: +studentId,
    },
  });

  return data;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the studentId from the URL
  const { studentId } = context.query;
  const studentIdInt = parseInt(studentId as string);

  const grades = await getStudentGrades(studentIdInt);

  return { props: { grades, studentId } };
};
