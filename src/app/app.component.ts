import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { faYahoo } from '@fortawesome/free-brands-svg-icons'
// import { } from '@fortawesome/fontawesome-svg-core'
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {faX} from '@fortawesome/free-solid-svg-icons'
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import {faEye} from '@fortawesome/free-solid-svg-icons'
import {faAdd} from '@fortawesome/free-solid-svg-icons'
import { __values } from 'tslib';
import { Post } from './models/post';
import { DataService } from './shared/data.service';

import { AngularFireStorage } from '@angular/fire/compat/storage'
import { finalize, last, switchMap } from 'rxjs';

import firebase from 'firebase/compat/app'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import IPost from './models/posts';


 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'user_dashboard';
  yahoo = faYahoo;
  accept = faCheck; 
  decline = faX;
  edit = faEdit;
  delete = faTrash;
  view = faEye;
  add= faAdd;

  formVisible: boolean = false;
  updateFormVisible: boolean = false;
  postToEdit!: IPost;

  addOrUpdate: string = ''

  postList: Post[] = [];
  postList2: IPost[] = [];
  postObj: Post = {
    id: '',
    title: '',
    date: '',
    view: ''
  }
  id: string = ''
  postTitle = ''
  postContent = ''
  date: string = ''
  postView: string = '';

  path!: String;

  percentage = 0
  user: firebase.User | null = null
  newURL: string = ''

  // now =  Date.now(formatDate());

  // private firestore: FirebaseTSFirestore;

  constructor(private data: DataService, private afs: AngularFirestore, private storage: AngularFireStorage, private auth: AngularFireAuth) { 
    auth.user.subscribe(user => this.user = user)
  }
  ngOnInit(): void{
    this.getAllPosts();
  }

  addPost() {
    this.formVisible = !this.formVisible;
    this.addOrUpdate = 'Add';
    // alert(this.now);
  }

  submitPost() {
    if(this.postTitle == '' || this.date == '' || this.postView == '') {
      alert('Please fill the inputs correctly');
      alert(this.postTitle)
      alert(this.date)
      alert(this.postView)
    } else {
      this.postObj.id = ''
    this.postObj.title = this.postTitle
    this.postObj.date = this.date
    this.postObj.view = this.postView

    this.data.addPost(this.postObj)

    this.postTitle = ''
    this.date = ''
    this.postView = ''

    this.formVisible = false
    }

    
  }

  getAllPosts() {
    this.data.getAllPosts().subscribe(res => {
      this.postList2 = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })
    }, err => {
      alert('error while fetching the data')
    })
  }

  // deletePost(post: IPost) {
  //   if(window.confirm('are you sure do you want to delete '+post.title)) {
  //     this.data.deletePost(post);
  //   }
  //   // alert('')
  // }

  deletePost(post: IPost) {
    if(window.confirm('are you sure do you want to delete ' + post.title)) {
      // this.data.deletePost(post);
      // alert('deleted')
      this.data.deletePost(post)

      this.postList2.forEach((element, index) => {
        if(element.id == post.id) {
          this.postList2.splice(index,1)
        }
      })
    }
    // alert('')
  }

  editPost(post: IPost) {
    this.updateFormVisible = true;
    this.postToEdit = post;
    // this.formVisible = !this.formVisible;
    // this.addOrUpdate = 'Update';

  
  }

  updatePost(post: IPost) {
    alert('update button is clicked')

    const file = this.path
    
    const postPath = `posts/${this.path}` + Math.random()

    const task = this.storage.upload(postPath, this.path)
    const postRef = this.storage.ref(postPath)

    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number
    })

    task.snapshotChanges().pipe(
      last(), switchMap(() => postRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        console.log(this.path.valueOf())
        // const post = {
        //   // uid: this.user?.uid as string,
        //   // displayName: this.user?.displayName as string,
          
        //   title: this.postTitle,
        //   fileName: postPath,
        //   url,
        //   timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        // }

        post.url = url
        this.newURL = url
        console.log(url)
        console.log(post.url)
        console.log(this.newURL)

        // post.timeStamp = firebase.firestore.FieldValue.serverTimestamp()
        // var date = new Date(Number(post.timeStamp)).toLocaleDateString("en-us")
        // alert(date)
        // const current_timestamp = Timestamp.fromDate(new Date())
        

        // this.data.createPost(post)
        
        
        console.log(post)
        this.data.updatePost(post)
        this.updateFormVisible = false

        this.postTitle = ''
        this.postContent = ''
        
        // this.formVisible = false
      },
      error: (error) => {
        
      }
    })
  }

  // updatePost(post: Post) {
  //   alert(post.title)
  //   alert(post.date)
  //   alert(post.view)
  //   // this.data.updatePost(post);
  //   this.afs.doc('Posts/' + post.id).update(post);
  //   this.updateFormVisible = false
  // }

  cancelPost() {
    this.formVisible = false;
  }

  cancelUpdate() {
    this.updateFormVisible = false
  }

  upload($event: any) {
    this.path = $event.target.files[0]
  }

  // uploadImage() {
  //   // alert(this.path)
  //   // console.log(this.path)
  //   const storageRef =  this.storage.ref("/files/images" + Math.random() + this.path)
  //   console.log(storageRef)
  //   this.storage.upload("/files/images" + Math.random() + this.path, this.path).snapshotChanges().pipe(
  //     finalize(
  //       () => {
  //         storageRef.getDownloadURL().subscribe(downloadURL => {
  //           console.log(downloadURL)
  //           alert('done')
  //           // console.log(this.path)
  //         })
  //       }
  //     )
  //   )
  //   // console.log(storageRef)
  // }

  upload2($event: any): string {
    const file = $event.file
    var url2 = ''
    const postPath = `posts/${file}` + Math.random()

    const task = this.storage.upload(postPath, file)
    const postRef = this.storage.ref(postPath)

    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number
    })

    task.snapshotChanges().pipe(
      last(), switchMap(() => postRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        console.log(this.path.valueOf())
        url2 = url
        const post = {
          // uid: this.user?.uid as string,
          // displayName: this.user?.displayName as string,
          // id: '',
          // title: this.postTitle,
          // fileName: postPath,
          url,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        // this.data.createPost(post)

        console.log(post)

        // this.formVisible = false
      },
      error: (error) => {

      }
    })

    return url2
  }

  uploadImage() {
    // const clipFileName = uuid()
    const file = this.path
    const postPath = `posts/${this.path}` + Math.random()

    const task = this.storage.upload(postPath, this.path)
    const postRef = this.storage.ref(postPath)

    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number
    })

    task.snapshotChanges().pipe(
      last(), switchMap(() => postRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        console.log(this.path.valueOf())
        const post = {
          // uid: this.user?.uid as string,
          // displayName: this.user?.displayName as string,
          id: '',
          title: this.postTitle,
          content: this.postContent,
          fileName: postPath,
          url,
          // timeStamp: firebase.firestore.FieldValue.serverTimestamp()
        }

        // this.data.createPost(post)

        console.log(post)

        this.postTitle = ''
        this.postContent = ''

        this.formVisible = false
      },
      error: (error) => {

      }
    })
  }

  onAdmin() {
    alert('Admin Dashboard')
  }
}


