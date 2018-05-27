import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../services/messenger.service';


@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{
	isLoggedIn = false;
	constructor(private messengerService: MessengerService) { };
	ngOnInit() {
		//process initial message
		this.messengerService.currentMessage.subscribe((message) =>
		{
			if (message === "loggedIn") {
				this.isLoggedIn = true;
				console.log('Received Message:' + message);
			}
			else if (message === "loggedOut")
			{
				this.isLoggedIn = false;
				console.log('Received Message:' + message);
			}
		});
	}

}
