import { Component, Injectable, Inject } from '@angular/core';
import { MessengerService } from '../services/messenger.service';
import { ForumUser } from '../data/ForumUser';
import { ForumPost } from '../data/ForumPost';
import { Jsonp } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppInjector } from '../navmenu/navmenu.component';
import { PushNotificationModel } from '../data/PushNotificationModel';
import { Payload } from '../data/Payload';

@Component({
    selector: 'forum',
    templateUrl: './forum.component.html'
})
@Injectable()
export class ForumComponent {
    user: ForumUser;
    pushIsSupported: boolean = 'serviceWorker' in navigator && 'PushManager' in window;
    vapidPublicKey: string = 'BAdnuHOxwOFm_GV_NYG1CZOjddlrVfDbKobDFTTxQvgcGBhPI47gkxfEUdtgX2iO_x4PwUkyj-xS7Uke_UmIaqQ';

    constructor(private messengerService: MessengerService,
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) { };

    ngOnInit() {
        //process initial message
        this.messengerService.currentMessage.subscribe((message) => {
            if (message === "default message" || message === "loggedOut") {
                return;
            }
            let obj = JSON.parse(message) as ForumUser;
            
            if (obj) {
                this.user = obj;
                console.log('ForumK; Received Sessionkey: ' + this.user.password);

                this.http.get(this.baseUrl + 'api/Post?key=' + this.user.password).subscribe(result => {
                    console.log(this.baseUrl);
                    if (result) {
                        let posts = result as ForumPost[];

                        posts.forEach(post => {
                            this.appendForumPost(post.username, post.text);
                        });
                    }
                    else {
                        console.log("Keine Messages...");
                    }
                });
                this.subscribeToPushNotifications();
            }
            else {
                console.log("Message received")
                let obj = JSON.parse(message) as Payload;

                if (obj) {
                    this.appendForumPost("abcdefgh", obj.Msg);
                }
            }
        });
    }

    sendForumPost(text : string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        this.http.post(this.baseUrl + 'api/Post?key=' + this.user.password,
            JSON.stringify({ text: text, sendDate: "", username: this.user.username } as ForumPost), httpOptions)
            .subscribe(result => {
                if (result) {
                    console.log("Senden erfolgreich");
                    let post = result as ForumPost;
                    console.log(post.text + ", " + post.username);

                    this.appendForumPost(post.username, post.text);
                }
                else {
                    console.log("Senden fehlgeschlagen");
                    //TODO: Fehlernachricht - Session abgelaufen
                    this.http.put(this.baseUrl + 'api/User/username=' + this.user.username, {}).subscribe(result => {
                        if (result) {
                            AppInjector.get(MessengerService).changeMessage("loggedOut");
                        }
                        else {
                            console.log("Ausloggen: Daten können nicht aktualisiert werden.");
                        }
                    });
                }
            });
    }

    private appendForumPost(username : string, text : string) {
        let table = (document.getElementById("posts") as HTMLTableElement);
        let row = document.createElement("tr");

        let textCol = document.createElement("td");
        textCol.innerHTML = text;

        let userCol = document.createElement("td");
        userCol.innerHTML = username;

        row.appendChild(textCol);
        row.appendChild(userCol);
        table.appendChild(row);
    }

    subscribeToPushNotifications() {
        if (this.pushIsSupported) {
            
            navigator.serviceWorker.ready
                .then(serviceWorkerRegistration => {
                    serviceWorkerRegistration.pushManager.getSubscription()
                        .then(subscription => {
                            if (subscription) {
                                // subscription present, no need to register subscription again
                                console.log("Already subscribed");
                                return;
                            }
                            return serviceWorkerRegistration.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
                            })
                            .then(subscription => {
                                const rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
                                const key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
                                const rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
                                const authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
                                const endpoint = subscription.endpoint;

                                //const pushNotificationSubscription = new PushNotificationModel(key, endpoint, authSecret);
                                console.log(key + ", " + ", " + endpoint + ", " + authSecret);
                                

                                const httpOptions = {
                                    headers: new HttpHeaders({
                                        'Content-Type': 'application/json'
                                    })
                                };
                                //navigator.serviceWorker.startMessages();
                                this.http.post(this.baseUrl + 'api/Notification',
                                    JSON.stringify({ key: key, endpoint: endpoint, authSecret: authSecret } as PushNotificationModel),
                                    httpOptions)
                                    .subscribe(response => {
                                        
                                        console.log(response);
                                    });

                                /*this.http.fetch('pushNotificationSubscriptions', {
                                    method: 'POST',
                                    body: json(pushNotificationSubscription)
                                }).then(response => {
                                    if (response.ok) {
                                        console.log('Push notification registration created!');
                                    }
                                    else {
                                        console.log('Ooops something went wrong');
                                    }
                                });*/
                             });
                        });
                })
        }
    }

    private urlBase64ToUint8Array(base64String:string) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}
