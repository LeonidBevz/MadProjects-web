import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate} from 'react-router-dom'
import NotFoundPage from "./pages/notfound"
import TopMenuPage from "./pages/inner/topmenu";
import WelcomePage from "./pages/auth/welcome";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ProfilePage from "./pages/outer/student/profilepage";
import ActivityPage from "./pages/inner/activitypage";
import { TokenProvider } from "./hooks/useToken";
import KanbanPage from "./pages/inner/kanbanpage";
import SprintPage from "./pages/inner/sprintpage";
import SprintEditPage from "./pages/inner/sprintedit";
import SprintCreatePage from "./pages/inner/sprintcreate";
import InfoPage from "./pages/inner/infopage";
import MessengerPage from "./pages/inner/messenger";
import SettingsPage from "./pages/inner/settingspage";
import CreateProjectPage from "./pages/outer/student/createProject";
import StudentTopMenuPage from "./pages/outer/student/studenttopmenu";
import TeacherTopMenuPage from "./components/teachertopmenu";
import "./css/index.css"

const App = () => { 

  return (
    <TokenProvider>
      <Router> 
        <Routes> 
          <Route index element={<Navigate to="/welcome" />} />
          {/*Навигация внутри проекта*/}
          <Route path="/" element={<TopMenuPage/>}>
            <Route path=":project/activity/" element={<ActivityPage/>}/>
            <Route path=":project/info/" element={<InfoPage/>}/>
            <Route path=":project/kanban/" element={<KanbanPage/>}/>
            <Route path=":project/messenger/" element={<MessengerPage/>}/>
            <Route path=":project/sprints/:sprint" element={<SprintPage/>}/>
            <Route path=":project/sprints/:sprint/edit" element={<SprintEditPage/>}/>
            <Route path=":project/sprints/create" element={<SprintCreatePage/>}/>
            <Route path=":project/settings/" element={<SettingsPage/>}/>
          </Route>
          {/*Навигация вне проекта для студента*/}
          <Route path="/" element={<StudentTopMenuPage/>}>
            <Route path='profile/' element={<ProfilePage/>}/>
            <Route path='createProject/' element={<CreateProjectPage/>}/>
          </Route>
          {/*Навигация вне проекта для преподавателя*/}
          <Route path="/teacher/" element={<TeacherTopMenuPage/>}>
            <Route path='profile/' element={<ProfilePage/>}/>
          </Route>
           {/*Навигация авторизации*/}
          <Route path='/welcome/' element={<WelcomePage/>}/>
          <Route path='/login/' element={<LoginPage/>}/>
          <Route path='/register/' element={<RegisterPage/>}/>
          
          <Route path='*' element={<NotFoundPage/>}/>
        </Routes>
      </Router>
    </TokenProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);