using System;

namespace REST.Entities.DatabaseEntities
{
    public class ELibraryBooksReturned
    {
        /*
        CREATE TABLE LIBRARY_BOOKS_RETURNED
          (
              RETURN_ID   SERIAL,
              BOOK_ID     INTEGER NOT NULL,
              USER_ID     INTEGER NOT NULL,
              RETURN_DATE DATE    NOT NULL DEFAULT CURRENT_DATE,
              CONSTRAINT LIBRARY_BOOKS_RETURNED_PK PRIMARY KEY (RETURN_ID),
              CONSTRAINT LIBRARY_BOOKS_RETURNED_FK1 FOREIGN KEY (BOOK_ID) REFERENCES LIBRARY_BOOKS (BOOK_ID),
              CONSTRAINT LIBRARY_BOOKS_RETURNED_FK2 FOREIGN KEY (USER_ID) REFERENCES USERS (USER_ID)
          );
        */
        public int ReturnId { get; set; }
        public int BookId { get; set; }
        public int UserId { get; set; }
        public DateTime ReturnDate { get; set; }
    }
}
