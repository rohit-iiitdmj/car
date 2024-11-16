
import './App.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import Navbar from './Componets/common/Navbar';
import OpenRoute from "./Componets/core/OpenRoute"
import Login from './page/Login'
import Signup from './page/Signup';
import Dashboard from './page/Dashboard';
import  Private from "./Componets/core/Private"
import MyProfile from "./page/MyProfile"
import  MyCourses from "./Componets/core/deskboard/MyCourses"
import CarAdd from './page/CarAdd';
import Pubic_page from './page/Pubic_page'

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
  
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="catalog/:catalogName" element={<Catalog />} /> */}
        {/* <Route path="courses/:courseId" element={<CourseDetails />} /> */}
        <Route
          path="catalog"
          element={
            
              <Pubic_page/>
            
          }
        />
        
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
       

        <Route
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        >
         <Route path="dashboard/my-profile" element={<MyProfile />} />
         <Route path="dashboard/my-courses" element={<MyCourses />}/>
         <Route path="dashboard/add-course" element={<CarAdd />}/>


        </Route>
{/* 
        <Route
          element={
            <Private>
              <Dashboard />
            </Private>
          }
        >
          <Route path="dashboard/my-profile" element={<MyProfile />} />
          <Route path="dashboard/Settings" element={<Settings />} />
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route path="dashboard/cart" element={<Cart />} />
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
            </>
          )}

          {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
              <Route path="dashboard/instructor" element={<Instructor />}/>
              <Route path="dashboard/add-course" element={<AddCourse />}/>
              <Route path="dashboard/my-courses" element={<MyCourses />}/>
              <Route path="dashboard/Category" element={<CategoryAdd />}/>
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
            </>
          )}
        </Route> */}

        {/* <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        /> */}

        {/* <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        /> */}

        {/* <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        /> */}

        {/* <Route path="about" element={<About />} /> */}

        {/* <Route
          element={
            <Private>
              <ViewCourse />
            </Private>
          }
        >
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
          )}
        </Route> */}

        {/* <Route path="/contact" element={<Contact />} /> */}

        {/* <Route path="*" element={<Error />} /> */}
      </Routes>
    
    </div>
  );
}

export default App;
