import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Post } from '../models/post';
import IPost from '../models/posts';
import {AngularFireStorage} from '@angular/fire/compat/storage'
// import {} from '@angular/fire/compat/firestore'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public postCollection: AngularFirestoreCollection<IPost>

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {
    this.postCollection = afs.collection('posts')
   }

  async createPost(data: IPost) {
    data.id = this.afs.createId();
    await this.postCollection.add(data)
  } 

  // add post
  addPost(post: Post) {
    alert('done')
    post.id = this.afs.createId();
    return this.afs.collection('/Posts').add(post);
  }

  // get all posts
  getAllPosts() {
    return this.afs.collection('/posts').snapshotChanges();
  }

  // get single post
  getPost(post: Post) {
    return this.afs.collection('/Posts/'+post.id).snapshotChanges();
  }

  // delete posts
  deletePost(post: IPost) {
    // return this.afs.doc('/Posts/' + post.id).delete();
    // const postRef = this.storage.ref(`posts/${post.fileName}`)

    // postRef.delete()

    this.postCollection.doc(post.id).delete()
  }

  // update post
  updatePost(post: IPost) {
    // this.deletePost(post);
    // this.addPost(post);
    return this.postCollection.doc(post.id).update({
      title: post.title,
      url: post.url,
      content: post.content,
      timeStamp: post.timeStamp,
      tags: post.tags
    })

  }

  changeStatus(post: IPost, status: string) {
    return this.postCollection.doc(post.id).update({
      status: status
    })
  }

  formatDate(date: Date): string {
    const day = date.getDay()
    const month = date.getMonth()
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }
}
