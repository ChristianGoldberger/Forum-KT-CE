import { Component, Injector } from '@angular/core';
import { MessengerService } from '../services/messenger.service';

export let AppInjector: Injector;
@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent {
	constructor(
		private messengerService: MessengerService,
		private injector: Injector
	) {
		AppInjector = this.injector;
	}
	public onClick() {

		AppInjector.get(MessengerService).changeMessage("loggedOut");

	}

}
