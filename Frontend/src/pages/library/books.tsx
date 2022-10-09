import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { GetStaticProps } from 'next';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Toaster } from 'react-hot-toast';

import BookInfoCard from '@/components/card/BookInfoCard';
import CartDrawer from '@/components/drawer/CartDrawer';
import Header from '@/components/layout/Header';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';

import type { Book, UserCookie } from '@/utils/consts';
import { BACKEND_URL } from '@/utils/consts';
import type { BookMetadata } from '@/utils/libraryBooks';
import { getMetadata } from '@/utils/libraryBooks';

// Proptypes
interface PropTypes {
  fetchedBooks: Array<Book>;
  issuedBooks: Array<Book>;
  booksMetadata: Array<BookMetadata>;
}
interface CartVisibilityOptions {
  cartVisible: boolean;
  cartType?: 'issue' | 'return';
}

const Books: React.FC<PropTypes> = ({ fetchedBooks, booksMetadata }) => {
  const [books] = useState<Array<Book>>(fetchedBooks);
  const [issuedBooks, setIssuedBooks] = useState<Array<Book>>([]);
  const [metadata] = useState<Array<BookMetadata>>(booksMetadata);
  const [hoveringBook, setHoveringBook] = useState<Book | null>(null);
  const [selectedBooks, setSelectedBooks] = useState<Array<Book>>([]);
  const [cartVisibility, setCartVisibility] = useState<CartVisibilityOptions>({
    cartVisible: false,
  });

  const [cookies] = useCookies(['user']);
  const user: UserCookie = cookies.user;

  const getIssuedBooks = async () => {
    // API URL: https://localhost:5001/library/IssuedBooks/1
    const response = await axios.get(
      `${BACKEND_URL}/library/IssuedBooks/${user.userId}`
    );
    const data: Array<Book> = (await response).data;
    setIssuedBooks(data);
  };

  // Memoise getIssuedBooks function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoisedGetBooks = useMemo(() => getIssuedBooks, []);

  useEffect(() => {
    memoisedGetBooks();
  }, [memoisedGetBooks]);

  // Get the first object from the books array and convert the key names to the column names with space when case changes and capitalize the first letter
  const columnNamesFormatted = Object.keys(books[0] || {}).map((key) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
  );

  const [loading] = useState(false);

  const openCart: React.FC<null> = () =>
    cartVisibility.cartType === 'issue' ? (
      <CartDrawer
        visibility={cartVisibility}
        setVisibility={setCartVisibility}
        selectedBooks={[...selectedBooks] as Array<Book>}
        setSelectedBooks={setSelectedBooks}
        booksMetadata={metadata}
        fetchIssuedBooks={getIssuedBooks}
      />
    ) : (
      <CartDrawer
        visibility={cartVisibility}
        setVisibility={setCartVisibility}
        selectedBooks={[...issuedBooks] as Array<Book>}
        setSelectedBooks={setIssuedBooks}
        booksMetadata={metadata}
      />
    );

  return (
    <Layout>
      <Header />
      {loading ? (
        <div className='relative sm:rounded-lg'>
          <div className='m-8 overflow-x-auto rounded-lg shadow-md '>
            <h3>Loading...</h3>
          </div>
        </div>
      ) : (
        <div className='relative backdrop-blur-xl sm:rounded-lg '>
          {cartVisibility.cartVisible && openCart(null, null)}
          <div className='flex justify-center'>
            <button
              type='button'
              className='m-4 inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-50 disabled:blur-sm disabled:hover:bg-gray-400'
              disabled={selectedBooks.length === 0}
              onClick={() =>
                setCartVisibility({ cartVisible: true, cartType: 'issue' })
              }
            >
              Issue Book{selectedBooks.length > 1 && `(s)`}
            </button>
            {issuedBooks.length > 0 && (
              <button
                type='button'
                className='m-4 inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
                onClick={() =>
                  setCartVisibility({ cartVisible: true, cartType: 'return' })
                }
              >
                Return Book{issuedBooks.length > 1 && `(s)`}
              </button>
            )}
          </div>
          <div className='flex items-center justify-center rounded-md bg-red-300 p-5 sm:mx-11 lg:mx-44'>
            <div className='font-SpaceMono font-extrabold sm:text-sm lg:text-2xl'>
              Available Book(s)
            </div>
          </div>
          <div className='m-8 overflow-x-auto overflow-y-auto rounded-lg shadow-md '>
            <table className='w-full text-left text-sm text-gray-500 '>
              <thead className='sticky top-0 bg-gray-50 text-xs uppercase text-gray-700 '>
                <tr className='border-2 border-dotted border-gray-300 bg-[#FFD59A]'>
                  <th
                    scope='col'
                    className='border-2 border-dotted border-gray-300 p-4'
                  >
                    <div className='flex items-center'>
                      <input
                        id='checkbox-all'
                        type='checkbox'
                        className='h-8 w-8 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 '
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) {
                            setSelectedBooks(books);
                          } else {
                            setSelectedBooks([]);
                          }
                        }}
                      />
                      <label htmlFor='checkbox-all' className='sr-only'>
                        Select All
                      </label>
                    </div>
                  </th>
                  {columnNamesFormatted.map((columnName, index) => (
                    <th
                      scope='col'
                      className='border-2 border-dotted border-gray-300 p-4'
                      key={index}
                    >
                      <h5 className='font-extrabold'>{columnName}</h5>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr
                    className='cursor-pointer border-b bg-white hover:bg-gray-50'
                    key={index}
                    onMouseDown={() => setHoveringBook(book)}
                  >
                    <td className='w-4 border-2 border-dotted border-gray-300 p-4'>
                      <div className='flex items-center'>
                        <input
                          id='checkbox-table-1'
                          type='checkbox'
                          checked={selectedBooks.includes(book)}
                          className='h-8 w-8 rounded-3xl border-gray-300 bg-gray-100 text-blue-600 shadow-2xl shadow-orange-500 focus:ring-2 focus:ring-blue-500 '
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) {
                              setSelectedBooks([...selectedBooks, book]);
                            } else {
                              setSelectedBooks(
                                selectedBooks.filter(
                                  (selectedBook) =>
                                    selectedBook.bookId !== book.bookId
                                )
                              );
                            }
                          }}
                        />
                        <label htmlFor='checkbox-table-1' className='sr-only'>
                          checkbox
                        </label>
                      </div>
                    </td>
                    {/* Map through the books */}
                    {Object.values(book).map((value, index) => (
                      <td
                        className='whitespace-nowrap border-2 border-dotted border-gray-300 px-6 py-4 font-medium text-gray-900'
                        key={index}
                      >
                        {/* If index=1 */}
                        {index === 2 || index === 1 ? (
                          <ArrowLink
                            href={`/library/book/${book.googleBookId}`}
                          >
                            {value}
                          </ArrowLink>
                        ) : (
                          value
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr className='mx-auto my-4 h-1 w-48 rounded border-0 bg-purple-800 md:my-10' />
          <div className='mt-3 mb-11 flex items-center justify-center'>
            {hoveringBook && (
              <BookInfoCard
                bookMetadata={
                  // Loop metadata and find the book with the same bookId
                  metadata.find(
                    (bookMetadata) =>
                      bookMetadata.googleBookId === hoveringBook.googleBookId
                  ) as BookMetadata
                }
              />
            )}
          </div>
          <Toaster
            reverseOrder={false}
            gutter={3}
            containerClassName=''
            containerStyle={{}}
            toastOptions={{
              // Define default options
              className: '',
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },

              // Default options for specific types
              success: {
                duration: 2000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
        </div>
      )}
    </Layout>
  );
};

export default Books;

// * P.S: This is a server side run function. Be advised, any browser cookies would not accessible henceforth.
// * Example: Fetching issued books by a user id is not possible, because this function would be run in the server before the javascript is delivered to the browser.
// * Please see the render function, there we can access the browser cookies, and thus get the books issued by the user.
// * Use getstaticprops to fetch the books
export const getStaticProps: GetStaticProps = async () => {
  let books: Array<Book> = [];

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
  }

  // Fetch books metadata
  const booksMetadata: Array<BookMetadata> = [];
  await Promise.all(
    response.data.map(async (book) => {
      // Add delay of 300ms
      await new Promise((resolve) => setTimeout(resolve, 300));
      const bookMetadata: BookMetadata = await getMetadata(book.googleBookId);
      booksMetadata.push(bookMetadata);
    })
  );

  const { data } = response;
  books = data;

  return {
    props: {
      fetchedBooks: books,
      booksMetadata,
    },
    revalidate: 30,
  };
};
