using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using REST.Dtos;
using REST.Repositories.Interfaces;

namespace REST.Controllers
{
    [ApiController]
    [Route("examMarks")]
    public class ExamMarksController : ControllerBase
    {
        private readonly IDatabaseRepository _repository;

        public ExamMarksController(IDatabaseRepository repository)
        {
            _repository = repository;
        }

        // GET
        public async Task<ActionResult<List<ExamScoreDto>>> Get()
        {
            var examScores = await _repository.GetExamScores();
            return Ok(examScores);
        }

        // /byStudentId
        [HttpGet("ByStudentId")]
        public async Task<ActionResult<ExamScoreDto>> GetExamMarksByStudentId([FromBody] ExamScoreDto examScoreDto)
        {
            try
            {
                var examMarks = await _repository.GetStudentMarksByStudentId(examScoreDto.StudentId);

                if (examMarks == null)
                {
                    return NotFound();
                }

                return Ok(examMarks);
            }
            catch (Exception e)
            {
                return BadRequest("Panic: " + e.Message);
            }
        }

        // /bySubjectId
        [HttpGet("BySubjectId")]
        public async Task<ActionResult<ExamScoreDto>> GetExamMarksBySubjectId([FromBody] ExamScoreDto examScoreDto
        )
        {
            try
            {
                var examMarks = await _repository.GetStudentMarksBySubject(
                    examScoreDto.StudentId,
                    examScoreDto.SubjectId
                );
                if (examMarks == null)
                {
                    return NotFound();
                }

                return Ok(examMarks);
            }
            catch (Exception e)
            {
                return BadRequest("Panic: " + e.Message);
            }
        }
    }
}
