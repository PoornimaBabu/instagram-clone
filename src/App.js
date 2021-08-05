import React, {useState, useEffect} from 'react';
import { auth, db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Input,Button } from '@material-ui/core';
import './App.css';
import Posts from './Posts'
import FileUpload from './FileUpload'
import InstagramEmbed from 'react-instagram-embed'


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [signin, setSignIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signupemail, setSignUpEmail] = useState('')
  const [signuppassword, setSignUpPassword] = useState('')
  const [signupusername, setSignUpUsername] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser)
        setUser(authUser)
      } else {
        setUser(null)
      }
    })

    return() => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

  const handleSignUp = (e) => {
      //alert('Signed Up!')
      e.preventDefault()
      auth.createUserWithEmailAndPassword(signupemail,signuppassword)
      .then((authUser) => {
          return authUser.user.updateProfile({
          displayName: signupusername
        })
      })
      .catch((error) => alert(error.message))
      setOpen(false)
  }

  const handleSignIn = (e) => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(email,password)
    .catch((error) => alert(error.message))
    setSignIn(false)
  }

  return (
    <div className="App">
           
      <Modal
      open={open}
      onClose={() => {setOpen(false)}}
      >
      <div style={modalStyle} className={classes.paper}>
        <center>
            <img 
            className='appimage__header' 
            src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' alt='insta-logo'/>
        </center>
        <form className='app__signup'>
           <Input
            type='text'
            placeholder='username'
            value={signupusername}
            onChange={e => setSignUpUsername(e.target.value)}
            required
            />
            <Input
            type='email'
            placeholder='email'
            value={signupemail}
            onChange={e => setSignUpEmail(e.target.value)}
            required
            />
            <Input
            type='password'
            placeholder='password'
            value={signuppassword}
            onChange= {e => setSignUpPassword(e.target.value)}
            required
            />
            <Button onClick={handleSignUp}>Sign Up</Button>
        </form>     
      </div>
      </Modal>

      <Modal
      open={signin}
      onClose={() => {setSignIn(false)}}
      >
      <div style={modalStyle} className={classes.paper}>
        <center>
            <img 
            className='appimage__header' 
            src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' alt='insta-logo'/>
        </center>
        <form className='app__signup'>
            <Input
            type='email'
            placeholder='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            />
            <Input
            type='password'
            placeholder='password'
            value={password}
            onChange= {e => setPassword(e.target.value)}
            required
            />
            <Button onClick={handleSignIn}>Sign In</Button>
        </form>     
      </div>
      </Modal>
      <div className='app__header'>
            <img 
            className='appimage__header' 
            src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' alt='insta-logo'/>
            {user ? 
            (<Button onClick={() => auth.signOut()}>Logout</Button>) 
            :
            (
            <div>
              <Button onClick={() => setSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
            
            )
            }
      </div>

      <div className='app__posts'>  
        <div className='app__postsLeft'>
          {
            posts.map(({id, post}) => (<Posts key={id} postsId={id} user={user} userName={post.username} imageUrl={post.imageUrl} caption={post.caption} />))
          }
        </div>

        <div className='app__postsRight'>
          <InstagramEmbed
            url='https://www.instagram.com/p/CRqgE9FD50h/?utm_source=ig_web_copy_link'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>    

     {user?.displayName ? <FileUpload username={user.displayName} /> : <h3>Please log in to upload</h3>}
    
    </div>
    
    

  );
}

export default App;
