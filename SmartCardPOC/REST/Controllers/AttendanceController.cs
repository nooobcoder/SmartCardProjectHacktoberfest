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
    [Route("attendance")]
    public class AttendanceController : ControllerBase
    {
        private readonly IDatabaseRepository repository;

        public AttendanceController(IDatabaseRepository _repository)
        {
            repository = _repository;
        }

        // Map EAttendance to AttendanceDto
        private AttendanceDto MapEAttendanceToAttendanceDto(EAttendance eAttendance) => new AttendanceDto
        {
            SerialNumber = eAttendance.SerialNumber,
            AttendanceId = eAttendance.AttendanceId,
            UserId = eAttendance.UserId,
            Status = eAttendance.Status,
            AttDate = eAttendance.AttDate,
            AttTime = eAttendance.AttTime
        };

        // GET attendances
        [HttpGet]
        public async Task<ActionResult<List<AttendanceDto>>> GetAllAttendance()
        {
            try
            {
                List<EAttendance> attendances = await repository.GetAttendances();
                List<AttendanceDto> attendanceDtos = new List<AttendanceDto>();
                // Loop through attendances and map each EAttendance to AttendanceDto
                foreach (EAttendance eAttendance in attendances)
                {
                    attendanceDtos.Add(MapEAttendanceToAttendanceDto(eAttendance));
                }

                return Ok(attendanceDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // GET attendance by student id
        [HttpGet("{studentId}")]
        public async Task<ActionResult<List<AttendanceDto>>> GetAttendanceByStudentId(int studentId)
        {
            try
            {
                List<EAttendance> attendances = await repository.GetAttendanceByStudentId(studentId);
                List<AttendanceDto> attendanceDtos = new List<AttendanceDto>();
                // Loop through attendances and map each EAttendance to AttendanceDto
                foreach (EAttendance eAttendance in attendances)
                {
                    attendanceDtos.Add(MapEAttendanceToAttendanceDto(eAttendance));
                }

                return Ok(attendanceDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("AddAttendance")]
        public async Task<ActionResult> AddAttendance([FromBody] EAttendance attendance)
        {
            try
            {
                await repository.AddAttendance(attendance);
                return Ok();
            }

            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
    }
}
