-- POSTGRES

-- Get DDL for a table
SELECT 'CREATE TABLE ' || relname || E'\n(\n' ||
       array_to_string(
               array_agg(
                       '    ' || column_name || ' ' || type || ' ' || not_null
                   )
           , E',\n'
           ) || E'\n);\n'
from (SELECT c.relname,
             a.attname                                       AS column_name,
             pg_catalog.format_type(a.atttypid, a.atttypmod) as type,
             case
                 when a.attnotnull
                     then 'NOT NULL'
                 else 'NULL'
                 END                                         as not_null
      FROM pg_class c,
           pg_attribute a,
           pg_type t
      WHERE c.relname = 'subjects'
        AND a.attnum > 0
        AND a.attrelid = c.oid
        AND a.atttypid = t.oid
      ORDER BY a.attnum) as tabledefinition
group by relname;

-- Set date and time as Asia/Kolkata of the database
CREATE OR REPLACE FUNCTION set_tz() RETURNS TRIGGER AS
$$
BEGIN
    EXECUTE 'SET TIME ZONE ' || quote_literal('Asia/Kolkata');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- GET table description
SELECT table_name,
       column_name,
       data_type
FROM information_schema.columns
WHERE table_name = 'user_privileges';


-- CREATE TABLE
-- Table for user privileges
DROP TABLE IF EXISTS USER_PRIVILEGES;
CREATE TABLE USER_PRIVILEGES
(
    ROLE_ID                SERIAL PRIMARY KEY,
    ROLE                   VARCHAR(50) UNIQUE NOT NULL,
    PERSONAL_DETAILS_READ  BOOLEAN            NOT NULL,
    PERSONAL_DETAILS_WRITE BOOLEAN            NOT NULL,
    ATTENDANCE_READ        BOOLEAN            NOT NULL,
    ATTENDANCE_WRITE       BOOLEAN            NOT NULL,
    LIBRARY_INFO_READ      BOOLEAN            NOT NULL,
    LIBRARY_INFO_WRITE     BOOLEAN            NOT NULL,
    EXAM_SCORE_READ        BOOLEAN            NOT NULL,
    EXAM_SCORE_WRITE       BOOLEAN            NOT NULL,
    STUDENT_LOCATION_READ  BOOLEAN            NOT NULL,
    STUDENT_MONEY_POINTS   BOOLEAN            NOT NULL,
    SCHOOL_BUS_ATTENDANCE  BOOLEAN            NOT NULL
);

INSERT INTO USER_PRIVILEGES (ROLE, PERSONAL_DETAILS_READ, PERSONAL_DETAILS_WRITE, ATTENDANCE_READ, ATTENDANCE_WRITE,
                             LIBRARY_INFO_READ, LIBRARY_INFO_WRITE, EXAM_SCORE_READ, EXAM_SCORE_WRITE,
                             STUDENT_LOCATION_READ, STUDENT_MONEY_POINTS, SCHOOL_BUS_ATTENDANCE)
VALUES ('STU', TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, TRUE),
       ('TEA', TRUE, FALSE, TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, TRUE),
       ('PAR', TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE, TRUE),
       ('ADM', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);

-- Create table to store users with encrypted pins
DROP TABLE IF EXISTS USERS;
CREATE TABLE USERS
(
    USER_ID  SERIAL PRIMARY KEY,
    USERNAME VARCHAR(50)  NOT NULL UNIQUE CHECK (USERNAME <> ''),
    PIN      VARCHAR(200) NOT NULL,
    ROLE     VARCHAR(50)  NOT NULL REFERENCES USER_PRIVILEGES (ROLE)
);

INSERT INTO USERS (USERNAME, PIN, ROLE)
VALUES ('admin', 201023, 'ADM'); -- 1234
INSERT INTO USERS (USERNAME, PIN, ROLE)
VALUES ('ankurpaul', 197900, 'ADM'); -- 4321
INSERT INTO USERS (USERNAME, PIN, ROLE)
VALUES ('user1', 197571, 'TEA'); -- 5678
INSERT INTO USERS (USERNAME, PIN, ROLE)
VALUES ('student', 204099, 'STU'); -- 2222
INSERT INTO USERS (USERNAME, PIN, ROLE)
VALUES ('parent', 204099, 'PAR');

-- Create a function to create a new user and return the id of the newly created user.
DROP FUNCTION IF EXISTS create_user;
CREATE OR REPLACE FUNCTION create_user(username VARCHAR(50), pin VARCHAR(50), role VARCHAR(50))
    RETURNS INT
