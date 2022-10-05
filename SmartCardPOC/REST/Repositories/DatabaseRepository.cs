using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Npgsql;
using NpgsqlTypes;
using REST.Converters.Database;
using REST.Dtos;
using REST.Entities.DatabaseEntities;
using REST.Helpers;
using REST.Repositories.Interfaces;

namespace REST.Repositories
{
    public class DatabaseRepository : IDatabaseRepository
    {
        private NpgsqlConnection connection;

        private string CONNECTION_STRING =
            "Host=100.101.46.6;"
            + "Username=ankurpaul;"
            + "Password=adminadmin;"
            + "Database=smartcard;"
            + "Pooling=True";

        private DatabaseConverters databaseConverters;

        public DatabaseRepository()
        {
            databaseConverters = new DatabaseConverters();
            // Log
            Console.WriteLine("Database Repository Connection Pool Open");
            connection = new NpgsqlConnection(CONNECTION_STRING);
            connection.Open();
        }

        // Get Subjects
        public async Task<List<ESubject>> GetSubjects()
        {
            string TABLE_NAME = "subjects";
            string commandText = $"SELECT * FROM {TABLE_NAME}";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    var subjects = new List<ESubject>();
                    while (await reader.ReadAsync())
                    {
                        ESubject game = databaseConverters.ReadSubject(reader);
                        subjects.Add(game);
                    }

                    return subjects;
                }
            }
        }

        // Get LeaveTypes
        public async Task<List<ELeaveType>> GetLeaveTypes()
        {
            string TABLE_NAME = "leave_types";
            string commandText = $"SELECT * FROM {TABLE_NAME}";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    var leave_types = new List<ELeaveType>();
                    while (await reader.ReadAsync())
                    {
                        ELeaveType game = databaseConverters.ReadLeaveType(reader);
                        leave_types.Add(game);
                    }

                    return leave_types;
                }
            }
        }

        // Create User
        public async Task<EUser> CreateUser(EUser user)
        {
            /*
             * INSERT INTO USERS (USERNAME, PIN, ROLE)
                VALUES ('admin', 201023, 'ADM');
             */
            string TABLE_NAME = "users";
            string commandText =
                $"INSERT INTO {TABLE_NAME} (username, pin, role) VALUES (@username, @pin, @role)";

            string hashedPassword = Password.Hash(user.Pin);
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("@username", user.Username);
                cmd.Parameters.AddWithValue("@pin", hashedPassword);
                cmd.Parameters.AddWithValue("@role", user.Role);

                await cmd.ExecuteNonQueryAsync();
            }

            return user;
        }

        // Login the user by verifying the hashed password from the database
        public async Task<EUser> LoginUser(EUser user)
        {
            // Get the hashed password of the user
            string TABLE_NAME = "users";
            string commandText = $"SELECT * FROM {TABLE_NAME} WHERE username = @username";
            string p_hash = "";

            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("@username", user.Username);
                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    var c_user = new EUser();
                    while (await reader.ReadAsync())
                    {
                        c_user = databaseConverters.ReadUser(reader);
                    }

                    p_hash = c_user.Pin;

                    // Verify the password hash
                    if (Password.Verify(user.Pin, p_hash))
                    {
                        // Remove Pin from user object
                        c_user.Pin = null;
                        return c_user;
                    }
                    else
                    {
                        throw new Exception("Invalid password or the user does not exist");
                    }
                }
            }
        }

        // Delete user by username
        public async Task<bool> DeleteUser(EUser user)
        {
            /*
                DELETE FROM USERS
                WHERE USERNAME = 'student';
            */
            string TABLE_NAME = "users";
            string commandText = $"DELETE FROM {TABLE_NAME} WHERE username = @username";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("@username", user.Username);
                await cmd.ExecuteNonQueryAsync();
            }

            return true;
        }

        // Get profile of a student
        public async Task<EStudentPersonalDetail> GetStudentProfile(int userId)
        {
            /*
             * SELECT *
                FROM STUDENT_PERSONAL_DETAILS
                WHERE USER_ID = 1;
             */
            string TABLE_NAME = "student_personal_details";
            string commandText = $"SELECT * FROM {TABLE_NAME} WHERE user_id = @user_id";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("@user_id", userId);
                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    var student = new EStudentPersonalDetail();
                    while (await reader.ReadAsync())
                    {
                        student = databaseConverters.ReadStudentPersonalDetail(reader);
                    }

                    return student;
                }
            }
        }

        // Update user PIN
        public async Task<EUser> UpdateUserPin(EUser user)
        {
            /*
             * UPDATE USERS
                SET PIN = 201023
                WHERE USERNAME = 'admin';
             */
            string TABLE_NAME = "users";
            string commandText =
                $"UPDATE {TABLE_NAME} SET pin = @pin WHERE username = @username RETURNING *";
            string hashedPassword = Password.Hash(user.Pin);
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("@pin", hashedPassword);
                cmd.Parameters.AddWithValue("@username", user.Username);

                // Get the rows returned from the query
                await cmd.ExecuteNonQueryAsync();
                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    EUser c_user = new EUser();
                    while (await reader.ReadAsync())
                    {
                        c_user = databaseConverters.ReadUser(reader);
                    }

                    return c_user.UserId != 0 ? c_user : throw new Exception("User not found");
                }
            }
        }

        // Get all books from the library
        public async Task<List<ELibraryBooks>> GetBooks()
        {
            /*
                SELECT *
                FROM library_books;
            */
            string TABLE_NAME = "library_books";
            string commandText = $"SELECT * FROM {TABLE_NAME} ORDER BY book_id";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    var books = new List<ELibraryBooks>();
                    while (await reader.ReadAsync())
                    {
                        ELibraryBooks book = databaseConverters.ReadLibraryBook(reader);
                        books.Add(book);
                    }

                    return books;
                }
            }
        }

        // Issue Book to a student
        public async Task<int> IssueBook(IssueBookDto reqObj)
        {
            /*
                CREATE FUNCTION ISSUE_BOOKS(I_BOOK_IDS INTEGER[], I_USER_ID INTEGER)
                    RETURNS INTEGER
                    LANGUAGE plpgsql
                AS
                $$
                DECLARE
                    L_BOOK_COUNT   INTEGER;
                    L_BOOK_ID      INTEGER;
                    BOOKS_ISSUED INTEGER;
                BEGIN
                    BOOKS_ISSUED := 0;
                    FOR L_BOOK_ID IN SELECT * FROM UNNEST(I_BOOK_IDS)
                        LOOP
                            SELECT COUNT(*) INTO L_BOOK_COUNT FROM LIBRARY_BOOKS_ISSUES WHERE USER_ID = I_USER_ID;
                            IF L_BOOK_COUNT < 3 THEN
                                INSERT INTO LIBRARY_BOOKS_ISSUES (BOOK_ID, USER_ID) VALUES (L_BOOK_ID, I_USER_ID);
                                UPDATE LIBRARY_BOOKS SET BOOK_COUNT = BOOK_COUNT - 1 WHERE BOOK_ID = L_BOOK_ID;
                                BOOKS_ISSUED := BOOKS_ISSUED + 1;
                            END IF;
                        END LOOP;
                    RETURN BOOKS_ISSUED;
                END;
                $$;

                -- Call the function
                SELECT ISSUE_BOOKS(ARRAY[1, 2, 3], 5);
            */
            string FUNCTION_NAME = "ISSUE_BOOKS";
            string commandText = $"SELECT {FUNCTION_NAME}(@book_ids, @user_id)";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.Add("@book_ids", NpgsqlDbType.Array | NpgsqlDbType.Integer).Value =
                    reqObj.BookIds;
                cmd.Parameters.AddWithValue("@user_id", reqObj.UserId);

                // Execute query and catch errors
                try
                {
                    NpgsqlDataReader reader = await cmd.ExecuteReaderAsync();
                    int booksIssued = 0;
                    while (await reader.ReadAsync())
                    {
                        booksIssued = reader.GetInt32(0);
                    }

                    reader.Close();
                    return booksIssued;
                }
                catch (NpgsqlException e)
                {
                    Console.WriteLine(e.Message);
                    // Get error code
                    string errorCode = e.SqlState;
                    // If errorCode === 23505, then the book is already issued to the user
                    if (errorCode == "23505")
                    {
                        throw new Exception("Book is already issued to the user");
                    }
                    else
                    {
                        throw new Exception("Error while issuing book");
                    }
                }
                catch (Exception e)
                {
                    throw new Exception(e.Message);
                }
            }
        }

        // Get all books issued by a student
        public async Task<List<ELibraryBooks>> GetIssuedBooks(int userId)
        {
            /*
                SELECT *
                FROM library_books
                WHERE book_id IN (
                    SELECT book_id
                    FROM library_books_issues
                    WHERE user_id = 1
                );
            */
            string TABLE_NAME = "library_books";
            string commandText =
                $"SELECT * FROM {TABLE_NAME} WHERE book_id IN (SELECT book_id FROM library_books_issues WHERE user_id = @user_id)";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("@user_id", userId);
                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    var books = new List<ELibraryBooks>();
                    while (await reader.ReadAsync())
                    {
                        ELibraryBooks book = databaseConverters.ReadLibraryBook(reader);
                        books.Add(book);
                    }

                    return books;
                }
            }
        }

        public async Task<int> ReturnBook(ReturnBookDto returnBookDto)
        {
            /*
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
                    FOR L_BOOK_ID IN SELECT * FROM UNNEST(I_BOOK_IDS)
                        LOOP
                            SELECT COUNT(*)
                            INTO L_BOOK_COUNT
                            FROM LIBRARY_BOOKS_ISSUES
                            WHERE USER_ID = I_USER_ID
                            AND BOOK_ID = L_BOOK_ID;
                            IF L_BOOK_COUNT > 0 THEN
                                DELETE FROM LIBRARY_BOOKS_ISSUES WHERE USER_ID = I_USER_ID AND BOOK_ID = L_BOOK_ID;
                                INSERT INTO LIBRARY_BOOKS_RETURNED (BOOK_ID, USER_ID) VALUES (L_BOOK_ID, I_USER_ID);
                                UPDATE LIBRARY_BOOKS SET BOOK_COUNT = BOOK_COUNT + 1 WHERE BOOK_ID = L_BOOK_ID;
                                BOOKS_RETURNED := BOOKS_RETURNED + 1;
                            END IF;
                        END LOOP;
                    RETURN BOOKS_RETURNED;
                END;
                $$;

                -- Call the function
                SELECT RETURN_BOOKS(ARRAY [1, 2, 3], 5);
            */
            string FUNCTION_NAME = "RETURN_BOOKS";
            string commandText = $"SELECT {FUNCTION_NAME}(@book_ids, @user_id)";
            using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.Add("@book_ids", NpgsqlDbType.Array | NpgsqlDbType.Integer).Value =
                    returnBookDto.BookIds;
                cmd.Parameters.AddWithValue("@user_id", returnBookDto.UserId);

                // Execute query and catch errors
                try
                {
                    NpgsqlDataReader reader = cmd.ExecuteReader();
                    int booksReturned = 0;
                    while (reader.Read())
                    {
                        booksReturned = reader.GetInt32(0);
                    }

                    reader.Close();
                    return booksReturned;
                }
                catch (Exception e)
                {
                    throw new Exception(e.Message);
                }
            }
        }

        // Get all marks
        public async Task<List<EExamScore>> GetExamScores()
        {
            /*
             * SELECT *
             * FROM get_all_exam_scores();
            */
            string FUNCTION_NAME = "get_all_exam_scores";
            string commandText = $"SELECT * FROM {FUNCTION_NAME}()";
            try
            {
                await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
                {
                    await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        var marks = new List<EExamScore>();
                        int x = 0;
                        while (await reader.ReadAsync())
                        {
                            EExamScore mark = databaseConverters.ReadExamScore(reader, x);
                            marks.Add(mark);
                            x += 1;
                        }

                        return marks;
                    }
                }
            }
            catch (NpgsqlException e)
            {
                throw new Exception(e.Message);
            }
        }

        // Get marks by student id
        public async Task<List<EExamScore>> GetStudentMarksByStudentId(int studentId)
        {
            /*
                SELECT * FROM get_exam_scores(1);
            */
            string FUNCTION_NAME = "get_exam_scores";
            string commandText = $"SELECT * FROM {FUNCTION_NAME}(@student_id)";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("@student_id", studentId);
                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    var marks = new List<EExamScore>();
                    int x = 0;
                    while (await reader.ReadAsync())
                    {
                        EExamScore mark = databaseConverters.ReadExamScore(reader, x);
                        marks.Add(mark);
                        x += 1;
                    }

                    return marks;
                }
            }
        }

        // Get marks of a student in a particular subject
        public async Task<List<EExamScore>> GetStudentMarksBySubject(int studentId, int subjectId)
        {
            /*
                CREATE OR REPLACE FUNCTION get_marks_of_student_in_subject(IN i_student_id INTEGER, IN i_subject_id INTEGER)
                    RETURNS TABLE
                            (
                                o_exam_type  VARCHAR(50),
                                o_exam_score INTEGER,
                                o_exam_year  INTEGER
                            )
                AS
                $$
                BEGIN
                    RETURN QUERY
                        SELECT EXAM_TYPE, EXAM_SCORE, EXAM_YEAR
                        FROM EXAM_SCORES
                        WHERE USER_ID = i_student_id
                        AND SUBJECT_ID = i_subject_id;
                END;
                $$ LANGUAGE plpgsql;
            */

            string FUNCTION_NAME = "get_marks_of_student_in_subject";
            string commandText = $"SELECT * FROM {FUNCTION_NAME}(@user_id, @subject_id)";
            await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
            {
                cmd.Parameters.AddWithValue("@user_id", studentId);
                cmd.Parameters.AddWithValue("@subject_id", subjectId);
                await using (NpgsqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    var marks = new List<EExamScore>();
                    int x = 0;
                    while (await reader.ReadAsync())
                    {
                        EExamScore mark = databaseConverters.ReadExamScore(reader, x);
                        marks.Add(mark);
                        x++;
                    }

                    return marks;
                }
            }
        }

        /*
        * ATTENDANCE OPERATIONS
        */
        public async Task<EAttendance> AddAttendance(EAttendance attendance)
        {
            /*
                TWO VARIATIONS OF SQL QUERY
                1. INSERT INTO ATTENDANCE (USER_ID, STATUS)
                    VALUES (1, 'SICK LEAVE');

                2. INSERT INTO ATTENDANCE (user_id, date, time, status)
                    VALUES (2, '2022-04-18', '12:00:00', 'PRESENT');
            */

            // attendance.Date to Datetime
            DateTime date = DateTime.Parse(attendance.Date);
            // attendance.Time to TimeSpan
            TimeSpan time = TimeSpan.Parse(attendance.Time);

            try
            {
                string commandText =
                    "INSERT INTO ATTENDANCE (user_id, date, time, status) VALUES (@user_id, @date, @time, @status)";
                await using (NpgsqlCommand cmd = new NpgsqlCommand(commandText, connection))
                {
                    cmd.Parameters.AddWithValue("@user_id", attendance.UserId);
                    cmd.Parameters.AddWithValue("@date", date);
                    cmd.Parameters.AddWithValue("@time", time);
                    cmd.Parameters.AddWithValue("@status", attendance.Status);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
            // Catch NPGSQL Exception
            catch (NpgsqlException e)
            {
                throw new Exception(e.Message);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return attendance;
        }
    }
}
