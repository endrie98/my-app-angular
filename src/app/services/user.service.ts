import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';


@Injectable({
    providedIn: 'root'
})

export class UserService {
    userChanged = new Subject<User[]>()

    constructor () { }

    private users: User[] = []

    setUsers(user: any) {
        this.users = user
        this.userChanged.next(this.users.slice())
    }

    getUser(index: number) {
        return this.users[index]
    }

    addUser(user: any) {
        this.users.push(user)
        this.userChanged.next(this.users.slice())
    }

    getUsers() {
        return this.users.slice()
    }
}