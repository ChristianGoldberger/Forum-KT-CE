using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Forum.Models
{
    public class ForumPost
    {
        public ForumPost(string text, string sendDate, string username)
        {
            this.Text = text;
            this.Username = username;
            this.SendDate = sendDate;
        }
        public string Text { get; set; }
        public string SendDate { get; set; }
        public string Username { get; set; }
    }
}
