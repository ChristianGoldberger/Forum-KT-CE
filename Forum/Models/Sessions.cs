using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Forum.Models
{
    public static class Sessions
    {
        private static Dictionary<int, DateTime> sessionkeys = new Dictionary<int, DateTime>();
        public static bool IsValidSession(int key)
        {
            DateTime time;
            sessionkeys.TryGetValue(key, out time);

            if (time != null)
            {
                if (DateTime.Now.CompareTo(time.AddMinutes(1)) > 0)
                {
                    sessionkeys.Remove(key);
                    return false;
                }
                sessionkeys[key] = DateTime.Now;
                return true;
            }
            return false;
        }

        public static int GenerateKey()
        {
            int key = Math.Abs(DateTime.Now.GetHashCode());
            sessionkeys.Add(key, DateTime.Now);
            return key;
        }
    }
}
