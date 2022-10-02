using System;
using Newtonsoft.Json;
using Npgsql;
using REST.Entities.DatabaseEntities;

namespace REST.Converters.Database
{
    public class DatabaseConverters
    {
        public ESubject ReadSubject(NpgsqlDataReader reader)
        {
            int? s_id = reader["subject_id"] as int?;
            string s = reader["subject"] as string;

            ESubject obj = new ESubject { SubjectId = s_id.Value, Subject = s };

            return obj;
        }

        public ELeaveType ReadLeaveType(NpgsqlDataReader reader)
        {
            int? l_type_id = reader["leave_type_id"] as int?;
            string l_type = reader["leave_type"] as string;

            ELeaveType obj = new ELeaveType { LeaveTypeId = l_type_id.Value, LeaveType = l_type };

            return obj;
        }

        public EUser ReadUser(NpgsqlDataReader reader)
        {
            /*
             * CREATE TABLE USERS
                (
                    USER_ID  SERIAL PRIMARY KEY,
                    USERNAME VARCHAR(50) NOT NULL UNIQUE CHECK (USERNAME <> ''),
                    PIN      VARCHAR(200) NOT NULL,
                    ROLE     VARCHAR(50) NOT NULL REFERENCES USER_PRIVILEGES (ROLE)
                );
            */

            int? user_id = reader["user_id"] as int?;
            string username = reader["username"] as string;
            string pin = reader["pin"] as string;
            string role = reader["role"] as string;

            EUser user = new EUser
            {
                UserId = user_id.Value,
                Username = username,
                Pin = pin,
                Role = role
            };

            return user;
        }

        // ReadStudentPersonalDetail
        public EStudentPersonalDetail ReadStudentPersonalDetail(NpgsqlDataReader reader)
        {
            /*
             CREATE TABLE STUDENT_PERSONAL_DETAILS
            (
                USER_ID INTEGER REFERENCES USERS (USER_ID),
                CLASS   VARCHAR(50)  NOT NULL,
                SECTION VARCHAR(50)  NOT NULL,
                ROLL_NO INTEGER      NOT NULL,
                ADDRESS VARCHAR(120) NOT NULL,
                PHONE   VARCHAR(50)  NOT NULL,
                EMAIL   VARCHAR(50)  NOT NULL,
            );
             */
            int? user_id = reader["user_id"] as int?;
            string class_name = reader["class"] as string;
            string section = reader["section"] as string;
            int? roll_no = reader["roll_no"] as int?;
            string address = reader["address"] as string;
            string phone = reader["phone"] as string;
            string email = reader["email"] as string;

            EStudentPersonalDetail student = new EStudentPersonalDetail
            {
                UserId = user_id.Value,
                Class = class_name,
                Section = section,
                RollNo = roll_no.Value,
                Address = address,
                Phone = phone,
                Email = email
            };
            Console.WriteLine(JsonConvert.SerializeObject(student));

            return student;
        }

        // ReadLibraryBook
        public ELibraryBooks ReadLibraryBook(NpgsqlDataReader reader)
        {
            /*
            CREATE TABLE LIBRARY_BOOKS
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
            );
            */
            int? book_id = reader["book_id"] as int?;
            string google_book_id = reader["google_book_id"] as string;
            string book_title = reader["book_title"] as string;
            string book_author = reader["book_author"] as string;
            string book_isbn = reader["book_isbn"] as string;
            int? book_year = reader["book_year"] as int?;
            int? book_count = reader["book_count"] as int?;
            DateTime? entry_date = reader["entry_date"] as DateTime?;
            int? shelf_id = reader["shelf_id"] as int?;

            ELibraryBooks book = new ELibraryBooks
            {
                BookId = book_id.Value,
                GoogleBookId = google_book_id,
                BookTitle = book_title,
                BookAuthor = book_author,
                BookIsbn = book_isbn,
                BookYear = book_year.Value,
                BookCount = book_count.Value,
                EntryDate = entry_date.Value,
                ShelfId = shelf_id.Value
            };

            return book;
        }

        // ReadExamScore
        public EExamScore ReadExamScore(NpgsqlDataReader reader,int serial)
        {
            /*
            CREATE TABLE EXAM_SCORES
            (
                USER_ID INTEGER REFERENCES USERS (USER_ID),
                SUBJECT_ID INTEGER REFERENCES SUBJECTS (SUBJECT_ID),
                EXAM_TYPE VARCHAR(50) NOT NULL,
                EXAM_YEAR INTEGER NOT NULL,
                EXAM_SCORE INTEGER NOT NULL,
                CONSTRAINT EXAM_SCORES_PK PRIMARY KEY (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_YEAR)
            );
            */

            int? student_id = reader["o_student_id"] as int?;
            int? subject_id = reader["o_subject_id"] as int?;
            string exam_type = reader["o_exam_type"] as string;
            string subject_name = reader["o_subject_name"] as string;
            int? exam_year = reader["o_exam_year"] as int?;
            int? exam_score = reader["o_exam_score"] as int?;

            EExamScore exam = new EExamScore
            {
                SerialNumber = serial +1,
                StudentId = student_id.HasValue ? student_id.Value : 0,
                // user_id.value can be null, store null otherwise
                SubjectName = subject_name,
                SubjectId = subject_id.HasValue ? subject_id.Value : 0,
                ExamType = exam_type,
                ExamYear = exam_year.Value,
                ExamScore = exam_score.Value
            };

            return exam;
        }
    }
}
