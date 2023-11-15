import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) {  }

  private userSub!: Subscription

  isAuthenticated: boolean = false

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user
      if(localStorage.getItem('loggedUser')) {
        this.isAuthenticated = true
      } else { 
        this.isAuthenticated = false
      }
    })
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe()
  }

  onLogout() {
    this.authService.logout()
  }
}
