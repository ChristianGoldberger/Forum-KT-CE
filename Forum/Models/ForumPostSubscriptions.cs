using Forum.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebPush;
using Forum.Models;
using Newtonsoft.Json;

namespace Forum.Models
{
    public static class ForumPostSubscriptions
    {
        private static LinkedList<PushSubscription> subs = new LinkedList<PushSubscription>();

        public static void AddSubscription(PushSubscription sub)
        {
            subs.AddLast(sub);
        }
        public static async void PushAllSubs(PushNotificationPayload payload)
        {
            var vapidDetails = new VapidDetails("http://localhost:50973/forum", "BAdnuHOxwOFm_GV_NYG1CZOjddlrVfDbKobDFTTxQvgcGBhPI47gkxfEUdtgX2iO_x4PwUkyj-xS7Uke_UmIaqQ",
                    "vrRVfvxyx4kIEYSfansI_eOI4a-HdTCJpa0EVmjLYnE");

            var webPushClient = new WebPushClient();
            webPushClient.SetVapidDetails(vapidDetails);

            string temp = JsonConvert.SerializeObject(payload);

            foreach (PushSubscription sub in subs)
            {
                try
                {
                    await webPushClient.SendNotificationAsync(sub, temp, vapidDetails);
                }
                catch (Exception)
                {

                }

            }
        }
    }
}
