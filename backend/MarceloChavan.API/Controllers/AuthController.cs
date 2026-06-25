using MarceloChavan.API.Data;
using MarceloChavan.API.Models;
using MarceloChavan.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MarceloChavan.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IJwtService _jwt;

    public AuthController(AppDbContext db, IJwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    /// <summary>Registrar nuevo cliente</summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict(new { message = "El email ya está registrado." });

        var user = new User
        {
            FirstName = req.FirstName,
            LastName = req.LastName,
            Email = req.Email.ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Phone = req.Phone,
            Role = "customer"
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new { token = _jwt.GenerateToken(user), user = MapUser(user) });
    }

    /// <summary>Login</summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email.ToLower());
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Email o contraseña incorrectos." });

        if (!user.IsActive)
            return Unauthorized(new { message = "Cuenta deshabilitada." });

        return Ok(new { token = _jwt.GenerateToken(user), user = MapUser(user) });
    }

    private static object MapUser(User u) => new
    {
        u.Id, u.FirstName, u.LastName, u.Email, u.Phone, u.Role
    };
}

public record RegisterRequest(string FirstName, string LastName, string Email, string Password, string? Phone);
public record LoginRequest(string Email, string Password);
