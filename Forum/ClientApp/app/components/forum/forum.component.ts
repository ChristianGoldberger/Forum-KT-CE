import { Component, Injectable, Inject } from '@angular/core';
import { MessengerService } from '../services/messenger.service';
import { ForumUser } from '../data/ForumUser';
import { ForumPost } from '../data/ForumPost';
import { Jsonp } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppInjector } from '../navmenu/navmenu.component';

@Component({
    selector: 'forum',
    templateUrl: './forum.component.html'
})
@Injectable()
export class ForumComponent {
    user: ForumUser;

    constructor(private messengerService: MessengerService,
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) { };

    ngOnInit() {
        //process initial message
        this.messengerService.currentMessage.subscribe((message) => {
            if (message === "default message" || message === "loggedOut") {
                return;
            }
            this.user = JSON.parse(message) as ForumUser;
            if (this.user) {
                console.log('ForumK; Received Sessionkey: ' + this.user.password);

                this.http.get(this.baseUrl + 'api/Post?key=' + this.user.password).subscribe(result => {
                    console.log("Messages received!!!");
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
}
