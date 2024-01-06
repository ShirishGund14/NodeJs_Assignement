import React, { useState } from 'react';
import './signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import{useNavigate} from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    role: 'User',
  });



  const handleOnChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = () => {
    setIsAdmin((prevIsAdmin) => !prevIsAdmin);
  };

  const handleSubmit = async () => {
    try {
      const {  email, password } = inputs;
      const role = isAdmin ? 'Admin' : 'User';
      const userData = {
        email,
        password,
        role
      };
      const apiEndpoint = isAdmin ? 'http://localhost:8080/admin-api/login': 'http://localhost:8080/user-api/login';
      
      const {data}=await axios.post(`${apiEndpoint}`,userData);
      // console.log('response from backend ',data);
        
      if (data.success) {
      
        toast.success(data.msg);  // Successful login
        localStorage.setItem('token',data.token);
        navigate('/profile')
        
    } else {
        toast.error(data.msg); // Handle other status codes if needed
    }
    
    } catch (error) {
      console.error('Error during  Login:', error);
    }
  };

  return (
    <>

    <ToastContainer/>
      <div>

        <input
          type="email"
          name="email"
          id=""
          placeholder="Email"
          onChange={handleOnChange}
        />

        <input
          type="password"
          name="password"
          id=""
          placeholder="Password"
          onChange={handleOnChange}
        />
       
        <input
          type="checkbox"
          id="isAdmin"
          name="isAdmin"
          checked={isAdmin}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="isAdmin">Admin ?</label>
        <button onClick={handleSubmit}>Login</button>
      </div>
    </>
  );
};

export default Login;
