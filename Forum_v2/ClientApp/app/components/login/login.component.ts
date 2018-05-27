import { Component, Injector } from '@angular/core';
import { MessengerService } from '../services/messenger.service';
import { Router } from '@angular/router';

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
		private injector: Injector,
		private router: Router
	) {
		AppInjector = this.injector;
	}
	public onClick()
	{
		var username = ((document.getElementById("inputUser") as HTMLInputElement).value);
		var password = ((document.getElementById("inputPassword") as HTMLInputElement).value);
		//ToDo Check Username and Password from Database
		if (username === "admin" && password === "admin")
		{
			AppInjector.get(MessengerService).changeMessage("loggedIn");
			this.router.navigate(['home']);
		}

		
		
	}
	
}
