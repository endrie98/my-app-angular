import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }

  private userSub!: Subscription

  isAuthenticated: boolean = false
  userInfo!: User

  onLogout() {
    this.authService.logout()
  }

  ngOnInit(): void {
      this.userSub = this.authService.user.subscribe(user => {
        this.isAuthenticated = !!user
        if(localStorage.getItem('loggedUser')) {
          this.isAuthenticated = true
          let final: any = localStorage.getItem('loggedUser')
          this.userInfo = JSON.parse(final)
        } else {
          this.isAuthenticated = false
        }
      })
  }

  ngOnDestroy(): void {
      this.userSub.unsubscribe()
  }

}
