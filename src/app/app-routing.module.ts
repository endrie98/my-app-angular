import { NgModule} from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SignUpComponent } from "./components/sign-up/sign-up.component";
import { LoginComponent } from "./components/login/login.component";
import { NewPostComponent } from "./components/new-post/new-post.component";
import { AllPostsComponent } from "./components/all-posts/all-posts.component";
import { ShowPostComponent } from "./components/show-post/show-post.component";
import { PostResolveService } from "./services/post-resolve.service";
import { HomeComponent } from "./components/home/home.component";
import { AuthGuard } from "./guards/auth.guard";
import { EditPostComponent } from "./components/edit-post/edit-post.component";

const appRoutes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'allPosts', component: AllPostsComponent, },
    {path: 'allPosts/:id', component: ShowPostComponent, resolve: [PostResolveService] },
    {path: 'allPosts/:id/edit', component: EditPostComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'login', component: LoginComponent},
    {path: 'newPost', component: NewPostComponent, canActivate: [AuthGuard]},
    {path: '**', redirectTo: '/home'}
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
    
}