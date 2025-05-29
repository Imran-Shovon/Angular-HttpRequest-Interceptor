import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription

  constructor(private http: HttpClient, private postService: PostsService) {}

  ngOnInit() {

    this.errorSub =  this.postService.error.subscribe(errorMessage =>{
      this.error = errorMessage;
    })

    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.loadedPosts = posts;
      this.isFetching = false;
  }, error => {
    this.isFetching = false;
    this.error = error.message;
  })
}



  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePost(postData.title, postData.content);
    this.loadedPosts.push(postData);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.loadedPosts = posts;
      this.isFetching = false;
  }, error => {
    this.isFetching = false;
    this.error = error.message;
    
  })
  }

  onDeletePost(postId: string) {
    this.postService.deletePost(postId).subscribe(() => {
      this.onFetchPosts(); // Refresh the list after deletion
    });
  }

  onClearPosts() {
    // Send Http request
    this.postService.deleteAllPosts().subscribe(() => {
      this.loadedPosts = []; // Clear the local array after deletion
      console.log('All posts deleted successfully.');
    }
    );
  }

  onHandleError(){
    this.error = null; // Clear the error message
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

}
