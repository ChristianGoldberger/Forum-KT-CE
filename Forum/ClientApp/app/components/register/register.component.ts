import { Component, Injector, Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MessengerService } from '../services/messenger.service';
import { ForumUser } from '../data/ForumUser';
import { HttpHeaders, HttpClient } from '@angular/common/http';


export let AppInjector: Injector;
@Component({
    selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent
{

    constructor(private messengerService: MessengerService,
        private injector: Injector,
        private router: Router,
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string)
    {
        AppInjector = this.injector;
    }
	
	public checkPassword()
    {
        let usern : string = ((document.getElementById("registerUsername") as HTMLInputElement).value);
		let pw : string = ((document.getElementById("registerPassword") as HTMLInputElement).value);
		let confirmedPw : string = ((document.getElementById("confirmPassword") as HTMLInputElement).value);

		console.log("PW:" + pw);
		console.log("Confirmed:" + confirmedPw);
		console.log("checkPassword");
		if (pw === confirmedPw)
		{
            console.log("Password is the same");
            
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            };

            this.http.post(this.baseUrl + 'api/User/', JSON.stringify({ username: usern, password: pw, lastOnline: "" } as ForumUser), httpOptions)
                .subscribe(result => {
                    if (result) {
                        console.log("Registrieren erfolgreich");
                        let user = result as ForumUser;
                        console.log(user.username + ", " + user.password + ", " + user.lastOnline);
                        AppInjector.get(MessengerService).changeMessage("loggedIn");
                        this.router.navigate(['home']);
                    }
                    else {
                        console.log("Registrieren fehlgeschlagen");
                        this.router.navigate(['login']);
                    }
            });
			//this.location.replaceState('/'); // clears browser history so they can't navigate with back button
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
