import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessengerService } from '../services/messenger.service';

export let AppInjector: Injector;
@Component({
    selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent
{

	constructor(private router: Router) { }
	
	public checkPassword()
	{
		var pw = ((document.getElementById("registerPassword") as HTMLInputElement).value);
		var confirmedPw = ((document.getElementById("confirmPassword") as HTMLInputElement).value);

		console.log("PW:" + pw);
		console.log("Confirmed:" + confirmedPw);
		console.log("checkPassword");
		if (pw === confirmedPw)
		{
			console.log("Password is the same");
			//this.location.replaceState('/'); // clears browser history so they can't navigate with back button
			this.router.navigate(['login']);
		}

	}
	//constructor(
	//	private messengerService: MessengerService,
	//	private injector: Injector
	//) {
	//	AppInjector = this.injector;
	//}
	//public onClick()
	//{
		
	//	AppInjector.get(MessengerService).changeMessage("loggedIn");
		
	//}
	
}
