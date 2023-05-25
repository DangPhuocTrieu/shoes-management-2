import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  isAuthPage = true

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login' || event.url === '/signup') {
          this.isAuthPage = true
        } else {
          this.isAuthPage = false
        }
      }
    })
  }

}
