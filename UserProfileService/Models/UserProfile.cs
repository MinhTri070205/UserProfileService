namespace UserProfileService.Models
{
    public class UserProfile
    {
        public int Id { get; set; }
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string PhoneNumber { get; set; } = "";
        public string VehicleNumber { get; set; } = "";
        public decimal WalletBalance { get; set; }
    }
}
