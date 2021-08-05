import React, {useState, useEffect} from 'react'
import { db } from './firebase';
import './Posts.css'
import Avatar from '@material-ui/core/Avatar'
import firebase from 'firebase'

function Posts(props){
    const {postsId, user, userName, imageUrl, caption} = props
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if(postsId){
            unsubscribe = db
            .collection('posts')
            .doc(postsId)
            .collection('comments')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => (doc.data())))   // only if multiple objects need to be loaded we can use objectname
            })
        }
        return () => {
            unsubscribe()
        }
    }, [postsId])

    const postComment = (e) => {
        e.preventDefault()
        db.collection('posts').doc(postsId).collection('comments').add({
            username: user.displayName,
            text: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className='posts'>
            <div className='posts__header'>
            <Avatar
            className='posts__avatar'
             src='/images/Poornima.jpg'
             alt={userName}
            />
            <h3>{userName}</h3>
            </div>

            
            <img className='posts__image' src={imageUrl} alt='user_post' />
            
            <div className='posts__text'>
                <strong>{userName}</strong> {caption}
            </div>
        
            <div className='posts__comments'>
                {
                    comments.map((comment) => (
                        <div>
                            <strong>{comment.username}</strong> {comment.text}
                        </div>
                    ))
                }
            </div>
            {user && 
                <form className='posts__CommentBox'>
                <input
                    className='posts__input'
                    placeholder='comments'
                    onChange={e => setComment(e.target.value)}
                    value={comment}
                />
                <button 
                className='posts__button'
                onClick={postComment}
                disabled={!comment}
                type='submit'
                >
                Post
                </button>
                </form> 
            }
            
        </div>
    )
}

export default Posts 