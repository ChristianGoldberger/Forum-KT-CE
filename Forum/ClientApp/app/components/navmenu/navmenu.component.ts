import { Component, Injector, Inject } from '@angular/core';
import { MessengerService } from '../services/messenger.service';
import { HttpClient } from '@angular/common/http';
import { ForumUser } from '../data/ForumUser';

export let AppInjector: Injector;
@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent {
    user: ForumUser;

	constructor(
		private messengerService: MessengerService,
        private injector: Injector,
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string
	) {
		AppInjector = this.injector;
    }
    ngOnInint() {
        this.messengerService.currentMessage.subscribe((message) => {
            if (message === "default message" || message === "loggedOut") {
                return;
            }
            this.user = JSON.parse(message) as ForumUser;
        });
    }

	public onLogOut() {
        this.http.put(this.baseUrl + 'api/User/username=' + this.user.username, {}).subscribe(result => {
            if (result) {
                AppInjector.get(MessengerService).changeMessage("loggedOut");
            }
            else {
                console.log("Ausloggen: Daten können nicht aktualisiert werden.");
            }
        });
	}

}
