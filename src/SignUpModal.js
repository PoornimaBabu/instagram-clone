import React, {useState} from 'react'
import { auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Input,Button } from '@material-ui/core';

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

const SignUpModal = () => {
    const classes = useStyles()
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const handleSignUp = (e) => {
        //alert('Signed Up!')
        e.preventDefault()
        auth.createUserWithEmailAndPassword(email,password)
        .then((authUser) => {
            return authUser.user.updateProfile({
            displayName: username
          })
        })
        .catch((error) => alert(error.message))
    } 

    return (
    <div>
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
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              />
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
              <Button onClick={handleSignUp}>Sign Up</Button>
          </form>     
        </div>
        </Modal>
    </div>
    
    )
}

export default SignUpModal