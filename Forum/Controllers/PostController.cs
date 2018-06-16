using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Forum.Controllers;
using Forum.Models;
using Microsoft.AspNetCore.Mvc;

namespace Forum_v2.Controllers
{
    [Produces("application/json")]
    [Route("api/Post")]
    public class PostController : Controller
    {
        private const string CON_STRING =
            "Data Source=cekt.cthfkz924m2h.eu-central-1.rds.amazonaws.com;" +
            "Initial Catalog=cektdata;" +
            "User id=master;" +
            "Password=cekt2018;";

        // GET: api/Post
        [HttpGet]
        public async Task<IEnumerable<ForumPost>> Get(int key)
        {
            if (!Sessions.IsValidSession(key))
            {
                List<ForumPost> temp = new List<ForumPost>();
                temp.Add(new ForumPost(key.ToString(), "date", "user"));
                return temp;
                //return null;
            }
            try
            {
                List<ForumPost> posts = new List<ForumPost>();
                using (SqlConnection connection = new SqlConnection(CON_STRING))
                {
                    await connection.OpenAsync();
                    const string commandString = "SELECT * FROM [dbo].[message] ORDER BY sendDate ASC;";

                    using (SqlCommand command = new SqlCommand(commandString, connection))
                    {
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                posts.Add(new ForumPost(reader.GetString(1), (reader.GetDateTime(2)).ToShortTimeString(), reader.GetString(3)));
                            }
                            return posts.ToArray();
                        }
                    }
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        // GET: api/Post/5
        [HttpGet("{id}")]
        public async Task<ForumPost> Get(int id, int key)
        {
            if (!Sessions.IsValidSession(key))
            {
                return null;
            }
            try { 
                using (SqlConnection connection = new SqlConnection(CON_STRING))
                {
                    await connection.OpenAsync();
                    const string commandString = "SELECT * FROM [dbo].[message] " +
                        "WHERE id = @id;";

                    using (SqlCommand command = new SqlCommand(commandString, connection))
                    {
                        command.Parameters.AddWithValue("id", id);
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                string message = reader.GetString(1);
                                string sendDate = (reader.GetDateTime(2)).ToShortTimeString();
                                string username = reader.GetString(3);
                                username = Regex.Replace(username, " ", "");
                                //return new ForumUser(username,  + ":" + Regex.Replace(password, " ", ""));
                                return new ForumPost(message, sendDate, username);
                            }
                            return null;
                        }
                    }
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        // POST: api/Post
        [HttpPost]
        public async Task<ForumPost> Post([FromBody]ForumPost post, int key)
        {
            if (!Sessions.IsValidSession(key))
            {
                return null;
            }
            try
            {
                using (SqlConnection connection = new SqlConnection(CON_STRING))
                {
                    await connection.OpenAsync();
                    const string commandString = "INSERT INTO [dbo].[message](message, sendDate, username) VALUES ( @text, GETDATE(), @username);";

                    using (SqlCommand command = new SqlCommand(commandString, connection))
                    {
                        command.Parameters.AddWithValue("username", post.Username);
                        command.Parameters.AddWithValue("text", post.Text);
                        int lines = await command.ExecuteNonQueryAsync();
                        if (lines != 0)
                        {
                            var payload = new PushNotificationPayload
                            {
                                Msg = post.Text,
                                Icon = "C:/Temp/icon192x192.png",
                            };
                            ForumPostSubscriptions.PushAllSubs(payload);
                            return post;
                        }
                        return null;
                    }
                }
            }
            catch(Exception)
            {
                return null;
            }
}
        
        // PUT: api/Post/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }
        
        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
