using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarceloChavan.API.Models;

public class Product
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }

    // Stock
    public int Stock { get; set; } = 0;

    // Material (plata 925, plata 950, dorado, etc.)
    [MaxLength(100)]
    public string? Material { get; set; }

    // Peso en gramos
    [Column(TypeName = "decimal(6,2)")]
    public decimal? WeightGrams { get; set; }

    // Colección (Invierno 2025, Clásica, etc.)
    [MaxLength(100)]
    public string? Collection { get; set; }

    // Imágenes (JSON array de URLs)
    public string? ImagesJson { get; set; }

    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Foreign Key
    public int CategoryId { get; set; }

    // Navigation
    public Category Category { get; set; } = null!;
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
