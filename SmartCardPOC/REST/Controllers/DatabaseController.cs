using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using REST.Entities;
using REST.Entities.DatabaseEntities;
using REST.Repositories.Interfaces;

namespace REST.Controllers
{
    [ApiController]
    [Route("database")]
    public class DatabaseController : ControllerBase
    {
        //private DatabaseRepository repository;
        private BoardGame boardGame;
        private readonly IDatabaseRepository repository;

        public DatabaseController(IDatabaseRepository _repository)
        {
            Console.WriteLine("Database Controller");
            repository = _repository;
            boardGame = new BoardGame();
        }

        [HttpGet("GetSubjects")]
        public async Task<ActionResult<List<ESubject>>> GetSubjects()
        {
            return await repository.GetSubjects();
        }

        [HttpGet("GetLeaveTypes")]
        public async Task<ActionResult<List<ELeaveType>>> GetLeaveTypes()
        {
            try
            {
                return await repository.GetLeaveTypes();
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        // Get profile for a student
        // GET /database/GetStudentProfile/:id
        [HttpGet]
        [Route("GetStudentProfile/{userId}")]
        public async Task<ActionResult<EStudentPersonalDetail>> GetStudentProfile(int userId)
        {
            try
            {
                return await repository.GetStudentProfile(userId);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
    }
}

// SUPPORT CODE

//[HttpPost("WriteDatabase")]
//public async Task WriteDatabase([FromBody] BoardGame game)
//{
//    BoardGame lastRow = await repository.GetLastRow();
//    game.Id = lastRow.Id + 1;
//    await repository.Add(game);
//}

//// database/ReadRow?id=1
//[HttpPost("ReadRow")]
//public async Task<BoardGame> ReadRow(int id)
//{

//    Console.WriteLine(id);
//    BoardGame res = await repository.GetRowById(id);

//    return res;
//}

//[HttpPost("ReadLastRow")]
//public async Task<BoardGame> ReadLastRow() => await repository.GetLastRow();

//// Update row by id => UpdateRow?id=1
//[HttpPost("UpdateRow")]
//public async Task UpdateRow(int id, [FromBody] BoardGame game) => await repository.Update(id, game);
