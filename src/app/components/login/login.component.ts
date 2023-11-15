import { Component, OnDestroy, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthResponse, AuthService } from 'src/app/services/auth.service';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceHolderDirective } from 'src/app/shared/placeholder/placeholder.directive';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  isLoading = false
  error: any = null
  @ViewChild(PlaceHolderDirective) alertHost!: PlaceHolderDirective

  private closeSub!: Subscription

  constructor(
    private router: Router, 
    private authService: AuthService, 
    private dataStorage: DataStorageService,
    private componentFactoryResolver: ComponentFactoryResolver
    ) { }

  onSubmit(formValue: NgForm) {
    if(!formValue.valid) {
      return
    }

    const email = formValue.value.email
    const password = formValue.value.password
    const userName = ''

    this.isLoading = true

    let authObs: Observable<AuthResponse>

    authObs = this.authService.login(userName, email, password)

    authObs.subscribe(
      responseData => {
        let userDataFromLocalStorage:any = localStorage.getItem('userData')
        let finalUserData = JSON.parse(userDataFromLocalStorage)
        if(localStorage.getItem('loggedUser') === null && localStorage.getItem('userData') !== null) {
          this.dataStorage.fetchUsers().subscribe(dataUsers => {
            for(let i=0; i<dataUsers.length; i++) {
              if(dataUsers[i].localId === finalUserData.id) {
                localStorage.setItem('loggedUser', JSON.stringify(dataUsers[i]))
                this.authService.user.next(dataUsers[i])
              }
            }
          })
        }
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

  private showAlertError(message: string) {
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

  ngOnDestroy(): void {
      if(this.closeSub) {
        this.closeSub.unsubscribe()
      }
  }
}
