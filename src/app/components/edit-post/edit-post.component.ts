import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Post } from 'src/app/models/post.model';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  post!: Post
  id!: number
  editPostForm!: FormGroup

  constructor(private dataStorage: DataStorageService, private postService: PostsService, private route: ActivatedRoute, private router: Router) { }

  private initForm() {
    this.editPostForm = new FormGroup({
      'title': new FormControl(this.post?.title, Validators.required),
      'description': new FormControl(this.post?.description, Validators.required),
      'location': new FormControl(this.post?.location, Validators.required),
      'image': new FormControl(this.post?.image, Validators.required),
      'lucky': new FormControl(this.post?.lucky, Validators.required),
    })
  }

  ngOnInit(): void {
    this.dataStorage.fetchPosts().subscribe()

    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id']
        this.post = this.postService.getPost(this.id)
        this.postService.postsChanged.subscribe()
      }
    )
    this.initForm()
  }

  updatePost() {
    let final = {...this.editPostForm.value, author: this.post.author, comments: this.post.comments}
    this.postService.updatePost(this.id, final)
    this.dataStorage.storePosts()
    this.router.navigate([`/allPosts/${this.id}`])
  }

  onBack() {
    this.router.navigate([`/allPosts/${this.id}`])
  }

}
