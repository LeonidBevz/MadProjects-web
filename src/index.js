import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate} from 'react-router-dom'
import NotFoundPage from "./pages/notfound"
import TopMenuPage from "./pages/topmenu";
import WelcomePage from "./pages/welcome";
import "./index.css"
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ProfilePage from "./pages/profilepage";
import ActivityPage from "./pages/activitypage";

const App = () => { 

  return (
    <Router> 
      <Routes> 
        <Route index element={<Navigate to="/welcome" />} />
        <Route path="/" element={<TopMenuPage/>}>
          <Route path=":project/activity/" element={<ActivityPage/>}/>
        </Route>
        <Route path='/profile/' element={<ProfilePage/>}/>

        <Route path='/welcome/' element={<WelcomePage/>}/>
        <Route path='/login/' element={<LoginPage/>}/>
        <Route path='/register/' element={<RegisterPage/>}/>

        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(<App />);