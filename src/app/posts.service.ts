import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {

  error = new Subject<string>();

    constructor(private http: HttpClient) {}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content};
        this.http.post<{ name: string}>(
          'https://ng-template-project-default-rtdb.firebaseio.com/posts.json', 
          postData,
          {
            observe: 'body',
          }
        )
        .subscribe(res => {
        console.log(res);
    }, error => {
        this.error.next(error.message);
    })
    }

    fetchPosts(){
      let searchParams = new HttpParams();
      searchParams = searchParams.append('print', 'pretty');
      searchParams = searchParams.append('custom', 'key');
     return this.http
    .get<{[key: string]: Post}>('https://ng-template-project-default-rtdb.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({'Custom-Header': 'Hello'}),
        params: searchParams,
        responseType: 'json',
      }
    )
    .pipe(map((responseData) => {
      const postArray: Post[] = [];
      for (const key in responseData) {
        if (responseData.hasOwnProperty(key)) {
          postArray.push({ ...responseData[key], id: key });
        }
      }
      return postArray;
    }),
    catchError(errorRes => {
      return throwError(errorRes);
    })
  )
    }

    deletePost(postId: string) {
        return this.http.delete(`https://ng-template-project-default-rtdb.firebaseio.com/posts/${postId}.json`);
    }

    deleteAllPosts() {
        return this.http.delete(
          'https://ng-template-project-default-rtdb.firebaseio.com/posts.json',
        {
          observe: 'events',
          responseType: 'text'
        })
        .pipe(tap(event => {
          console.log(event);
          if(event.type === HttpEventType.Sent) {
            //..
          }
          if(event.type === HttpEventType.Response) {
            // Request has been sent
            console.log(event.body); 
          }
        }),)
    }
}