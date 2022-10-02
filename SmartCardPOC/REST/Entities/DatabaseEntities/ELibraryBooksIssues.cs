using System;

namespace REST.Entities.DatabaseEntities
{
    public class ELibraryBooksIssues
    {
        /*
        CREATE TABLE LIBRARY_BOOKS_ISSUES
          (
              ISSUE_ID    SERIAL,
              BOOK_ID     INTEGER NOT NULL,
              USER_ID     INTEGER NOT NULL,
              ISSUE_DATE  DATE    NOT NULL DEFAULT CURRENT_DATE,
              RETURN_DATE DATE    NOT NULL DEFAULT CURRENT_DATE,
              CONSTRAINT LIBRARY_BOOKS_ISSUES_PK PRIMARY KEY (BOOK_ID, USER_ID),
              CONSTRAINT LIBRARY_BOOKS_ISSUES_FK1 FOREIGN KEY (BOOK_ID) REFERENCES LIBRARY_BOOKS (BOOK_ID),
              CONSTRAINT LIBRARY_BOOKS_ISSUES_FK2 FOREIGN KEY (USER_ID) REFERENCES USERS (USER_ID)
          );
        */
        public int IssueId { get; set; }
        public int BookId { get; set; }
        public int UserId { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime ReturnDate { get; set; }
    }
}
