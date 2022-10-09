namespace REST.Dtos
{
    using System;

    public class AttendanceDto
    {
        /*
            public int SerialNumber { get; set; }
            public int AttendanceId { get; set; }
            public int UserId { get; set; }
            public string Date { get; set; } = DateTime.Now.ToString("yyyy-MM-dd");
            public string Time { get; set; } = DateTime.Now.TimeOfDay.ToString();
            public string Status { get; set; }

            AttDate AttTime maps to att_date and att_time as returned values from the database functions.
            public string AttDate { get; set; }
            public string AttTime { get; set; }
         */
        public int SerialNumber { get; set; }
        public int AttendanceId { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; }
        public string AttDate { get; set; }
        public string AttTime { get; set; }
    }
}
