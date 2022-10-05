using System;

namespace REST.Entities.DatabaseEntities
{
    public class EAttendance
    {
        public int AttendanceId { get; set; }
        public int UserId { get; set; }
        public string Date { get; set; } = DateTime.Now.ToString("yyyy-MM-dd");
        public string Time { get; set; } = DateTime.Now.TimeOfDay.ToString();
        public string Status { get; set; }
    }
}
