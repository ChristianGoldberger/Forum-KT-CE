using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Forum_v2.Models
{
    public class ForumPost
    {
        public ForumPost(string text, string time, string username)
        {
            this.Text = text;
            this.Username = username;
            this.LastOnline = time;
        }
        public string Text { get; set; }
        public string Username { get; set; }
        public string LastOnline { get; set; }
    }
}
