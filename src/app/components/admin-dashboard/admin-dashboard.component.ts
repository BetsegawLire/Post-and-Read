import { Component, OnInit } from '@angular/core';
// import { Component } from '@angular/core';
import { faYahoo } from '@fortawesome/free-brands-svg-icons'
import { } from '@fortawesome/fontawesome-svg-core'
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {faX} from '@fortawesome/free-solid-svg-icons'
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import {faTrash} from '@fortawesome/free-solid-svg-icons'
import {faEye} from '@fortawesome/free-solid-svg-icons'
import {} from '@fortawesome/free-regular-svg-icons'
import {} from '@fortawesome/angular-fontawesome'
import IPost from 'src/app/models/posts';
import { DataService } from 'src/app/shared/data.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { last, switchMap } from 'rxjs';

import firebase from 'firebase/compat/app'

import {COMMA, ENTER} from '@angular/cdk/keycodes';
// import {Component} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent} from '@angular/material/chips';

export interface Tag {
  name: string;
}


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit{

  title = 'cards';
  yahoo = faYahoo;
  accept = faCheck; 
  decline = faX;
  edit = faEdit;
  delete = faTrash;
  view = faEye;

  updateFormVisible: Boolean = false
  postToEdit!: IPost
  newUrl!: string;

  path!: string;

  totalPosts: IPost[] = [
    {id: "Test", content: "Test", fileName: "Test", url: "Test", status: "Test", timeStamp: "Test", title: "Test", tags:"Test"}
  ]

  tags: Tag[] = []

  constructor(private data: DataService, private storage: AngularFireStorage) {}
  ngOnInit(): void {
    this.getAllPosts()
  }

  getAllPosts() {
    this.data.getAllPosts().subscribe(res => {
      this.totalPosts = res.map((e: any) => {
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })
    }, err => {
      alert('error while fetching the data')
    })
  }

  onAccept(post: IPost) {
    alert('Approved');
    this.data.changeStatus(post, "Approved")
  }

  onDecline(post: IPost) {
    alert('DisApproved')
    this.data.changeStatus(post, "DisApproved")
  }

  onEdit(post: IPost) {
    alert('Editted')
    this.updateFormVisible = true
    this.postToEdit = post
    this.tags = post.tags
  }

  

  onDelete(post: IPost) {
    // alert('Deleted')
    if(window.confirm('Are you sure do you want to delete ' + post.title)) {
      this.data.deletePost(post)

      this.totalPosts.forEach((element, index) => {
        if(element.id == post.id) {
          this.totalPosts.splice(index, 1)
        }
      })
    }
  }

  updatePost(post: IPost) {

    const file = this.path

    const postPath = `posts/${this.path}` + Math.random()

    const task = this.storage.upload(postPath, this.path)
    const postRef = this.storage.ref(postPath)

    task.snapshotChanges().pipe(
      last(), switchMap(() => postRef.getDownloadURL())
    ).subscribe(
      {
        next: (url) => {
          post.url = url
          this.newUrl = url

          // post.timeStamp = firebase.firestore.FieldValue.serverTimestamp()
          post.timeStamp = (new Date).toLocaleDateString()
          post.tags = this.tags

          this.data.updatePost(post)
          this.updateFormVisible = false

          this.tags = []
          

          
        }
      }
    )
    
  }

  upload($event: any) {
    this.path = $event.target.files[0]
  }

  cancelUpdate() {
    this.updateFormVisible = false
    this.tags = []
  }

  // chips material start
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  

  onAdd(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onAdminEdit(tag: Tag, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(tag);
      return;
    }

    // Edit existing fruit
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index].name = value;
    }
  }
  // chips material end
}
