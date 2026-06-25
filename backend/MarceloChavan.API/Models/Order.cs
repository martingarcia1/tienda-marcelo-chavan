using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarceloChavan.API.Models;

public enum OrderStatus
{
    Pending,        // Pendiente de pago
    Paid,           // Pagado
    Processing,     // En preparación
    Shipped,        // Enviado
    Delivered,      // Entregado
    Cancelled,      // Cancelado
    Refunded        // Reembolsado
}

public class Order
{
    [Key]
    public int Id { get; set; }

    // Puede ser null si es checkout como invitado
    public int? UserId { get; set; }

    // Datos del comprador (para invitados o copia en caso de que el usuario se borre)
    [Required, MaxLength(200)]
    public string BuyerName { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string BuyerEmail { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? BuyerPhone { get; set; }

    // Dirección de envío
    [MaxLength(500)]
    public string? ShippingAddress { get; set; }

    [MaxLength(100)]
    public string? ShippingCity { get; set; }

    [MaxLength(100)]
    public string? ShippingProvince { get; set; }

    [MaxLength(10)]
    public string? ShippingPostalCode { get; set; }

    // Totales
    [Column(TypeName = "decimal(10,2)")]
    public decimal Subtotal { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal ShippingCost { get; set; } = 0;

    [Column(TypeName = "decimal(10,2)")]
    public decimal Total { get; set; }

    // Estado
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    // MercadoPago
    public string? MercadoPagoPaymentId { get; set; }
    public string? MercadoPagoPreferenceId { get; set; }

    // Notas
    [MaxLength(500)]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
