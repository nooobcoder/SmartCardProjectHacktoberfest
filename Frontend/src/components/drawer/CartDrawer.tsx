import axios from 'axios';
import Image from 'next/image';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';

import type { Book, UserCookie } from '@/utils/consts';
import { BACKEND_URL } from '@/utils/consts';
import type { BookMetadata } from '@/utils/libraryBooks';

interface CartVisibilityOptions {
  cartVisible: boolean;
  cartType?: 'issue' | 'return';
}

// Prop types
interface PropTypes {
  setVisibility: (optns: CartVisibilityOptions) => void;
  visibility: CartVisibilityOptions;
  selectedBooks: Array<Book>;
  setSelectedBooks?: ((books: Array<Book>) => void) | null;
  booksMetadata: Array<BookMetadata>;
  fetchIssuedBooks?: (() => void) | null;
}

const CartDrawer: React.FC<PropTypes> = ({
  visibility,
  setVisibility,
  selectedBooks,
  booksMetadata,
  setSelectedBooks,
  fetchIssuedBooks,
}: PropTypes) => {
  // Get the user from the cookies
  const [cookies] = useCookies(['user']);
  const user: UserCookie = cookies.user;

  // const memoisedGetMetadata = useMemo(() => getMetadata, []);

  // useEffect(() => {
  //   // Loop selectedBooks and set thumbnail to bookMetadata[index]?.thumbnail
  //   selectedBooks.map(async (book) => {
  //     const { thumbnail } = await memoisedGetMetadata(book.googleBookId);
  //     book.thumbnail = thumbnail;
  //   });
  // }, [selectedBooks, memoisedGetMetadata]);

  selectedBooks.map((book) => {
    const metadata = booksMetadata.find(
      (metadata) => metadata.googleBookId === book.googleBookId
    );
    book.thumbnail = metadata?.thumbnail;
  });

  const requiredColumnNames = [
    'ID',
    'Book Title',
    'Book Author',
    'ISBN',
    'Image',
  ];

  // IssueBook URL: https://127.0.0.1:5001/library/IssueBook
  const issueBooks = async () => {
    // Get the ids of the selected books
    const bookIds = selectedBooks.map((book) => book.bookId);

    try {
      const response = await axios.post(`${BACKEND_URL}/library/IssueBook`, {
        UserId: user.userId,
        BookIds: bookIds,
      });

      // If the response is successful, set the visibility to false, and toast a success message
      if (response.status === 200) {
        if (setSelectedBooks !== null && setSelectedBooks !== undefined)
          setSelectedBooks([]);
        setVisibility({ ...visibility, cartVisible: false });

        if (fetchIssuedBooks !== null && fetchIssuedBooks !== undefined) {
          // Fetch the issued books to enable the return book button
          fetchIssuedBooks();
        }

        if (response.data > 0)
          toast.success(`${response.data} Books issued successfully.`, {
            position: 'top-right',
          });
        else
          toast.error(
            `No books issued. Please check if you have already issued three books.`,
            { position: 'top-right' }
          );
      } else {
        toast.error('An error occurred.');
      }
    } catch (e) {
      // Check if AxiosError
      if (axios.isAxiosError(e)) {
        if (e.response) {
          toast.error(e.response.data as string, { position: 'top-right' });
        }
      }
    }
  };

  // Function to return book issued by the user
  // ReturnBook URL: https://localhost:5001/library/ReturnBook
  const returnBooks = async () => {
    // Get the ids of the selected books
    const BookIds = selectedBooks.map((book) => book.bookId);
    const UserId = user.userId;

    try {
      const response = await axios.delete(`${BACKEND_URL}/library/ReturnBook`, {
        data: {
          UserId,
          BookIds,
        },
      });

      // If the response is successful, set the visibility to false, and toast a success message
      if (response.status === 200) {
        if (setSelectedBooks !== null && setSelectedBooks !== undefined)
          setSelectedBooks([]);
        setVisibility({ ...visibility, cartVisible: false });

        if (response.data > 0)
          toast.success(
            `${selectedBooks.length} Books returned successfully.`,
            { position: 'top-right' }
          );
        else
          toast.error(
            `No books returned. Please check if you have issued any book(s).`,
            { position: 'top-right' }
          );
      } else {
        toast.error('An error occurred.', { position: 'top-right' });
      }
    } catch (e) {
      // Check if AxiosError
      if (axios.isAxiosError(e)) {
        if (e.response) {
          toast.error(e.response.data as string);
        }
      }
    }
  };

  return (
    selectedBooks && (
      <div
        id='drawer-top-example'
        className='max-w-1/2 fixed z-40 ml-2 h-full overflow-auto rounded-xl bg-yellow-100 p-4 '
        tabIndex={-1}
        aria-labelledby='drawer-top-label'
      >
        <h4
          id='drawer-top-label'
          className='text-black-500 mb-4 inline-flex items-center text-base font-semibold hover:underline'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='rgb(22 101 52 / var(--tw-bg-opacity)'
            className='mr-8 h-11 w-11 '
          >
            <path
              fillRule='evenodd'
              d='M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z'
              clipRule='evenodd'
            />
          </svg>
          Your {visibility.cartType} Item{selectedBooks?.length > 1 ? 's' : ''}
        </h4>
        <div className='my-3 flex flex-col items-center bg-gray-800 text-3xl text-yellow-500'>
          <h4 className=''>Your User ID: {cookies.user.userId}</h4>
        </div>

        <button
          type='button'
          onClick={() => setVisibility({ ...visibility, cartVisible: false })}
          data-drawer-dismiss='drawer-top-example'
          aria-controls='drawer-top-example'
          className='absolute top-2.5 right-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 '
        >
          <svg
            aria-hidden='true'
            className='h-5 w-5'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            ></path>
          </svg>
          <span className='sr-only'>Close menu</span>
        </button>
        <div className='overflow-x-auto overflow-y-auto'>
          <table className='text-clip text-left text-sm text-gray-500 '>
            <thead className='sticky top-0 bg-gray-50 text-xs uppercase text-gray-700 '>
              <tr className='border-2 border-dotted border-gray-300 bg-[#FFD59A]'>
                {requiredColumnNames.map((columnName, index) => (
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
              {selectedBooks.map((book, index) => (
                <tr
                  className='cursor-pointer border-b bg-white hover:bg-gray-50'
                  key={index}
                >
                  <td
                    className='whitespace-nowrap border-2 border-dotted border-gray-300 px-6 py-4 font-medium text-gray-900'
                    key={index}
                  >
                    {book.bookId}
                  </td>
                  <td
                    className='max-w-11 whitespace-nowrap border-2 border-dotted border-gray-300 px-6 py-4 font-medium text-gray-900'
                    key={index}
                  >
                    {book.bookTitle}
                  </td>
                  <td
                    className='whitespace-nowrap border-2 border-dotted border-gray-300 px-6 py-4 font-medium text-gray-900'
                    key={index}
                  >
                    {book.bookAuthor}
                  </td>
                  <td
                    className='whitespace-nowrap border-2 border-dotted border-gray-300 px-6 py-4 font-medium text-gray-900'
                    key={index}
                  >
                    {book.bookIsbn}
                  </td>
                  <td
                    className='whitespace-nowrap border-2 border-dotted border-gray-300 px-6 py-4 font-medium text-gray-900'
                    key={index}
                  >
                    {book?.thumbnail ? (
                      <Image
                        src={book?.thumbnail || `/images/new-tab.png`}
                        alt='book-thumbnail'
                        width={50}
                        height={80}
                      />
                    ) : (
                      <div role='status'>
                        <svg
                          aria-hidden='true'
                          className='mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600'
                          viewBox='0 0 100 101'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                            fill='currentColor'
                          />
                          <path
                            d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                            fill='currentFill'
                          />
                        </svg>
                        <span className='sr-only'>Loading...</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className='mt-4 mb-6 max-w-lg text-sm text-gray-500 '>
          You can issue only three books at a time. Kindly return your older
          books, if you want to issue new books.
        </p>
        <a
          href='#'
          className='mr-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 '
          onClick={() => setVisibility({ ...visibility, cartVisible: false })}
        >
          Close
        </a>
        <a
          href='#'
          className='inline-flex items-center rounded-lg bg-teal-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-blue-300 '
          onClick={visibility.cartType === 'issue' ? issueBooks : returnBooks}
        >
          {visibility.cartType === 'issue' ? `Issue` : `Return`} Books 📚
          <svg
            className='ml-2 h-4 w-4'
            aria-hidden='true'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </a>
      </div>
    )
  );
};

export default CartDrawer;
