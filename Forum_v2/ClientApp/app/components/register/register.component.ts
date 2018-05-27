import { Component, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessengerService } from '../services/messenger.service';
import { Http } from '@angular/http';

export let AppInjector: Injector;
@Component({
    selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent
{

    constructor(private router: Router,
        private http: Http,
        @Inject('BASE_URL') private baseUrl: string) { }
	
	public checkPassword()
    {
        let username = ((document.getElementById("registerUsername") as HTMLInputElement).value);
		let pw = ((document.getElementById("registerPassword") as HTMLInputElement).value);
		let confirmedPw = ((document.getElementById("confirmPassword") as HTMLInputElement).value);

		console.log("PW:" + pw);
		console.log("Confirmed:" + confirmedPw);
		console.log("checkPassword");
		if (pw === confirmedPw)
		{
            console.log("Password is the same");
            this.http.post(this.baseUrl + 'api/User/' + username +
                "?password=" + pw)
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
