using System;

namespace REST.Entities.DatabaseEntities
{
    public class EAttendance
    {
        public int AttendanceId { get; set; }
        public int UserId { get; set; }
        public DateTime Date { get; set; }
        public DateTime Time { get; set; }
        public string Status { get; set; }
    }
}
