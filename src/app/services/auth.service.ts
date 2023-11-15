import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";

import { User } from "../models/user.model";
import { environment } from "src/environments/environment";

export interface AuthResponse {
    userName: string,
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable({ providedIn: 'root' }) // even is in appModule providers need there too

export class AuthService {
    user = new BehaviorSubject<User | null>(null);

    private tokenExpirationTimer: any

    constructor(private http: HttpClient, private router: Router) { }

        private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknow error occurred!'
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage)
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exsits already'
                break;
            case "INVALID_LOGIN_CREDENTIALS":
                errorMessage = 'Invalid Credentials'
                break;
        }
        return throwError(errorMessage)
    }

    private handleAuthentication(userName: string, email: string, userId: string, token:string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
        const userModel = new User(userName, email, userId, token, expirationDate)
        this.user.next(userModel)
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(userModel)) 
    }

    login(userName:string, emailUser: string, passwordUser: string) {
        return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseConfig.apiKey,
            {
                userName: userName,
                email: emailUser,
                password: passwordUser,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(
                 responseData.userName,
                 responseData.email, 
                 responseData.localId, 
                 responseData.idToken,
                 +responseData.expiresIn
                 )
             })
        )
    }

    signUp(userName: string, emailUser: string, passwordUser: string) {
        return this.http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseConfig.apiKey,
            {
                userName: userName,
                email: emailUser,
                password: passwordUser,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError), 
            tap(responseData => {
               this.handleAuthentication(
                responseData.userName,
                responseData.email, 
                responseData.localId, 
                responseData.idToken,
                +responseData.expiresIn
                )
            })
        )
    }

    autoLogin() {
        let result:any = localStorage.getItem('loggedUser')

        const userData: {
            username: string,
            email:string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } =  JSON.parse(result)


        if(!userData) {
            return
        }

        const loadedUser = new User(
            userData.username,
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
        )
        
        if(loadedUser.token) {
            this.user.next(loadedUser)
            const exporationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
            this.autoLogout(exporationDuration)
        }
    }


    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout()
        }, expirationDuration)
    }

    logout() {
        this.user.next(null)
        localStorage.removeItem('userData')
        localStorage.removeItem('loggedUser')
        this.router.navigate(['/signup'])

        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer)
        }

        this.tokenExpirationTimer = null
    }
}