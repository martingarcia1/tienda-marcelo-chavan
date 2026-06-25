using Microsoft.EntityFrameworkCore;
using MarceloChavan.API.Models;

namespace MarceloChavan.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User - email único
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // BlogPost - slug único
        modelBuilder.Entity<BlogPost>()
            .HasIndex(b => b.Slug)
            .IsUnique();

        // Product → Category (restrict delete para no borrar categoría con productos)
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // OrderItem → Order
        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // OrderItem → Product (restrict para preservar historial)
        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // Review → Product
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Product)
            .WithMany(p => p.Reviews)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Review → User (set null si el usuario se borra)
        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Order → User (set null si el usuario se borra)
        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Seed: Categorías iniciales para joyería de platería
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Anillos", Description = "Anillos de plata artesanales", IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
            new Category { Id = 2, Name = "Collares", Description = "Collares y cadenas de plata", IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
            new Category { Id = 3, Name = "Pulseras", Description = "Pulseras de plata artesanales", IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
            new Category { Id = 4, Name = "Aros", Description = "Aros y aretes de plata", IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
            new Category { Id = 5, Name = "Dijes", Description = "Dijes y colgantes de plata", IsActive = true, CreatedAt = new DateTime(2025, 1, 1) },
            new Category { Id = 6, Name = "Sets", Description = "Conjuntos y sets de joyería", IsActive = true, CreatedAt = new DateTime(2025, 1, 1) }
        );
    }
}
