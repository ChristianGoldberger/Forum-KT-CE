using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Forum.Models
{
    public class VapidSettings
    {
        public VapidSettings(string subject, string publicKey, string privateKey)
        {
            this.Subject = subject;
            this.PublicKey = publicKey;
            this.PrivateKey = privateKey;
        }
        public VapidSettings() { }
        public string Subject { get; set; }
        public string PublicKey { get; set; }
        public string PrivateKey { get; set; }
    }
}
