using System.ComponentModel.DataAnnotations;

namespace REST.Dtos
{
    public record CreateItemDto
    {
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; init; }

        [Required]
        [Range(1, 1000, ErrorMessage = "The value must be between 1 to 1000 (inclusive).")]

        public decimal Price { get; init; }
    }
}
