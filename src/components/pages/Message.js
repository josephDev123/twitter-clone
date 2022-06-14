import React from 'react';
import '../css/message.css';
import { useState, useContext, useEffect, useCallback } from 'react';
import {context} from '../Context/context';
import {collection, getDoc, getFirestore, doc, addDoc, query, onSnapshot, where} from 'firebase/firestore';

export default function Message() {
  //state management
const [message, setMessage] = useState('');
const [to, setTo] = useState('');
const [isSuccess, setSuccess]= useState('');
const [status, setStatus] = useState('');
const [dataStatus, setDataStatus] = useState('loading')
const [DirectMessage, setDirectMessage] = useState([]);

const {authValue} = useContext(context);

const db = getFirestore();

const DirectMessageCoillection = collection(db, 'directMessage');
const q = query(collection(db, "directMessage"), where("to", "==", authValue.email))


const handleSubmitMessage = (e)=>{

  e.preventDefault();
  if (message === '' && to==='') {
    setStatus('The field cannot be empty');
  }else{
    //check if the person to message is registered email
    const profileRef = doc(db, 'profile', to);
      getDoc(profileRef)
      .then((result)=>{
      if (result.data()) {
        addDoc(DirectMessageCoillection, { 
            sentBy: authValue.email,
            to:to,
            content:message,
            date:new Date().toDateString()
          })
            .then(addMessage=>{
              setSuccess('message sent Successfully');
              setStatus('');
            })
            .catch(e=>setStatus(e.message))
        
      }else{
        setStatus('the email does not exist');
      }
      })
      .catch(e=> setStatus(e.message))
  }
}

//get the message for the login user
useEffect(()=>{
  onSnapshot(q, (querySnapshot) => {
    const message = [];
    querySnapshot.forEach((messages) => {
      if(messages.exists()){
        const {to} = messages.data();
        const profileCollection = doc(db, 'profile', to)
        getDoc(profileCollection).then(profile=>{
         const {profile_url} = profile.data();
         message.push({id:messages.id, profile_img: profile_url, ...messages.data()});
        //  setDirectMessage((prev)=> [prev, {id:messages.id, profile_img:profile_url, ...messages.data()}])
        //  setDirectMessage([{id:messages.id, profile_img: profile_url, message:messages.data()}])
         setDataStatus('loaded')
        })
        
      }else{
        setDataStatus('empty')
      }
     
    });

    setDirectMessage(message);
  }, (error)=> console.log(error.message));
}, [])

console.log(DirectMessage);

console.log(dataStatus);

const getMesssage =   DirectMessage.map(message=>{
          return(
          <div className='message_wrapper mt-4' key={message.id}>
            {console.log('hello')}
            <div className='me-2'>
              <img src={message.profile_img} width='50' height='50' alt='sender image' className='message_img'/>
            </div>
            <div className='message_content'>
                <p>joseph <span>{message.date}</span></p>
                      <p>{message.content}</p>
                  </div>
              </div>
            )
          })


  return (
     <div className='container'>
       <form onSubmit={handleSubmitMessage}>
         {isSuccess ? <div className="alert alert-success" role="alert"> {isSuccess}</div>:''}
         {status ? <div className="alert alert-danger" role="alert"> {status}</div>:''}

          <h5 className='mt-2'>Messages</h5>
          <section className='search_wrapper row mb-2'>
            <input type='text' placeholder='Direct message' className='search p-2 m-2' onChange={(e)=>setMessage(e.target.value)}/>
            <label htmlFor='reciever'>To</label>
            <input type='email' placeholder='message reciever name(by email)' className='search p-2 m-2' id='reciever' onChange={(e)=>setTo(e.target.value)}/>
            <button type='submit' className='btn-primary p-2 m-2'>Message</button>
          </section>
        </form>
        <hr/>
        <div className='mt-2 message_container p-2'>
          <h5>Direct message for me:</h5>

          {dataStatus === 'empty' && <div class="alert alert-danger" role="alert">No message yet</div>}
          {dataStatus === 'loading' && (<div>
            <button className="btn btn-primary" type="button" disabled>
              <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                <span className="visually-hidden">Loading...</span>
              </button>
              <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                Loading...
              </button>
          </div>)} 

         {dataStatus === 'loaded' && <>{getMesssage}</>}
        </div>
    </div>
  );
}
