import { Component, Injector, Inject } from '@angular/core';
import { MessengerService } from '../services/messenger.service';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { ForumUser } from '../data/ForumUser';

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
        private router: Router,
        private http: Http,
        @Inject('BASE_URL') private baseUrl: string
    ) {
        AppInjector = this.injector;
    }
	public onClick(username:string, password:string)
    {
        console.log("Sign in");
		//var username = ((document.getElementById("inputUser") as HTMLInputElement).value);
        //var password = ((document.getElementById("inputPassword") as HTMLInputElement).value);
        this.http.get(this.baseUrl + 'api/User/' + username +
            "?password=" + password).subscribe(result => {
                console.log("Result!!!");
                let user = result.json() as ForumUser;
                if (user) {
                    console.log("Correct User!!!");
                    console.log(user.username + ", " + user.lastOnline)
                    AppInjector.get(MessengerService).changeMessage("loggedIn");
                    this.router.navigate(['home']);
                }
                else {

                    console.log("Wrong User!!!");
                }
            });	
		//ToDo Check Username and Password from Database
		/*if (username === "admin" && password === "admin")
		{
			AppInjector.get(MessengerService).changeMessage("loggedIn");
			this.router.navigate(['home']);
		}*/	
	}
	
}

