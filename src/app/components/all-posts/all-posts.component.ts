import { Component, OnInit, Input } from '@angular/core';

import { Post } from 'src/app/models/post.model';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {

  @Input() post!: Post[]
  @Input() i!: number

  allPosts!: Post[]
  allUsers!: any | null
  isLoading = true
  forAllPost: boolean = true
  allPostFromSearch!: Post[] 

  constructor(private dataStorageService: DataStorageService, private postService: PostsService) { }

  ngOnInit(): void {
    this.dataStorageService.fetchPosts().subscribe(
      (result: Post[]) => {
        this.allPosts = result
        this.isLoading = false
      }
    )

    this.dataStorageService.fetchUsers().subscribe(
      (result: any | null) => {
        this.allUsers = result
        let loggedUser: any = localStorage.getItem('loggedUser')
        let dataUser = JSON.parse(loggedUser)
      }
    )
  }

  searchInput(event: any) {
    let target = event.target.value.toLowerCase()

    this.dataStorageService.fetchPosts().subscribe(
      (allPost: Post[]) => {
        allPost.forEach(post => {
          if (post.title.toLowerCase().includes(target)) {
            this.allPosts = allPost.filter(post => post.title.toLowerCase().includes(target))
            this.postService.setPosts(this.allPosts)
            console.log(this.allPostFromSearch)
          } else {
            this.allPosts = allPost
            this.postService.setPosts(this.allPosts)
          }
        })
      }
    )
  }

}