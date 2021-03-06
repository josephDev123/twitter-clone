import './App.css';
import Layout from './components/Layout';
import {BrowserRouter, Routes,Route} from "react-router-dom";
import {Home} from './components/pages/Home';
import Explore from './components/pages/Explore';
import Notification from './components/pages/Notification';
import Profile from './components/pages/Profile';
import Bookmark from './components/pages/Bookmark';
import Message from './components/pages/Message';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import {SetContext} from './components/Context/context';
import AuthStatus from './components/pages/AuthStatus';
import UsersProfile from './components/pages/UsersProfile';
import NotFound  from './components/pages/404';



function App() {
  return (
    <SetContext>
      <BrowserRouter> 
            <div className="App">
                <Routes>
                  <Route path='/' element={ <AuthStatus> <Layout/> </AuthStatus> }>
                    <Route index element= {<Home/>}/>
                    <Route path='explore' element= {<Explore/>}/>
                    <Route path='notification' element= {<Notification/>}/>
                    <Route path='profile' element= {<Profile/>}/>
                    <Route path='profile/:id' element= {<UsersProfile/>}/>
                    <Route path='bookmark' element= {<Bookmark/>}/>
                    <Route path='message' element= {<Message/>}/>
                    <Route path='home' element= {<Home/>}/>
                  </Route>
                  <Route path='login' element= {<Login/>}/>
                  <Route path='register' element= {<Register/>}/>
                  <Route path='*' element= {<NotFound/>}/>
                </Routes>
            </div>
      </BrowserRouter> 
    </SetContext>
  );
}

export default App;
