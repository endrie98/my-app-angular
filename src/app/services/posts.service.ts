import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


import { Post } from '../models/post.model';
import { Comment } from '../models/comments.model';

@Injectable({
    providedIn: 'root'
})

export class PostsService {
    postsChanged = new Subject<Post[]>();

    constructor() { }

    private posts: Post[] = []

    setPosts(posts: Post[]) {
        this.posts = posts
        this.postsChanged.next(this.posts.slice())
    }

    getPost(index: number) {
        return this.posts[index]
    }

    addPost(post: Post) {
        this.posts.push(post)
        this.postsChanged.next(this.posts.slice())
    }

    getPosts() {
        return this.posts.slice()
    }

    updatePost(index: number, newPost: Post) {
        this.posts[index] = newPost
        this.postsChanged.next(this.posts.slice())
    }

    deletePost(index: number) {
        this.posts.splice(index, 1)
        this.postsChanged.next(this.posts.slice())
    }

    addComment(index: number, theComment: Comment) {
        this.posts[index].comments.push(theComment)
        this.postsChanged.next(this.posts.slice())
    }

    delteComment(postIndex: number, commentIndex: number) {
        this.posts[postIndex].comments.splice(commentIndex, 1)
        this.postsChanged.next(this.posts.slice())
    }
}