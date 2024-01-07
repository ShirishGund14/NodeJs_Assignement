import React, { useState } from 'react';
import './signup.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import{Link, useNavigate} from 'react-router-dom';


import 'react-toastify/dist/ReactToastify.css';


const Signup = () => {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    profile_url: 'Default_url',
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const[image,SetImage]=useState('');
  const navigate = useNavigate();

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

      const { name, email, phone, password } = inputs;
      const role = isAdmin ? 'Admin' : 'User';

      const userData = {
        name,
        email,
        phone,
        password,
        profile_url:image,
        role,
        
      };

   
      const apiEndpoint = isAdmin ? 'http://localhost:8080/admin-api/create': 'http://localhost:8080/user-api/create';
   
     console.log('image info',image);
      try {
        const response=await axios.post(`${apiEndpoint}`,userData);
        console.log('response data',response.data);
        
        if(response.data.success){
          toast.success(response.data.msg);
          navigate('/login')
        }
        else{
          toast.error(response.data.msg);
        }

      } catch (error) {
        console.log(error);
      }



      
      // const response = await fetch(apiEndpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData),
      // });

      // const result = await response.json();

      
      // if (result.success) {
      //   toast.success(result.msg);
      //   // console.log(result.msg);
      // } else {
      //   toast.error(result.msg);
      // }

    } catch (error) {
      console.error('Error during user registration:', error);
    }
  };

  return (
    <>
    <ToastContainer />
      <div className='containerbox'>
        <input
          type="text"
          name="name"
          id=""
          placeholder="Name"
          onChange={handleOnChange}
        />
        <input
          type="email"
          name="email"
          id=""
          placeholder="Email"
          onChange={handleOnChange}
        />
        <input
          type="tel"
          name="phone"
          id=""
          placeholder="Phone"
          onChange={handleOnChange}
        />
        <input
          type="password"
          name="password"
          id=""
          placeholder="Password"
          onChange={handleOnChange}
        />

        <input  onChange={(e)=>SetImage(e.target.files[0])} type="file" name="" id="" />Upload img



       <div className='bottom'>
        <div className='box'>
        <label htmlFor="isAdmin" className='name'>Admin ? </label>
        <input
          type="checkbox"
          id="isAdmin"
          name="isAdmin"
          checked={isAdmin}
          onChange={handleCheckboxChange}
        />
        </div>
        <div className="bottom">
        <button onClick={handleSubmit}>Signup</button>
        <div>
        Already have account ? <Link to={'/login'}>Login </Link>
        </div>
        </div>
       </div>
      </div>
    </>
  );
};

export default Signup;
