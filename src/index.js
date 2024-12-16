import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import { Navigate} from 'react-router-dom'

import { AuthProvider } from "features/shared/contexts/AuthContext";
import { ThemeProvider } from "features/shared/contexts/ThemeContext";
import { WebSocketProvider } from "features/shared/contexts/WebSocketContext";
import { NotificationProvider } from "features/shared/contexts/NotificationsContext";
import { ProjectProvider } from "features/project/contexts/ProjectContext";

import { QueryClient, QueryClientProvider } from "react-query";

import Loading from "features/shared/components/Loading";
import "css/index.css"

import NotFoundPage from "features/shared/notfound";
import TopMenuPage from "features/project/TopMenu";
import WelcomePage from "features/auth/WelcomePage";
import LoginPage from "features/auth/LoginPage";
import RegisterPage from "features/auth/RegisterPage";
import ProfilePage from "features/profile/student/ProfilePage";
import ActivityPage from "features/project/ActivityPage";
import KanbanPage from "features/project/KanbanPage";
import SprintPage from "features/project/SprintPage";
import SprintEditPage from "features/project/SprintEditPage";
import SprintCreatePage from "features/project/SprintCreatePage";
import InfoPage from "features/project/InfoPage";
import MessengerPage from "features/project/MessengerPage";
import SettingsPage from "features/project/SettingsPage";
import CreateProjectPage from "features/profile/student/CreateProjectPage";
import StudentTopMenuPage from "features/profile/student/StudentTopMenu";
import TeacherTopMenuPage from "features/profile/teacher/TeacherTopMenu";
import TeacherProfilePage from "features/profile/teacher/TeacherProfile";
import CurrentProjectsPage from "features/profile/teacher/CurrentProjects";
import ProjectsGroupPage from "features/profile/teacher/ProjectsGroup";
import ProjectsApprovePage from "features/profile/teacher/ProjectsApprove";
import ProjectsRatePage from "features/profile/teacher/ProjectsRate";
import StudentProfileEditPage from "features/profile/student/EditProfilePage";
import ProfessorProfileEditPage from "features/profile/teacher/EditProfile";
import AnaliticsPage from "features/project/AnaliticsPage";
import GitAuthPage from "features/auth/GitAuthPage";
import NotificationContainer from "features/shared/components/Notifications";
import ProfileRouting from "features/profile/ProfileRouting";

const App = () => {  
  const queryClient = new QueryClient();

  return (
    <Router> 
      <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <NotificationProvider>
              <NotificationContainer/>
                <Routes> 
                  <Route path="/" element={
                    <AuthProvider>
                      <WebSocketProvider>
                        <Outlet/>
                      </WebSocketProvider>
                    </AuthProvider> 
                  }>
                    <Route index element={<Navigate to="/profile" />} />
                    {/*Навигация внутри проекта*/}
                    <Route path=":projectId/" element={<ProjectProvider> <TopMenuPage/> </ProjectProvider> }>
                      <Route path="activity/" element={<ActivityPage/>}/>
                      <Route path="info/" element={<InfoPage/>}/>
                      <Route path="kanban/" element={<KanbanPage/>}/>
                      <Route path="messenger/" element={<MessengerPage/>}/>
                      <Route path="sprints/:sprint" element={<SprintPage/>}/>
                      <Route path="sprints/:sprint/edit" element={<SprintEditPage/>}/>
                      <Route path="sprints/create" element={<SprintCreatePage/>}/>
                      <Route path="settings/" element={<SettingsPage/>}/>
                      <Route path='analitics/' element={<AnaliticsPage/>}/>
                    </Route>

                    {/*Маршрутизация профиля*/}
                    <Route path="profile/" element={<ProfileRouting/>}></Route>
                    {/*Навигация вне проекта для студента*/}
                    <Route path="student/" element={ <StudentTopMenuPage/> }>
                      <Route index element={<Navigate to="/student/profile" />}/>
                      <Route path='profile/' element={<ProfilePage/>}/>
                      <Route path='profile/createProject/' element={<CreateProjectPage/>}/>
                      <Route path="profile/edit" element={<StudentProfileEditPage/>}/>
                    </Route>
                    {/*Навигация вне проекта для преподавателя*/}
                    <Route path="teacher/" element={<TeacherTopMenuPage/> }>
                      <Route index element={<Navigate to="/teacher/profile" />}/>
                      <Route path='profile/' element={<TeacherProfilePage/>}/>
                      <Route path="current/" element={<CurrentProjectsPage/>}/>
                      <Route path="approve/" element={<ProjectsApprovePage/>}/>
                      <Route path="rate/" element={<ProjectsRatePage/>}/>
                      <Route path="group/:group/" element={<ProjectsGroupPage/>}/>
                      <Route path="profile/edit" element={<ProfessorProfileEditPage/>}/>            
                    </Route>

                    <Route path='git/auth/' element={<GitAuthPage/> }/>

                  </Route>
                   {/*Навигация авторизации*/}
                  <Route path='/welcome/' element={<WelcomePage/>}/>
                  <Route path='/login/' element={<LoginPage/>}/>
                  <Route path='/register/' element={<RegisterPage/>}/>

                 
               

                  <Route path='/loading/' element={<Loading/>}/>
             
                  <Route path='*' element={<NotFoundPage/>}/>
                </Routes>
            </NotificationProvider>
          </ThemeProvider>
      </QueryClientProvider>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(<App />);