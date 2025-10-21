using Microsoft.AspNetCore.Mvc;
using UserProfileService.Models;

namespace UserProfileService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserProfileController : ControllerBase
    {
        private static List<UserProfile> _users = new List<UserProfile>();

        // GET: api/UserProfile
        [HttpGet]
        public IActionResult GetAll() => Ok(_users);

        // GET: api/UserProfile/1
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user == null) return NotFound("User not found");
            return Ok(user);
        }

        // POST: api/UserProfile
        [HttpPost]
        public IActionResult Create(UserProfile user)
        {
            user.Id = _users.Count + 1;
            _users.Add(user);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        // PUT: api/UserProfile/1
        [HttpPut("{id}")]
        public IActionResult Update(int id, UserProfile updatedUser)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user == null) return NotFound("User not found");

            user.FullName = updatedUser.FullName;
            user.Email = updatedUser.Email;
            user.PhoneNumber = updatedUser.PhoneNumber;
            user.VehicleNumber = updatedUser.VehicleNumber;
            user.WalletBalance = updatedUser.WalletBalance;

            return Ok(user);
        }

        // DELETE: api/UserProfile/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user == null) return NotFound("User not found");
            _users.Remove(user);
            return NoContent();
        }

        // PATCH: api/UserProfile/1/wallet/add?amount=50
        [HttpPatch("{id}/wallet/add")]
        public IActionResult AddToWallet(int id, [FromQuery] decimal amount)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user == null) return NotFound("User not found");
            user.WalletBalance += amount;
            return Ok(user);
        }
    }
}
