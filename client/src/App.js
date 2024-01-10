import logo from './logo.svg';
import './App.css';
import{BrowserRouter,Route,Routes} from 'react-router-dom'
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Welcome from './Pages/Welcome';





function App() {
  return (
    <>

    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Signup/>}/>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/profile' element={<Welcome/>}/>
    
    </Routes>
    </BrowserRouter>
      
      
    </>
  );
}

export default App;
