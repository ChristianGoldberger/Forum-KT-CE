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

        // GET: api/Notification
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Notification/5
        [HttpGet("{id}", Name = "Get")]
        public string Get(int id)
        {
            return "value";
        }
        
        // POST: api/Notification
        [HttpPost]
        public async Task<PushNotificationModel> Post([FromBody]PushNotificationModel subscription)
        {
            try
            {
                var pushSubscription = new PushSubscription(subscription.Endpoint, subscription.Key, subscription.AuthSecret);
                var vapidDetails = new VapidDetails("http://localhost:50973/forum", "BAdnuHOxwOFm_GV_NYG1CZOjddlrVfDbKobDFTTxQvgcGBhPI47gkxfEUdtgX2iO_x4PwUkyj-xS7Uke_UmIaqQ",
                    "vrRVfvxyx4kIEYSfansI_eOI4a-HdTCJpa0EVmjLYnE");

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

                return new PushNotificationModel("a", "b", temp);
            }
            catch(Exception ex)
            {
                return new PushNotificationModel("a", ex.ToString(), ex.Message);
            }
            /*
            //TODO; store pushsubscription for later use

            // send notification 
            var payload = new PushNotificationPayload
            {
                Msg = "Thank you for subscribing",
                Icon = "C:/Temp/icon192x192.png"
            };
            try
            {
                await webPushClient.SendNotificationAsync(pushSubscription, JsonConvert.SerializeObject(payload), vapidDetails);
            }
            catch (WebPushException exception)
            {
                var statusCode = exception.StatusCode;
                return false;
            }

            return false;*/

        }
        
        // PUT: api/Notification/5
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

    internal class PushNotificationPayload
    {
        public string Msg { get; set; }
        public string Icon { get; set; }
    }
}
