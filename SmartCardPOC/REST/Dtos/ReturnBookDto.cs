namespace REST.Dtos
{
    public class ReturnBookDto
    {
        public int[] BookIds { get; set; } // [`bookId1`, `bookId2`, `bookId3`]
        public int UserId { get; set; }
    }
}
