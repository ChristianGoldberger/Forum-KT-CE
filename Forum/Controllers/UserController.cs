using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Forum.Models;
using Microsoft.AspNetCore.Mvc;

namespace Forum_v2.Controllers
{
    [Produces("application/json")]
    [Route("api/User")]
    public class UserController : Controller
    {
        private const string CON_STRING =
            "Data Source=cekt.cthfkz924m2h.eu-central-1.rds.amazonaws.com;" +
            "Initial Catalog=cektdata;" +
            "User id=master;" +
            "Password=cekt2018;";

        // GET: api/User
        [HttpGet]
        public async Task<IEnumerable<ForumUser>> Get()
        {
            try
            { 
                List<ForumUser> users = new List<ForumUser>();
                using (SqlConnection connection = new SqlConnection(CON_STRING))
                {
                    await connection.OpenAsync();
                    const string commandString = "SELECT * FROM [dbo].[user];";

                    using (SqlCommand command = new SqlCommand(commandString, connection))
                    {
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                users.Add(new ForumUser(reader.GetString(0), "", (reader.GetDateTime(1)).ToShortTimeString()));
                            }
                            return users.ToArray();
                        }
                    }
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        // GET: api/User/5
        [HttpGet("{username}")]
        public async Task<ForumUser> Get(string username, string password)
        {
            try
            { 
                using (SqlConnection connection = new SqlConnection(CON_STRING))
                {
                    await connection.OpenAsync();
                    const string commandString = "SELECT * FROM [dbo].[user] " +
                        "WHERE username = @username;";

                    using (SqlCommand command = new SqlCommand(commandString, connection))
                    {
                        command.Parameters.AddWithValue("username", username);
                        using (SqlDataReader reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                string name = reader.GetString(0);
                                string lastOnline = (reader.GetDateTime(1)).ToShortTimeString();
                                string pwd = reader.GetString(2);
                                pwd = Regex.Replace(pwd, " ", "");
                                //return new ForumUser(username,  + ":" + Regex.Replace(password, " ", ""));
                                if (pwd.Equals(Regex.Replace(password, " ", "")))
                                {
                                    int key = Sessions.GenerateKey();
                                    return new ForumUser(username, key.ToString(), lastOnline);
                                }
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

        // POST: api/User
        [HttpPost]
        public async Task<ForumUser> Post([FromBody]ForumUser user)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(CON_STRING))
                {
                    await connection.OpenAsync();
                    const string commandString = "INSERT INTO [dbo].[user](username, lastOnline, pwd) SELECT @username, GETDATE(), @password " +
                        "WHERE NOT EXISTS (SELECT username FROM [dbo].[user] WHERE username = @username);";

                    using (SqlCommand command = new SqlCommand(commandString, connection))
                    {
                        command.Parameters.AddWithValue("username", user.Username);
                        command.Parameters.AddWithValue("password", user.Password);
                        int lines = await command.ExecuteNonQueryAsync();
                        if (lines != 0)
                        {
                            int key = Sessions.GenerateKey();
                            user.Password = key.ToString();
                            return user;
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

        // PUT: api/User/5
        [HttpPut("{username}")]
        public async Task<bool> Put(string username)
        {
            using (SqlConnection connection = new SqlConnection(CON_STRING))
            {
                await connection.OpenAsync();
                const string commandString = "UPDATE [dbo].[user] SET lastOnline = GETDATE() WHERE username = @username;";

                using (SqlCommand command = new SqlCommand(commandString, connection))
                {
                    command.Parameters.AddWithValue("username", username);
                    int lines = await command.ExecuteNonQueryAsync();
                    if (lines != 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            //Don't use?
        }
    }
}
