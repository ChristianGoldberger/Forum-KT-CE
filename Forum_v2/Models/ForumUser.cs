using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Forum_v2.Models
{
    public class ForumUser
    {
        public ForumUser(string username, string lastOnline)
        {
            this.Username = username;
            this.LastOnline = lastOnline;
        }
        public string Username { get; set; }
        public string LastOnline { get; set; }
    }
}
