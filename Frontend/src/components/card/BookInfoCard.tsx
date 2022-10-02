import Image from 'next/image';

import { BookMetadata } from '@/utils/libraryBooks';

const BookInfoCard = ({ bookMetadata }: { bookMetadata: BookMetadata }) => {
  // const [book, setBook] = useState<BookMetadata | null>(null);

  // // Memoise the function to prevent it from being called multiple times
  // const memoisedGetMetadata = useMemo(() => getMetadata, []);

  // useEffect(() => {
  //   // Immediately invoked async function
  //   (async () => {
  //     const book = await memoisedGetMetadata(bookId);
  //     setBook(book);
  //   })();
  // }, [bookId, memoisedGetMetadata]);

  return bookMetadata ? (
    <a
      href='#'
      className='flex w-full flex-col items-center space-x-2 rounded-lg border bg-white shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:max-w-xl md:flex-row'
    >
      <Image
        className='rounded-md md:h-auto md:w-48 md:rounded-none md:rounded-l-lg'
        src={bookMetadata.thumbnail}
        alt=''
        height={2000}
        // placeholder='blur'
        // blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        width={1500}
      />
      <div className='flex flex-col justify-between p-4 leading-normal'>
        <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          {bookMetadata.title}
        </h5>
        <div className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
          {/* Dangerously set innerhtml */}
          <div dangerouslySetInnerHTML={{ __html: bookMetadata.description }} />
        </div>
      </div>
    </a>
  ) : (
    <div>Loading...</div>
  );
};

export default BookInfoCard;
