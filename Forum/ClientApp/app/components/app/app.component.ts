import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../services/messenger.service';
import { ForumUser } from '../data/ForumUser';
import { Jsonp } from '@angular/http';


@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
    user: ForumUser;
    isLoggedIn = false;

    constructor(private messengerService: MessengerService) { };

	ngOnInit() {
		//process initial message
		this.messengerService.currentMessage.subscribe((message) =>
        {
            if (message === "default message") {
                return;
            }
            if (!message || message === "loggedOut") {
                this.isLoggedIn = false;
                console.log('Received Message:' + message);
                return;
            }
            this.user = JSON.parse(message) as ForumUser;
			if (this.user) {
				this.isLoggedIn = true;
				console.log('Received Message: user');
			}
		});
	}

}
