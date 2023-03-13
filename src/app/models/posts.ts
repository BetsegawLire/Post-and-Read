import firebase from 'firebase/compat/app'

export default interface IPost {
    // uid: string
    // displayName: string
    id: string
    content: string
    title: string
    fileName: string
    url: string
    // timeStamp: firebase.firestore.FieldValue,
    // timeStamp: number
    timeStamp: any
    status: string
    tags: any
}