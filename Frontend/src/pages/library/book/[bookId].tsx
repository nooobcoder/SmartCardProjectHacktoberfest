// Statically generated page

import axios, { AxiosResponse } from 'axios';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';

import Footer from '@/components/Footer';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';

import { BACKEND_URL, Book } from '@/utils/consts';
import { shimmer, toBase64 } from '@/utils/imageBlur';
import { BookMetadata, getMetadata } from '@/utils/libraryBooks';

interface BookIdProps {
  metadata: BookMetadata;
}

const BookId: React.FC<BookIdProps> = ({ metadata }: BookIdProps) => {
  return (
    <Layout>
      <Header />
      <div className='mx-8 mb-7'>
        <div className='flex flex-col items-center bg-yellow-300'>
          <ArrowLink
            as={ButtonLink}
            variant='light'
            className='drop-shadow-gray-400 my-11 inline-flex shadow-lg'
            direction='left'
            href='/library/books'
            color='brown'
          >
            Back to Library 📚
          </ArrowLink>
        </div>
        <div className=' grid flex-grow gap-14  bg-purple-700 p-5 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3'>
          {metadata.extraLargeThumbnail && (
            <Image
              src={metadata.extraLargeThumbnail}
              alt={metadata.title}
              width={1200}
              height={2000}
              placeholder='blur'
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(700, 475)
              )}`}
              className='rounded-2xl'
            />
          )}
          <div className='grow rounded-lg bg-black p-6 lg:col-span-2 '>
            <h1 className='mg:text-4xl mb-8 text-center font-bold text-white sm:text-xl lg:text-7xl'>
              {metadata.title}
            </h1>
            <h2 className='mb-11 text-center text-2xl font-bold text-white'>
              {metadata.authors[0]}
            </h2>
            <p className='text-xl text-white'>
              {/* Dangerously set innerhtml */}
              <div dangerouslySetInnerHTML={{ __html: metadata.description }} />
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default BookId;

const getAllBooks = async () => {
  // Get Books from Library
  // API URL: https://127.0.0.1:5001/library/Books
  const response: AxiosResponse<Book[]> = await axios.get(
    `${BACKEND_URL}/library/Books`
  );
  // If response is not ok
  if (response.status !== 200) {
    throw new Error(
      `Failed to fetch books, received status ${response.status}`
    );
  } else {
    // Return books
    return response.data;
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const books: Array<Book> = await getAllBooks();

  return {
    fallback: false,
    paths: books.map((book) => ({
      params: {
        bookId: book.googleBookId.toString(),
      },
    })),
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const bookId = params?.bookId;

  // Fetch metadata from Google Books API
  const metadata: BookMetadata = await getMetadata(bookId as string);

  return {
    props: {
      metadata,
    },
    revalidate: 60 * 5, // Revalidate in 5 minutes
  };
};
