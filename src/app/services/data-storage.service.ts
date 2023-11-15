import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";

import { PostsService } from "./posts.service";
import { Post } from "../models/post.model";

import { UserService } from "./user.service";

@Injectable({ providedIn: 'root' })

export class DataStorageService {
    constructor(
        private http: HttpClient,
        private postsService: PostsService,
        private userService: UserService
    ) { }

    urlFireStore: string = 'https://my-app-angular-beb02-default-rtdb.europe-west1.firebasedatabase.app/posts.json'
    urlFireStoreForUsers: string = 'https://my-app-angular-beb02-default-rtdb.europe-west1.firebasedatabase.app/users.json'

    storePosts() {
        const posts = this.postsService.getPosts()
        return this.http.put(this.urlFireStore, posts).subscribe(

        )
    }

    fetchPosts() {
        return this.http.get<Post[]>(this.urlFireStore).pipe(
            map(posts => {
                return posts.map(post => {
                    return { ...post, comments: post.comments ? post.comments : []}
                })
            }), tap(response => {
                this.postsService.setPosts(response)
            }) 
        )
    }

    storeUser() {
        const users = this.userService.getUsers()
        return this.http.put(this.urlFireStoreForUsers, users).subscribe(

        )
    } 

    fetchUsers() {
        return this.http.get<any[]>(this.urlFireStoreForUsers).pipe(
            map(users => {
                return users.map(user => {
                    return {...user}
                })
            }), tap(response => {
                this.userService.setUsers(response)
            })
        )
    }
}