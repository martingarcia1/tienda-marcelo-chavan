using System.ComponentModel.DataAnnotations;

namespace MarceloChavan.API.Models;

public class BlogPost
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    // Slug amigable para URL: "nueva-coleccion-primavera-2025"
    [Required, MaxLength(350)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Excerpt { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty; // HTML o Markdown

    public string? CoverImageUrl { get; set; }

    public bool IsPublished { get; set; } = false;

    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Autor
    public int? AuthorId { get; set; }
    public User? Author { get; set; }
}
