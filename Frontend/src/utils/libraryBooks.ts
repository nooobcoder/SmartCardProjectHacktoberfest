import axios from 'axios';

interface BookMetadata {
  title: string;
  description: string;
  thumbnail: string;
  googleBookId: string;
  authors: string[];
  extraLargeThumbnail: string;
}

const getMetadata = async (bookId: string): Promise<BookMetadata> => {
  const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
  // Delay of 500ms
  const response = await axios.get(
    `https://www.googleapis.com/books/v1/volumes/${bookId}`,
    // URL parameters
    {
      params: {
        key: GOOGLE_BOOKS_API_KEY,
        projection: `lite`,
      },
    }
  );
  const { data } = response;
  // Get thumbnail, title, description
  const { id: googleBookId } = data;
  const { title, description } = data.volumeInfo;
  const authors = data.volumeInfo.authors;
  // Get thumbnail
  const { thumbnail, extraLarge } = data.volumeInfo.imageLinks;
  return {
    title,
    description,
    thumbnail,
    googleBookId,
    authors,
    extraLargeThumbnail: extraLarge || null,
  };
};

export { getMetadata };
export type { BookMetadata };
