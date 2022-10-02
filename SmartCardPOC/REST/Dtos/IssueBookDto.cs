namespace REST.Dtos
{
    public class IssueBookDto
    {
        public int[] BookIds { get; set; } // [`bookId1`, `bookId2`, `bookId3`]
        public int UserId { get; set; }
    }
}
