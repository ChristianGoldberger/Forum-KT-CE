import { Component, Injector, Inject } from '@angular/core';
import { MessengerService } from '../services/messenger.service';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { ForumUser } from '../data/ForumUser';
import { HttpClient } from '@angular/common/http';

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
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string
    ) {
        AppInjector = this.injector;
    }
	public onClick(username:string, password:string)
    {
        console.log("Sign in");
        if (username.length == 0 || password.length == 0) {
            console.log("Kein Username oder PW angegeben");

        } else {
        this.http.get(this.baseUrl + 'api/User/' + username +
            "?password=" + password).subscribe(result => {
                console.log("Result!!!");
                let user = result as ForumUser;
                if (user) {
                    console.log("Correct User!!!");
                    console.log(user.username + ", " + user.lastOnline)
                    AppInjector.get(MessengerService).changeMessage(JSON.stringify(user));
                    this.router.navigate(['home']);
                }
                else {

                    console.log("Wrong User!!!");
                }
                });	
        }
	}
	
}

