namespace REST.Entities.DatabaseEntities
{
    public class EExamScore
    {
        /*
         create table exam_scores
            (
                user_id    integer     not null
                    references users,
                subject_id integer     not null
                    references subjects,
                exam_type  varchar(50) not null,
                exam_score integer     not null
                    constraint exam_scores_exam_score_check
                        check ((exam_score >= 0) AND (exam_score <= 100)),
                exam_year  integer     not null
                    constraint exam_scores_exam_year_check
                        check (exam_year > 1949),
                primary key (user_id, subject_id, exam_type)
            );
         */

        public int SerialNumber { get; set; }
        public int StudentId { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; }
        public string ExamType { get; set; }
        public int ExamScore { get; set; }
        public int ExamYear { get; set; }
    }
}
