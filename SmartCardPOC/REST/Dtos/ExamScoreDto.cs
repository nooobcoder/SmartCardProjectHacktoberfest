using System.ComponentModel.DataAnnotations;

namespace REST.Dtos
{
    public class ExamScoreDto
    {
        [Required]
        public int StudentId { get; set; }
        public int SubjectId { get; set; }
        public string TermId { get; set; }
        public int[] Years { get; set; }
    }
}
