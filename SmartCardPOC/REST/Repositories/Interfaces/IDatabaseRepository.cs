using REST.Dtos;
using REST.Entities.DatabaseEntities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace REST.Repositories.Interfaces
{
    public interface IDatabaseRepository
    {
        //Task Add(BoardGame game);
        //Task<BoardGame[]> GetAllRows();
        //Task<BoardGame> GetRowById(int id);
        //Task<BoardGame> GetLastRow();
        //Task Update(int id, BoardGame game);
        //Task Delete(int id);
        //Task CreateTableIfNotExists();

        Task<List<ESubject>> GetSubjects();

        // Leave Operations
        Task<List<ELeaveType>> GetLeaveTypes();

        // User operations
        Task<EUser> CreateUser(EUser User);
        Task<EUser> LoginUser(EUser User);
        Task<bool> DeleteUser(EUser User);
        Task<EStudentPersonalDetail> GetStudentProfile(int userId);
        Task<EUser> UpdateUserPin(EUser user);

        // Library Operations
        Task<List<ELibraryBooks>> GetBooks();
        Task<int> IssueBook(IssueBookDto issueBookDto);
        Task<List<ELibraryBooks>> GetIssuedBooks(int id);
        Task<int> ReturnBook(ReturnBookDto returnBookDto);

        // Exam Score Operations
        Task<List<EExamScore>> GetExamScores();
        Task<List<EExamScore>> GetStudentMarksByStudentId(int studentId);
        Task<List<EExamScore>> GetStudentMarksBySubject(int userId, int subjectId);

        // Attendance Operations
        Task<EAttendance> AddAttendance(EAttendance attendance);
        // Task<List<EAttendance>> GetAttendanceByStudentId(int studentId);
        // Task<EAttendance> UpdateAttendance(EAttendance updateAttendanceDto);
        // Task<List<EAttendance>> GetAttendanceByDate(int studentId, string date);
        // Task DeleteAttendance(int attendanceId);
    }
}
