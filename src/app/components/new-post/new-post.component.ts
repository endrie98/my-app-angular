import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Post } from 'src/app/models/post.model';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  newpostForm!: FormGroup
  currentUser!: any
  isLoading = false

  constructor(private router: Router ,private postService: PostsService, private dataStorageService: DataStorageService) {

  }

  private initForm() {
    let postTitle = ''
    let postDescription = ''
    let postLocation = ''
    let postImage = ''
    let postLucky = ''
    let postComments = new FormArray([])

    this.newpostForm = new FormGroup({
      'title': new FormControl(postTitle, Validators.required),
      'description': new FormControl(postDescription, Validators.required),
      'location': new FormControl(postLocation, Validators.required),
      'image': new FormControl(postImage, Validators.required),
      'lucky': new FormControl(postLucky, Validators.required),
      'comments': postComments
    })
  }

  ngOnInit(): void {
      this.initForm()
      this.postService.postsChanged.subscribe(
        (posts: Post[]) => {

        }
      )
      this.dataStorageService.fetchPosts().subscribe((response) => {

      })

      let fromLocalStorage: any = localStorage.getItem('loggedUser')
      this.currentUser = JSON.parse(fromLocalStorage)
  }

  addPost() {
    this.isLoading = true
    let final = {...this.newpostForm.value, author: {name: this.currentUser.userName, id: this.currentUser.localId, email: this.currentUser.email}}
    this.postService.addPost(final)
    this.dataStorageService.storePosts()
    this.router.navigate(['/allPosts'])
  }

}
