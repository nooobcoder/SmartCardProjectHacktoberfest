using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using REST.Dtos;
using REST.Entities.DatabaseEntities;
using REST.Repositories.Interfaces;

namespace REST.Controllers
{
    [ApiController]
    [Route("library")]
    public class LibraryController : ControllerBase
    {
        private readonly IDatabaseRepository _repository;

        public LibraryController(IDatabaseRepository repository)
        {
            _repository = repository;
        }

        // Get /books
        [HttpGet("Books")]
        public async Task<ActionResult<List<ELibraryBooks>>> GetBooks()
        {
            var books = await _repository.GetBooks();
            return books;
        }

        // POST /IssueBook
        [HttpPost("IssueBook")]
        public async Task<ActionResult<int>> IssueBook([FromBody] IssueBookDto issueBookDto)
        {
            try
            {
                var result = await _repository.IssueBook(issueBookDto);
                return result;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, e.Message);
            }
        }

        // POST /IssuedBooks/{id}
        [HttpGet("IssuedBooks/{id}")]
        public async Task<ActionResult<List<ELibraryBooks>>> GetIssuedBooks(int id)
        {
            try
            {
                var result = await _repository.GetIssuedBooks(id);
                if (result == null || result.Count == 0)
                {
                    return StatusCode(204);
                }
                return result;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, e.Message);
            }
        }

        // DELETE /ReturnBook
        [HttpDelete("ReturnBook")]
        public async Task<ActionResult<int>> ReturnBook([FromBody] ReturnBookDto returnBookDto)
        {
            try
            {
                var result = await _repository.ReturnBook(returnBookDto);
                return result;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return StatusCode(500, e.Message);
            }
        }
    }
}
