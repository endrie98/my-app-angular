import { Component, OnDestroy, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthResponse, AuthService } from 'src/app/services/auth.service';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { UserService } from 'src/app/services/user.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceHolderDirective } from 'src/app/shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnDestroy, OnInit {

  isLoading = false
  error: any = null
  @ViewChild(PlaceHolderDirective) alertHost!: PlaceHolderDirective

  private closeSub!: Subscription

  constructor(
    private authService: AuthService, 
    private dataStorage: DataStorageService, 
    private userService: UserService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
    ) {  }

  onSubmit(formValue: NgForm) {
    if(!formValue.valid) {
      return
    }
    
    const username = formValue.value.username
    const email = formValue.value.email
    const password = formValue.value.password

    this.isLoading = true

    let authObs: Observable<AuthResponse>

    authObs = this.authService.signUp(username, email, password)

    authObs.subscribe(
      responseData => {
        let final = {...responseData, userName: username}
        localStorage.setItem('loggedUser', JSON.stringify(final))
        this.userService.addUser(final)
        this.dataStorage.storeUser()
        this.router.navigate(['/allPosts'])
        this.isLoading = false
      }, errorMessage => {
        this.showAlertError(errorMessage)
        this.error = errorMessage
        this.isLoading = false
      }
    )

    formValue.reset()
  }

  onHandleError() {
    this.error = null
  }

  private showAlertError (message: string) {
    // const alertCmp = new AlertComponent() // isn't okay
    const alertCmpFacyory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
    const hostViewContainerRef = this.alertHost.viewContainerRef
    hostViewContainerRef.clear()

    const componentRef = hostViewContainerRef.createComponent(alertCmpFacyory)

    componentRef.instance.message = message
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe()
      hostViewContainerRef.clear()
    })
  }

  ngOnInit(): void {
      this.userService.userChanged.subscribe(res => {

      })

      this.dataStorage.fetchUsers().subscribe((response) => {

      })
  }

  ngOnDestroy(): void {
    if(this.closeSub) {
      this.closeSub.unsubscribe()
     }
  }

}
