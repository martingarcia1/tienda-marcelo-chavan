using MarceloChavan.API.Data;
using MarceloChavan.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MercadoPago.Client.Preference;
using MercadoPago.Config;
using MercadoPago.Resource.Preference;

namespace MarceloChavan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public OrdersController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    /// <summary>Crear orden y generar preferencia de pago en MercadoPago</summary>
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest req)
    {
        // 1. Verificar stock de todos los productos
        foreach (var item in req.Items)
        {
            var product = await _db.Products.FindAsync(item.ProductId);
            if (product == null || !product.IsActive)
                return BadRequest(new { message = $"Producto {item.ProductId} no encontrado." });
            if (product.Stock < item.Quantity)
                return BadRequest(new { message = $"Stock insuficiente para '{product.Name}'." });
        }

        // 2. Crear la orden
        var order = new Order
        {
            BuyerName = req.BuyerName,
            BuyerEmail = req.BuyerEmail,
            BuyerPhone = req.BuyerPhone,
            ShippingAddress = req.ShippingAddress,
            ShippingCity = req.ShippingCity,
            ShippingProvince = req.ShippingProvince,
            ShippingPostalCode = req.ShippingPostalCode,
            ShippingCost = req.ShippingCost,
            Notes = req.Notes,
            Status = OrderStatus.Pending
        };

        decimal subtotal = 0;
        foreach (var item in req.Items)
        {
            var product = await _db.Products.FindAsync(item.ProductId);
            var orderItem = new OrderItem
            {
                ProductId = product!.Id,
                ProductName = product.Name,
                UnitPrice = product.Price,
                Quantity = item.Quantity,
                Subtotal = product.Price * item.Quantity
            };
            order.Items.Add(orderItem);
            subtotal += orderItem.Subtotal;
        }

        order.Subtotal = subtotal;
        order.Total = subtotal + order.ShippingCost;

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        // 3. Crear preferencia en MercadoPago
        MercadoPagoConfig.AccessToken = _config["MercadoPago:AccessToken"];

        var mpItems = order.Items.Select(i => new PreferenceItemRequest
        {
            Title = i.ProductName,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            CurrencyId = "ARS"
        }).ToList();

        var preferenceRequest = new PreferenceRequest
        {
            Items = mpItems,
            Payer = new PreferencePayerRequest
            {
                Name = req.BuyerName,
                Email = req.BuyerEmail,
            },
            BackUrls = new PreferenceBackUrlsRequest
            {
                Success = $"{_config["Cors:AllowedOrigins:0"]}/checkout/success?orderId={order.Id}",
                Failure = $"{_config["Cors:AllowedOrigins:0"]}/checkout/failure?orderId={order.Id}",
                Pending = $"{_config["Cors:AllowedOrigins:0"]}/checkout/pending?orderId={order.Id}"
            },
            AutoReturn = "approved",
            ExternalReference = order.Id.ToString()
        };

        var client = new PreferenceClient();
        Preference preference = await client.CreateAsync(preferenceRequest);

        order.MercadoPagoPreferenceId = preference.Id;
        await _db.SaveChangesAsync();

        return Ok(new
        {
            orderId = order.Id,
            preferenceId = preference.Id,
            initPoint = preference.InitPoint,      // URL para producción
            sandboxInitPoint = preference.SandboxInitPoint // URL para testing
        });
    }

    /// <summary>Webhook de MercadoPago — notificaciones de pago</summary>
    [HttpPost("webhook")]
    public async Task<IActionResult> MercadoPagoWebhook([FromQuery] string type, [FromQuery] string dataId)
    {
        if (type != "payment") return Ok();

        // En una implementación real, consultar la API de MP para verificar el pago
        // Por ahora, actualizamos por external_reference
        return Ok();
    }

    /// <summary>Listar órdenes [Admin]</summary>
    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetAll([FromQuery] OrderStatus? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _db.Orders.Include(o => o.Items).AsQueryable();
        if (status.HasValue) query = query.Where(o => o.Status == status);

        var total = await query.CountAsync();
        var orders = await query.OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(new { total, page, pageSize, data = orders });
    }

    /// <summary>Obtener orden por ID [Admin o dueño]</summary>
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        return order is null ? NotFound() : Ok(order);
    }

    /// <summary>Actualizar estado de orden [Admin]</summary>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest req)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order is null) return NotFound();
        order.Status = req.Status;
        order.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Ok(order);
    }
}

public record CreateOrderRequest(
    string BuyerName,
    string BuyerEmail,
    string? BuyerPhone,
    string? ShippingAddress,
    string? ShippingCity,
    string? ShippingProvince,
    string? ShippingPostalCode,
    decimal ShippingCost,
    string? Notes,
    List<OrderItemRequest> Items);

public record OrderItemRequest(int ProductId, int Quantity);
public record UpdateStatusRequest(OrderStatus Status);
