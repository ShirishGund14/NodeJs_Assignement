import logo from './logo.svg';
import './App.css';
import{BrowserRouter,Route,Routes} from 'react-router-dom'
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Welcome from './Pages/Welcome';
import Profile from './Components/profile';




function App() {
  return (
    <>

    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Signup/>}/>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/profile' element={<Welcome/>}/>
      {/* <Route path='/profile' element={<Profile/>}/> */}
    
    </Routes>
    </BrowserRouter>
      
      
    </>
  );
}

export default App;
