import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

import { DataStorageService } from "./data-storage.service";
import { PostsService } from "./posts.service";

@Injectable({
    providedIn: 'root'
})

export class PostResolveService {
    constructor (private dataStorage: DataStorageService, private postService: PostsService) {  }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const posts = this.postService.getPosts()

        if(posts.length === 0) {
            return this.dataStorage.fetchPosts()
        } else {
            return posts
        }
    }
}