AS
$$
DECLARE
    r_user_id INT;
BEGIN
    INSERT INTO USERS (USERNAME, PIN, ROLE)
    VALUES (username, pin, role)
    RETURNING USER_ID INTO r_user_id;
    RETURN r_user_id;
END;
$$ LANGUAGE plpgsql;

-- Run the function
SELECT create_user('rohit', '1234', 'STU');

-- Create function to delete user returning the id of the deleted user
DROP FUNCTION delete_user();
CREATE OR REPLACE FUNCTION delete_user(i_user_id INT)
    RETURNS INT
AS
$$
DELETE
FROM USERS
WHERE USER_ID = $1
RETURNING USER_ID;
$$ LANGUAGE SQL;


-- Call the function
SELECT delete_user(23);

-- Create table to store leave types in attendance table
DROP TABLE IF EXISTS LEAVE_TYPES;
CREATE TABLE LEAVE_TYPES
(
    LEAVE_TYPE_ID SERIAL PRIMARY KEY,
    LEAVE_TYPE    VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO LEAVE_TYPES (LEAVE_TYPE)
VALUES ('SICK LEAVE'),
       ('ABSENT'),
       ('PRESENT'),
       ('LEAVE'),
       ('HOLIDAY');

-- Create Attendance table to store attendance of students in dd-mm-yyyy format
DROP TABLE IF EXISTS ATTENDANCE;
CREATE TABLE ATTENDANCE
(
    ATTENDANCE_ID SERIAL PRIMARY KEY,
    USER_ID       INTEGER REFERENCES USERS (USER_ID) ON DELETE CASCADE,
    DATE          DATE        NOT NULL DEFAULT CURRENT_DATE,
    TIME          TIME        NOT NULL DEFAULT CURRENT_TIME,
    STATUS        VARCHAR(50) NOT NULL REFERENCES LEAVE_TYPES (LEAVE_TYPE)
);

-- Prevent insert duplicate date and id into Attendance
CREATE UNIQUE INDEX ATTENDANCE_DATE_ID_UNIQUE ON ATTENDANCE (DATE, USER_ID);

-- Insert Data into Attendance
INSERT INTO ATTENDANCE (USER_ID, STATUS)
VALUES (1, 'SICK LEAVE');
INSERT INTO ATTENDANCE (user_id, date, time, status)
VALUES (2, '2022-04-18', '12:00:00', 'PRESENT');
INSERT INTO ATTENDANCE (user_id, date, time, status)
VALUES (2, '2021-11-26', '12:00:00', 'ABSENT');
INSERT INTO ATTENDANCE (user_id, date, time, status)
VALUES (3, '2021-01-26', '12:00:00', 'PRESENT');
INSERT INTO ATTENDANCE (user_id, date, time, status)
VALUES (3, '2021-10-26', '12:00:00', 'ABSENT');
INSERT INTO ATTENDANCE (user_id, date, time, status)
VALUES (3, '2021-11-22', '12:00:00', 'PRESENT');
INSERT INTO ATTENDANCE (user_id, date, time, status)
VALUES (3, '2021-03-26', '12:00:00', 'ABSENT');
INSERT INTO ATTENDANCE (user_id, date, time, status)
VALUES (3, '2022-08-10', '12:00:00', 'ABSENT');
INSERT INTO ATTENDANCE (user_id, date, time, status)
VALUES (3, '2022-08-11', '12:00:00', 'ABSENT');
INSERT INTO ATTENDANCE (user_id, date, time, status)
VALUES (3, '2022-08-12', '12:00:00', 'ABSENT');
INSERT INTO ATTENDANCE (user_id, date, time, status)
VALUES (3, '2022-08-13', '12:00:00', 'ABSENT');
INSERT INTO ATTENDANCE (user_id, date, time, status)
VALUES (3, '2022-08-14', '12:00:00', 'ABSENT');
INSERT INTO ATTENDANCE (USER_ID, STATUS)
VALUES (2, 'ABSENT');


-- Create table for student personal details
DROP TABLE IF EXISTS STUDENT_PERSONAL_DETAILS;
CREATE TABLE STUDENT_PERSONAL_DETAILS
(
    USER_ID INTEGER REFERENCES USERS (USER_ID) ON DELETE CASCADE,
    CLASS   VARCHAR(50)  NOT NULL,
    SECTION VARCHAR(50)  NOT NULL,
    ROLL_NO INTEGER      NOT NULL,
    ADDRESS VARCHAR(120) NOT NULL,
    PHONE   VARCHAR(50)  NOT NULL,
    EMAIL   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (USER_ID),
    FOREIGN KEY (USER_ID) REFERENCES USERS (USER_ID),
    UNIQUE (ROLL_NO),
    CHECK (ROLL_NO >= 0),
    -- Check email correct format or not
    CHECK (EMAIL ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')
);

INSERT INTO STUDENT_PERSONAL_DETAILS (USER_ID, CLASS, SECTION, ROLL_NO, ADDRESS, PHONE, EMAIL)
VALUES (1, '1st', 'A', 1, 'B-1, Sector-1, Noida', '1234567890', 'abcd@example.com');
INSERT INTO STUDENT_PERSONAL_DETAILS (USER_ID, CLASS, SECTION, ROLL_NO, ADDRESS, PHONE, EMAIL)
VALUES (2, '1st', 'A', 2, '2nd Floor, 69/71, Dol Bin Shir Bldg, Janmabhoomi Marg, Fort', '6541286486', 'xyz@story.com');

-- Table for subjects taught in school
DROP TABLE IF EXISTS SUBJECTS;
CREATE TABLE SUBJECTS
(
    SUBJECT_ID SERIAL PRIMARY KEY,
    SUBJECT    VARCHAR(50) NOT NULL UNIQUE
);
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('MATHS');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('SCIENCE');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('ENGLISH');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('HINDI');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('SOCIAL SCIENCE');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('COMPUTER SCIENCE');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('PHYSICAL EDUCATION');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('ARTS');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('MUSIC');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('GEOGRAPHY');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('HISTORY');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('ECONOMICS');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('BIOLOGY');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('CHEMISTRY');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('PHYSICS');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('ACCOUNTANCY');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('BUSINESS STUDIES');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('COMMERCE');
INSERT INTO SUBJECTS (SUBJECT)
VALUES ('BANKING');


-- Database for exam scores of students
DROP TABLE IF EXISTS EXAM_SCORES;
CREATE TABLE EXAM_SCORES
(
    USER_ID    INTEGER REFERENCES USERS (USER_ID),
    SUBJECT_ID INTEGER REFERENCES SUBJECTS (SUBJECT_ID),
    EXAM_TYPE  VARCHAR(50) NOT NULL,
    EXAM_SCORE INTEGER     NOT NULL,
    EXAM_YEAR  INTEGER     NOT NULL CHECK (EXAM_YEAR > 1949),
    PRIMARY KEY (USER_ID, SUBJECT_ID, EXAM_TYPE),
    CHECK (EXAM_SCORE >= 0 AND EXAM_SCORE <= 100)
);

-- Insert Data into Exam Scores
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (1, 1, 'TERM 1', 80, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (1, 1, 'TERM 2', 70, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (2, 2, 'TERM 1', 80, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (2, 2, 'TERM 2', 70, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (3, 3, 'TERM 1', 80, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (3, 3, 'TERM 2', 70, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (3, 4, 'TERM 1', 80, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (3, 4, 'TERM 2', 70, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (3, 5, 'TERM 1', 80, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (1, 5, 'TERM 2', 70, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (1, 6, 'TERM 1', 80, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (1, 6, 'TERM 2', 70, 2021);
INSERT INTO EXAM_SCORES (USER_ID, SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR)
VALUES (1, 6, 'TERM 4', 70, 2021);

-- Create a function to get all rows from exam_scores returning serial number of the rows, student_id, subject_id, subject_name, exam_score, exam_type, exam_year
DROP FUNCTION get_all_exam_scores();
CREATE OR REPLACE FUNCTION get_all_exam_scores()
    RETURNS TABLE
            (
                serial_no      BIGINT,
                o_student_id   INTEGER,
                o_subject_id   INTEGER,
                o_subject_name VARCHAR(50),
                o_exam_score   INTEGER,
                o_exam_type    VARCHAR(50),
                o_exam_year    INTEGER
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT ROW_NUMBER()
               OVER (ORDER BY EXAM_SCORES.USER_ID, EXAM_SCORES.SUBJECT_ID, EXAM_SCORES.EXAM_TYPE) AS serial_no,
               EXAM_SCORES.USER_ID,
               EXAM_SCORES.SUBJECT_ID,
               SUBJECTS.SUBJECT,
               EXAM_SCORES.EXAM_SCORE,
               EXAM_SCORES.EXAM_TYPE,
               EXAM_SCORES.EXAM_YEAR
        FROM EXAM_SCORES
                 JOIN SUBJECTS ON EXAM_SCORES.SUBJECT_ID = SUBJECTS.SUBJECT_ID;
END;
$$
    LANGUAGE plpgsql;

-- Call the function
SELECT *
FROM get_all_exam_scores();

-- Create function to get exam scores of a student, and return serial numbers of them
DROP FUNCTION get_exam_scores;
CREATE OR REPLACE FUNCTION get_exam_scores(IN i_user_id INTEGER)
    RETURNS TABLE
            (
                serial_no      BIGINT,
                o_student_id   INTEGER,
                o_subject_id   INTEGER,
                o_subject_name VARCHAR(50),
                o_exam_score   INTEGER,
                o_exam_type    VARCHAR(50),
                o_exam_year    INTEGER
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT ROW_NUMBER() OVER (ORDER BY EXAM_TYPE,EXAM_YEAR ) AS serial_no,
               USER_ID,
               EXAM_SCORES.SUBJECT_ID                            AS o_subject_id,
               SUBJECT,
               EXAM_SCORE,
               EXAM_TYPE,
               EXAM_YEAR
        FROM EXAM_SCORES
                 JOIN SUBJECTS ON EXAM_SCORES.SUBJECT_ID = SUBJECTS.SUBJECT_ID
        WHERE USER_ID = i_user_id;
END;
$$
    LANGUAGE plpgsql;


-- Call the function
SELECT *
FROM get_exam_scores(1);

-- Create a function to get the marks of a student in a particular subject returning serial number of the rows, student_id, subject_id, exam_score, exam_type, exam_year
DROP FUNCTION get_marks_of_student_in_subject(i_student_id INTEGER, i_subject_id INTEGER);
CREATE OR REPLACE FUNCTION get_marks_of_student_in_subject(IN i_student_id INTEGER, IN i_subject_id INTEGER)
    RETURNS TABLE
            (
                serial_no      BIGINT,
                o_student_id   INTEGER,
                o_subject_id   INTEGER,
                o_subject_name VARCHAR(50),
                o_exam_score   INTEGER,
                o_exam_type    VARCHAR(50),
                o_exam_year    INTEGER
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT ROW_NUMBER() OVER (ORDER BY EXAM_YEAR, EXAM_TYPE) AS o_serial_no,
               USER_ID,
               EXAM_SCORES.SUBJECT_ID                            AS o_subject_id,
               SUBJECT,
               EXAM_SCORE,
               EXAM_TYPE,
               EXAM_YEAR
        FROM EXAM_SCORES
                 JOIN SUBJECTS ON EXAM_SCORES.SUBJECT_ID = SUBJECTS.SUBJECT_ID
        WHERE USER_ID = i_student_id
          AND EXAM_SCORES.SUBJECT_ID = i_subject_id;
END;
$$ LANGUAGE plpgsql;

-- Call the function
SELECT *
FROM get_marks_of_student_in_subject(2, 2);

-- Create a function to get the marks of a student in a particular term
DROP FUNCTION get_marks_of_student_in_term(i_student_id INTEGER, i_term VARCHAR(50));
CREATE OR REPLACE FUNCTION get_marks_of_student_in_term(IN i_student_id INTEGER, IN i_term VARCHAR(50))
    RETURNS TABLE
            (
                o_subject_id INTEGER,
                o_exam_type  VARCHAR(50),
                o_exam_score INTEGER,
                o_exam_year  INTEGER
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR
        FROM EXAM_SCORES
        WHERE USER_ID = i_student_id
          AND EXAM_TYPE = i_term;
END;
$$ LANGUAGE plpgsql;

-- Call the function
SELECT *
FROM get_marks_of_student_in_term(1, 'TERM 1');

-- Create a function to get the marks of a student in an array of years
DROP FUNCTION get_marks_of_student_in_years(i_student_id INTEGER, i_years INTEGER[]);
CREATE OR REPLACE FUNCTION get_marks_of_student_in_years(IN i_student_id INTEGER, IN i_years INTEGER[])
    RETURNS TABLE
            (
                o_subject_id INTEGER,
                o_exam_type  VARCHAR(50),
                o_exam_score INTEGER,
                o_exam_year  INTEGER
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT SUBJECT_ID, EXAM_TYPE, EXAM_SCORE, EXAM_YEAR
        FROM EXAM_SCORES
        WHERE USER_ID = i_student_id
          AND EXAM_YEAR = ANY (i_years);
END;
$$ LANGUAGE plpgsql;


-- Call the function
SELECT *
FROM get_marks_of_student_in_years(1, ARRAY [2021, 2020]);

-- View to show marks of students with subject name from the subjects table
DROP VIEW IF EXISTS STUDENT_MARKS;
CREATE VIEW STUDENT_MARKS AS
SELECT USERS.USER_ID,
       USERS.USERNAME,
       SUBJECTS.SUBJECT,
       EXAM_SCORES.EXAM_TYPE,
       EXAM_SCORES.EXAM_SCORE,
       EXAM_SCORES.EXAM_YEAR
FROM USERS
         INNER JOIN EXAM_SCORES ON USERS.USER_ID = EXAM_SCORES.USER_ID
         INNER JOIN SUBJECTS ON EXAM_SCORES.SUBJECT_ID = SUBJECTS.SUBJECT_ID;


-- Table for library books
DROP TABLE IF EXISTS LIBRARY_BOOKS;
CREATE TABLE LIBRARY_BOOKS
(
    BOOK_ID        SERIAL,
    GOOGLE_BOOK_ID VARCHAR(50)  NOT NULL UNIQUE,
    BOOK_TITLE     VARCHAR(150) NOT NULL,
    BOOK_AUTHOR    VARCHAR(50)  NOT NULL,
    BOOK_ISBN      VARCHAR(50)  NOT NULL,
    BOOK_YEAR      INTEGER      NOT NULL,
    BOOK_COUNT     INTEGER      NOT NULL,
    ENTRY_DATE     DATE         NOT NULL DEFAULT CURRENT_DATE,
    SHELF_ID       INTEGER      NOT NULL,
    CONSTRAINT LIBRARY_BOOKS_PK PRIMARY KEY (BOOK_ID)
);


-- Insert some books
INSERT INTO LIBRARY_BOOKS (BOOK_TITLE, GOOGLE_BOOK_ID, BOOK_AUTHOR, BOOK_ISBN, BOOK_YEAR, BOOK_COUNT, SHELF_ID)
VALUES ('To Kill A Mockingbird', 'u019AwAAQBAJ', 'Harper Lee', '123456789', 2014, 10, 1);
INSERT INTO LIBRARY_BOOKS (BOOK_TITLE, GOOGLE_BOOK_ID, BOOK_AUTHOR, BOOK_ISBN, BOOK_YEAR, BOOK_COUNT, SHELF_ID)
VALUES ('The Hobbit', 'U799AY3yfqcC', 'J.R.R. Tolkien', '987654321', 2012, 10, 1);
INSERT INTO LIBRARY_BOOKS (BOOK_TITLE, GOOGLE_BOOK_ID, BOOK_AUTHOR, BOOK_ISBN, BOOK_YEAR, BOOK_COUNT, SHELF_ID)
VALUES ('The Fellowship of the Ring (The Lord of the Rings, Book 1)', 'xFr92V2k3PIC', 'J.R.R. Tolkien', '123456789',
        2000, 10, 1);
INSERT INTO LIBRARY_BOOKS (BOOK_TITLE, GOOGLE_BOOK_ID, BOOK_AUTHOR, BOOK_ISBN, BOOK_YEAR, BOOK_COUNT, SHELF_ID)
VALUES ('The Alchemist', 'FzVjBgAAQBAJ', 'Paulo Coelho', '123456789', 2008, 10, 1);
INSERT INTO LIBRARY_BOOKS (BOOK_TITLE, GOOGLE_BOOK_ID, BOOK_AUTHOR, BOOK_ISBN, BOOK_YEAR, BOOK_COUNT, SHELF_ID)
VALUES ('The Kite Runner', '9Q0_5ogipFsC', 'Khaled Hosseini', '123456789', 2012, 10, 1);
INSERT INTO LIBRARY_BOOKS (BOOK_TITLE, GOOGLE_BOOK_ID, BOOK_AUTHOR, BOOK_ISBN, BOOK_YEAR, BOOK_COUNT, SHELF_ID)
VALUES ('The Devil and Miss Prym: A Novel of Temptation', '5x0y6cDeWL0C', 'Paulo Coelho', '123456789', 2009, 10, 1);
INSERT INTO LIBRARY_BOOKS (BOOK_TITLE, GOOGLE_BOOK_ID, BOOK_AUTHOR, BOOK_ISBN, BOOK_YEAR, BOOK_COUNT, SHELF_ID)
VALUES ('Educated', '2ObWDgAAQBAJ', 'Tara Westover', '123456789', 2018, 5, 1);
INSERT INTO LIBRARY_BOOKS (BOOK_TITLE, GOOGLE_BOOK_ID, BOOK_AUTHOR, BOOK_ISBN, BOOK_YEAR, BOOK_COUNT, SHELF_ID)
VALUES ('The Night Watchman', 'ZECbDwAAQBAJ', 'Louise Erdrich', '123456789', 2018, 5, 1);
INSERT INTO LIBRARY_BOOKS (BOOK_TITLE, GOOGLE_BOOK_ID, BOOK_AUTHOR, BOOK_ISBN, BOOK_YEAR, BOOK_COUNT, SHELF_ID)
VALUES ('The Sentence', 'FwEXEAAAQBAJ', 'Louise Erdrich', '123456789', 2018, 5, 1);
INSERT INTO LIBRARY_BOOKS (BOOK_TITLE, GOOGLE_BOOK_ID, BOOK_AUTHOR, BOOK_ISBN, BOOK_YEAR, BOOK_COUNT, SHELF_ID)
VALUES ('The Ministry of Utmost Happiness', 'HAYEDgAAQBAJ', 'Arundhati Roy', '123456789', 2017, 3, 3);
INSERT INTO LIBRARY_BOOKS (BOOK_TITLE, GOOGLE_BOOK_ID, BOOK_AUTHOR, BOOK_ISBN, BOOK_YEAR, BOOK_COUNT, SHELF_ID)
VALUES ('The Last', '6dCMDwAAQBAJ', 'Hanna Jameson', '9781501198823', 2019, 8, 2);


-- Table for library books issued to students, issue date, return date referencing user_id from users.
DROP TABLE IF EXISTS LIBRARY_BOOKS_ISSUES;
CREATE TABLE LIBRARY_BOOKS_ISSUES
(
    ISSUE_ID    SERIAL,
    BOOK_ID     INTEGER NOT NULL,
    USER_ID     INTEGER NOT NULL,
    ISSUE_DATE  DATE    NOT NULL DEFAULT CURRENT_DATE,
    -- Return date is issue_date + 20 days
    RETURN_DATE DATE    NOT NULL DEFAULT CURRENT_DATE + 20,
    CONSTRAINT LIBRARY_BOOKS_ISSUES_PK PRIMARY KEY (BOOK_ID, USER_ID),
    CONSTRAINT LIBRARY_BOOKS_ISSUES_FK1 FOREIGN KEY (BOOK_ID) REFERENCES LIBRARY_BOOKS (BOOK_ID),
    CONSTRAINT LIBRARY_BOOKS_ISSUES_FK2 FOREIGN KEY (USER_ID) REFERENCES USERS (USER_ID)
);

-- Returned Books table
DROP TABLE IF EXISTS LIBRARY_BOOKS_RETURNED;
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

-- Function to insert an array of book ids issued to students. Only 3 books can be issued to a student at a time. Decrease the book count by 1 after issuing a book.
DROP FUNCTION IF EXISTS ISSUE_BOOKS;
CREATE FUNCTION ISSUE_BOOKS(I_BOOK_IDS INTEGER[], I_USER_ID INTEGER)
    RETURNS INTEGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    L_BOOK_COUNT INTEGER;
    L_BOOK_ID    INTEGER;
    BOOKS_ISSUED INTEGER;
BEGIN
    BOOKS_ISSUED := 0;
    FOR L_BOOK_ID IN
        SELECT *
        FROM UNNEST(I_BOOK_IDS)
        LOOP
            SELECT COUNT(*)
            INTO L_BOOK_COUNT
            FROM LIBRARY_BOOKS_ISSUES
            WHERE USER_ID = I_USER_ID;
            IF L_BOOK_COUNT < 3 THEN
                INSERT INTO LIBRARY_BOOKS_ISSUES (BOOK_ID, USER_ID)
                VALUES (L_BOOK_ID, I_USER_ID);
                UPDATE LIBRARY_BOOKS
                SET BOOK_COUNT = BOOK_COUNT - 1
                WHERE BOOK_ID = L_BOOK_ID;
                BOOKS_ISSUED := BOOKS_ISSUED + 1;
            END IF;
        END LOOP;
    RETURN BOOKS_ISSUED;
END;
$$;

-- Call the function
SELECT ISSUE_BOOKS('{4,5,2}', 5);
SELECT ISSUE_BOOKS(ARRAY [4], 10);

-- Function to return a book to the library by user_id and array of book_ids, checking if book_id is issued to that user and delete the corresponding row, also insert that row in the returned books table.
DROP FUNCTION IF EXISTS RETURN_BOOKS;
CREATE FUNCTION RETURN_BOOKS(I_BOOK_IDS INTEGER[], I_USER_ID INTEGER)
    RETURNS INTEGER
    LANGUAGE plpgsql
AS
$$
DECLARE
    L_BOOK_COUNT   INTEGER;
    L_BOOK_ID      INTEGER;
    BOOKS_RETURNED INTEGER;
BEGIN
    BOOKS_RETURNED := 0;
    FOR L_BOOK_ID IN
        SELECT *
        FROM UNNEST(I_BOOK_IDS)
        LOOP
            SELECT COUNT(*)
            INTO L_BOOK_COUNT
            FROM LIBRARY_BOOKS_ISSUES
            WHERE USER_ID = I_USER_ID
              AND BOOK_ID = L_BOOK_ID;
            IF L_BOOK_COUNT > 0 THEN
                DELETE
                FROM LIBRARY_BOOKS_ISSUES
                WHERE USER_ID = I_USER_ID
                  AND BOOK_ID = L_BOOK_ID;
                INSERT INTO LIBRARY_BOOKS_RETURNED (BOOK_ID, USER_ID)
                VALUES (L_BOOK_ID, I_USER_ID);
                UPDATE LIBRARY_BOOKS
                SET BOOK_COUNT = BOOK_COUNT + 1
                WHERE BOOK_ID = L_BOOK_ID;
                BOOKS_RETURNED := BOOKS_RETURNED + 1;
            END IF;
        END LOOP;
    RETURN BOOKS_RETURNED;
END;
$$;

-- Call the function
SELECT RETURN_BOOKS(ARRAY [1, 2, 3], 5);

-- Function to insert books issued to students. Only 3 books can be issued to a student at a time. Decrease the book count by 1 after issuing a book.
-- DEPRECATED ⚠
DROP FUNCTION IF EXISTS INSERT_LIBRARY_BOOKS;
CREATE FUNCTION INSERT_LIBRARY_BOOKS(user_id INTEGER, t_book_id INTEGER)
    RETURNS BOOLEAN
AS
$$
DECLARE
    t_book_count INTEGER;
BEGIN
    SELECT BOOK_COUNT
    INTO t_book_count
    FROM LIBRARY_BOOKS
    WHERE BOOK_ID = t_book_id;
    IF t_book_count > 0 THEN
        INSERT INTO LIBRARY_BOOKS_ISSUES (BOOK_ID, USER_ID)
        VALUES (t_book_id, user_id);
        UPDATE LIBRARY_BOOKS
        SET BOOK_COUNT = t_book_count - 1
        WHERE BOOK_ID = t_book_id;
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Call the function
SELECT INSERT_LIBRARY_BOOKS(3, 5);

SELECT INSERT_LIBRARY_BOOKS(1, 2);
SELECT INSERT_LIBRARY_BOOKS(1, 3);
SELECT INSERT_LIBRARY_BOOKS(1, 4);

SELECT INSERT_LIBRARY_BOOKS(2, 3);

SELECT INSERT_LIBRARY_BOOKS(3, 1);

SELECT INSERT_LIBRARY_BOOKS(6, 3);

-- Empty library_books_issues and library_books_returned tables and reset the serials
DELETE
FROM LIBRARY_BOOKS_ISSUES;
DELETE
FROM LIBRARY_BOOKS_RETURNED;
-- Reset their serials
ALTER SEQUENCE LIBRARY_BOOKS_ISSUES_ISSUE_ID_seq RESTART WITH 1;
ALTER SEQUENCE LIBRARY_BOOKS_RETURNED_RETURN_ID_seq RESTART WITH 1;


-- Function to return a book to the library by user_id and book_id and delete the corresponding row, also insert that row in the returned books table.
-- DEPRECATED ⚠
DROP FUNCTION IF EXISTS RETURN_LIBRARY_BOOK;
CREATE FUNCTION RETURN_LIBRARY_BOOK(p_user_id INTEGER, p_book_id INTEGER)
    RETURNS INTEGER AS
$$
DECLARE
    l_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO l_count
    FROM LIBRARY_BOOKS_ISSUES
    WHERE USER_ID = p_user_id
      AND BOOK_ID = p_book_id;
    IF l_count = 1 THEN
        DELETE
        FROM LIBRARY_BOOKS_ISSUES
        WHERE USER_ID = p_user_id
          AND BOOK_ID = p_book_id;
        INSERT INTO LIBRARY_BOOKS_RETURNED (BOOK_ID, USER_ID, RETURN_DATE)
        VALUES (p_book_id, p_user_id, CURRENT_DATE);
        RETURN 1;
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Return the book with id=2 and user_id=1
SELECT RETURN_LIBRARY_BOOK(10, 1);

SELECT RETURN_LIBRARY_BOOK(3, 2);
SELECT RETURN_LIBRARY_BOOK(6, 3);


-- Query to get books issued to a student by id
SELECT *
FROM LIBRARY_BOOKS_ISSUES
WHERE USER_ID = 1;



--------------------------------------------------------------------------------


-- Display number of columns for USER_PRIVILEGES
SELECT COUNT(*)
FROM USER_PRIVILEGES;

-- Display number of columns for USERS
SELECT COUNT(*)
FROM USERS;


-- DISPLAY TABLE
SELECT *
FROM USER_PRIVILEGES;

-- Display users also getting only the role id from the user_privileges table
SELECT USERS.*, USER_PRIVILEGES.ROLE_ID
FROM USERS
         JOIN USER_PRIVILEGES
              ON USERS.ROLE = USER_PRIVILEGES.ROLE;

-- Create a stored procedure for the above query
CREATE OR REPLACE FUNCTION get_user_privileges()
    RETURNS TABLE
            (
                USER_ID  INT,
                USERNAME VARCHAR(50),
                PIN      VARCHAR(50),
                ROLE_ID  INT,
                ROLE     VARCHAR(50)
            )
AS
$$
SELECT USERS.USER_ID, USERS.USERNAME, USERS.PIN, USER_PRIVILEGES.ROLE_ID, USERS.ROLE
FROM USERS
         JOIN USER_PRIVILEGES
              ON USERS.ROLE = USER_PRIVILEGES.ROLE;
$$ LANGUAGE SQL;

-- Display the above procedure

SELECT *
FROM get_user_privileges() AS user_rel_role_id;

SELECT *
FROM USERS;

SELECT *
FROM USER_PRIVILEGES;

-- Select rows from ATTENDANCE table and convert dates to dd-mm-yyyy format
SELECT user_id, to_char(date, 'DD-MM-YYYY'), time, status
FROM ATTENDANCE;

-- Create a view to display attendance of students in dd-mm-yyyy format and add column matching the user id with their name and sorted by most recent date
DROP VIEW IF EXISTS ATTENDANCE_VIEW;
CREATE OR REPLACE VIEW attendance_view AS
SELECT ATTENDANCE_ID,
       USERS.USER_ID,
       USERS.USERNAME,
       to_char(ATTENDANCE.date, 'DD-MM-YYYY') AS date,
       ATTENDANCE.time,
       ATTENDANCE.status
FROM USERS
         JOIN ATTENDANCE
              ON USERS.USER_ID = ATTENDANCE.USER_ID
ORDER BY ATTENDANCE.date DESC;

-- attendance_view
SELECT *
FROM attendance_view;

-- Check if a certain user has the write_attendance privilege
SELECT USER_PRIVILEGES.ROLE_ID, USER_PRIVILEGES.ROLE, USER_PRIVILEGES.ATTENDANCE_WRITE
FROM USERS
         JOIN USER_PRIVILEGES
              ON USERS.ROLE = USER_PRIVILEGES.ROLE
WHERE USERS.USERNAME = 'student';

-- Routine to get attendance of a user input user_id, month and year
DROP FUNCTION get_attendance();
CREATE OR REPLACE FUNCTION get_attendance(user_id INT, month INT, year INT)
    RETURNS TABLE
            (
                USER_ID  INT,
                USERNAME VARCHAR(50),
                ATT_DATE DATE,
                ATT_TIME TIME,
                STATUS   VARCHAR(50)
            )
AS
$$
SELECT USERS.USER_ID, USERS.USERNAME, ATTENDANCE.date, ATTENDANCE.time, ATTENDANCE.status
FROM USERS
         JOIN ATTENDANCE
              ON USERS.USER_ID = ATTENDANCE.USER_ID
WHERE USERS.USER_ID = $1
  AND extract(month from ATTENDANCE.date) = $2
  AND extract(year from ATTENDANCE.date) = $3
ORDER BY date;
$$ LANGUAGE SQL;

-- Run the procedure
SELECT *
FROM get_attendance(3, 08, 2022);

-- Total number of present in the month of year
SELECT COUNT(*)
FROM get_attendance(3, 08, 2022)
WHERE STATUS = 'PRESENT';

-- Total number of absent or other leaves in the month of year
SELECT COUNT(*)
FROM get_attendance(2, 08, 2022)
WHERE STATUS != 'PRESENT';


-- Update PIN of user by id
UPDATE USERS
SET PIN = '1234'
WHERE USER_ID = 100
returning USER_ID;


-- Delete all tables, functions, procedures, views, sequences
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
