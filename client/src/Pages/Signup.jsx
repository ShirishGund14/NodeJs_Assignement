import React, { useState } from 'react';
import './signup.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';


const Signup = () => {

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role:'',
    profile_url: '',
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();


  function convertToBase64(file){
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result)
      };
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const handleOnChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = () => {
    setIsAdmin((prevIsAdmin) => !prevIsAdmin);
  };

  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setInputs((prevState) => ({
      ...prevState,
      profile_url:base64
    }));
   
    
  }


  const handleSubmit = async (e) => {

    try {
      e.preventDefault();
      
      const role = isAdmin ? 'Admin' : 'User';
      inputs.role=role;

      const apiEndpoint = isAdmin ? 'http://localhost:8080/admin-api/create' : 'http://localhost:8080/user-api/create';

      try {
        const response = await axios.post(`${apiEndpoint}`, inputs);
        console.log('response data', response.data);

        if (response.data.success) {
          toast.success(response.data.msg);
          navigate('/login')
        }
        else {
          toast.error(response.data.msg);
        }

      } catch (error) {
        console.log(error);
      }



    } catch (error) {
      console.error('Error during user registration:', error);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className='containerbox'>
        <form>
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

<input 
          type="file"
          lable="Image"
          name="myFile"
          id='file-upload'
          accept='.jpeg, .png, .jpg'
          onChange={(e) => handleFileUpload(e)}
         />


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
        </form>
      </div>

    </>
  );
};

export default Signup;
