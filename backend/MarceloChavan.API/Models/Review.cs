using System.ComponentModel.DataAnnotations;

namespace MarceloChavan.API.Models;

public class Review
{
    [Key]
    public int Id { get; set; }

    public int ProductId { get; set; }
    public int? UserId { get; set; }

    // Snapshot del nombre del autor (por si el usuario se borra)
    [Required, MaxLength(100)]
    public string AuthorName { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }

    public bool IsApproved { get; set; } = false; // Admin aprueba antes de publicar

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public Product Product { get; set; } = null!;
    public User? User { get; set; }
}
