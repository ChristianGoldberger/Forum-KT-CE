using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Forum_v2.Models;
using Microsoft.AspNetCore.Http;
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
        public async Task<IEnumerable<ForumPost>> Get(DateTime lastOnline)
        {
            List<ForumPost> users = new List<ForumPost>();
            using (SqlConnection connection = new SqlConnection(CON_STRING))
            {
                await connection.OpenAsync();
                const string commandString = "SELECT * FROM [dbo].[message]" +
                    "WHERE sendDate > @value;";

                using (SqlCommand command = new SqlCommand(commandString, connection))
                {
                    command.Parameters.AddWithValue("value", lastOnline);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            users.Add(new ForumPost(reader.GetString(1), (reader.GetDateTime(2)).ToShortTimeString(), reader.GetString(3)));
                        }
                        return users.ToArray();
                    }
                }
            }
        }

        // GET: api/Post/5
        [HttpGet("{id}")]
        public async Task<ForumPost> Get(int id)
        {
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

        // POST: api/Post
        [HttpPost]
        public async Task<ForumPost> Post([FromBody]ForumPost post)
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
                        return post;
                    }
                    return null;
                }
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
