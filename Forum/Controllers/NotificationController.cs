using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Forum.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using WebPush;

namespace Forum.Controllers
{
    [Produces("application/json")]
    [Route("api/Notification")]
    public class NotificationController : Controller
    {
        private readonly VapidSettings _vapidSettings;

        public NotificationController(IOptions<VapidSettings> vapidSettings)
        {
            _vapidSettings = vapidSettings.Value;
        }
        
        // POST: api/Notification
        [HttpPost]
        public async Task<bool> Post([FromBody]PushNotificationModel subscription)
        {
            try
            {
                var pushSubscription = new PushSubscription(subscription.Endpoint, subscription.Key, subscription.AuthSecret);
                var vapidDetails = new VapidDetails("http://localhost:50973/forum", "BAdnuHOxwOFm_GV_NYG1CZOjddlrVfDbKobDFTTxQvgcGBhPI47gkxfEUdtgX2iO_x4PwUkyj-xS7Uke_UmIaqQ",
                    "vrRVfvxyx4kIEYSfansI_eOI4a-HdTCJpa0EVmjLYnE");

                ForumPostSubscriptions.AddSubscription(pushSubscription);

                var webPushClient = new WebPushClient();
                webPushClient.SetVapidDetails(vapidDetails);

                var payload = new PushNotificationPayload
                {
                    Msg = "Thank you for subscribing",
                    Icon = "C:/Temp/icon192x192.png",
                };
                string temp = JsonConvert.SerializeObject(payload);

                //await webPushClient.SendNotificationAsync(pushSubscription, temp, );
                await webPushClient.SendNotificationAsync(pushSubscription, temp, vapidDetails);

                return true;
            }
            catch(Exception ex)
            {
                return false;
            }

        }
        
    }
}
