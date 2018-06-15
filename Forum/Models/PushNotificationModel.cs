using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Forum.Models
{
    public class PushNotificationModel
    {
        public PushNotificationModel(string key, string endpoint, string authSecret)
        {
            this.Endpoint = endpoint;
            this.Key = key;
            this.AuthSecret = authSecret;
        }
        public string Key { get; set; }
        public string Endpoint { get; set; }
        public string AuthSecret { get; set; }
    }
}
