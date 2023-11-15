import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';


import { Post } from 'src/app/models/post.model';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css']
})
export class ShowPostComponent implements OnInit {

  @ViewChild('commentForm') commentForm!: NgForm
  post!: Post
  id!: number
  currentPost!: Post
  currentUser!: any
  userAccess: boolean = false
  isCommentAuthor: boolean = false
  noLogIn: boolean = true
  isLoading = true

  constructor(private dataStorage: DataStorageService, private postService: PostsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id']
        this.post = this.postService.getPost(this.id)
        this.isLoading = false
      }
    )

    this.currentPost = this.postService.getPost(this.id)

    let userLoggedIn: any = localStorage.getItem('loggedUser')
    if (userLoggedIn !== null) {
      this.noLogIn = false

      const finalUser = JSON.parse(userLoggedIn)
      this.currentUser = finalUser

      if (this.post.author.id === this.currentUser.localId) {
        this.userAccess = true
      } else {
        this.userAccess = false
      }

      for (let comment of this.post.comments) {
        if (this.currentUser.localId === comment.author.id) {
          this.isCommentAuthor = true
        } else {
          this.isCommentAuthor = false
        }
      }

    } else {
      this.noLogIn = true
      
      this.userAccess = false
      this.isCommentAuthor = false
    }

    // const finalUser = JSON.parse(userLoggedIn)
    // this.currentUser = finalUser

    // if (this.post.author.id === finalUser.localId) {
    //   this.userAccess = true
    // } else {
    //   this.userAccess = false
    // }

    // for (let comment of this.post.comments) {
    //   if (this.currentUser.localId === comment.author.id) {
    //     this.isCommentAuthor = true
    //   } else {
    //     this.isCommentAuthor = false
    //   }
    // }

  }

  onEditPost() {
    // this.router.navigate(['edit'], { relativeTo: this.route })
    this.router.navigate([`allPosts/${this.id}/edit`])
  }

  onDeletePost() {
    this.postService.deletePost(this.id)
    this.dataStorage.storePosts()
    this.router.navigate(['/allPosts'])
  }

  addComment() {
    if (!this.commentForm.valid) {
      return
    }

    let final = {
      text: this.commentForm.value.body,
      rate: this.commentForm.value.rating,
      author: {
        name: this.currentUser.userName,
        id: this.currentUser.localId,
        email: this.currentUser.email
      }
    }

    this.postService.addComment(this.id, final)
    this.dataStorage.storePosts()
    this.commentForm.reset()
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  deleteComment(commentIndex: number) {
    this.postService.delteComment(this.id, commentIndex)
    this.dataStorage.storePosts()
  }

}
