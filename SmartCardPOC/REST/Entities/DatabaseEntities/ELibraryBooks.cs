using System;

namespace REST.Entities.DatabaseEntities
{
    public class ELibraryBooks
    {
        /* CREATE TABLE LIBRARY_BOOKS
          (
            BOOK_ID     SERIAL,
            GOOGLE_BOOK_ID VARCHAR(50) NOT NULL UNIQUE,
            BOOK_TITLE  VARCHAR(50) NOT NULL,
            BOOK_AUTHOR VARCHAR(50) NOT NULL,
            BOOK_ISBN   VARCHAR(50) NOT NULL,
            BOOK_YEAR   INTEGER     NOT NULL,
            BOOK_COUNT  INTEGER     NOT NULL,
            ENTRY_DATE  DATE        NOT NULL DEFAULT CURRENT_DATE,
            SHELF_ID    INTEGER     NOT NULL,
            CONSTRAINT LIBRARY_BOOKS_PK PRIMARY KEY (BOOK_ID)
          ); */
        public int BookId { get; set; }
        public string GoogleBookId { get; set; }
        public string BookTitle { get; set; }
        public string BookAuthor { get; set; }
        public string BookIsbn { get; set; }
        public int BookYear { get; set; }
        public int BookCount { get; set; }
        public DateTime EntryDate { get; set; }
        public int ShelfId { get; set; }
    }
}
