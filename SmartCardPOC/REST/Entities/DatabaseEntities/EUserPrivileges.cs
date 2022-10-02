namespace REST.Entities.DatabaseEntities
{
    public class EUserPrivileges
    {
        public bool school_bus_attendance { get; set; }
        public bool personal_details_read { get; set; }
        public bool personal_details_write { get; set; }
        public bool attendance_read { get; set; }
        public bool attendance_write { get; set; }
        public bool library_info_read { get; set; }
        public bool library_info_write { get; set; }
        public bool exam_score_read { get; set; }
        public bool exam_score_write { get; set; }
        public bool student_location_read { get; set; }
        public bool student_money_points { get; set; }
        public string role { get; set; }
    }
}
