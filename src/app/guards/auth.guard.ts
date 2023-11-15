import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take, tap } from "rxjs";

import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.user.pipe(take(1), map(user => {
            const isAuth = !!user
            let isUser: boolean = false

            if (localStorage.getItem('loggedUser')) {
                isUser = true
            } else isUser = false

            if (isAuth || isUser) {
                return true
            }

            return this.router.createUrlTree(['/login'])
        })
        )
    }
}