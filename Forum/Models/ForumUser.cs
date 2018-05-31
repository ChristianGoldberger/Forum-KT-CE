using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Forum_v2.Models
{
    public class ForumUser
    {
        public ForumUser(string username, string password, string lastOnline)
        {
            this.Username = username;
            this.LastOnline = lastOnline;
            this.Password = password;
        }
        public string Username { get; set; }
        public string Password { get; set; }
        public string LastOnline { get; set; }
    }
}
