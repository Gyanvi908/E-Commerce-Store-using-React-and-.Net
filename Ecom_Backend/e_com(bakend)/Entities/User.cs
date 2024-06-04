

using ecom.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;

namespace ecom.Entities
{
    public class User : IdentityUser<int>
    {
        public UserAddress Address { get; set; }
    }
}
