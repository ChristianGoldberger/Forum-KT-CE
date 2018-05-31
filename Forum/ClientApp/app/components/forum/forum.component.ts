import { Component, Injectable, Inject } from '@angular/core';
import { MessengerService } from '../services/messenger.service';
import { ForumUser } from '../data/ForumUser';
import { ForumPost } from '../data/ForumPost';
import { Jsonp } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
            if (message === "default message") {
                return;
            }
            this.user = JSON.parse(message) as ForumUser;
            if (this.user) {
                console.log('ForumK; Received Message: user');
            }
        });
    }

    sendForumPost(text : string) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        this.http.post(this.baseUrl + 'api/Post', JSON.stringify({ text: text, sendDate: "", username: this.user.username } as ForumPost), httpOptions)
            .subscribe(result => {
                if (result) {
                    console.log("Senden erfolgreich");
                    let post = result as ForumPost;
                    console.log(post.text + ", " + post.username);

                    let table = (document.getElementById("posts") as HTMLTableElement);
                    let row = document.createElement("tr");

                    let textCol = document.createElement("td");
                    textCol.innerHTML = post.text;

                    let userCol = document.createElement("td");
                    userCol.innerHTML = post.username;

                    row.appendChild(textCol);
                    row.appendChild(userCol);
                    table.appendChild(row);
                }
                else {
                    console.log("Senden fehlgeschlagen");
                }
            });
    }
}
