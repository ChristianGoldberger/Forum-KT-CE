import { Component, Injector } from '@angular/core';
import { MessengerService } from '../services/messenger.service';

export let AppInjector: Injector;
@Component({
    selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent
{
	constructor(
		private messengerService: MessengerService,
		private injector: Injector
	) {
		AppInjector = this.injector;
	}
	public onClick()
	{
		
		AppInjector.get(MessengerService).changeMessage("loggedIn");
		
	}
	
}
