import React, { useState } from 'react';
import './signup.css';

const Login = () => {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    profile_url: 'pfp url',
  });

  const [isAdmin, setIsAdmin] = useState(false);

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

      // Check if the user is trying to register as an admin
      const role = isAdmin ? 'Admin' : 'User';

      // Prepare data for the API call
      const userData = {
        email,
        password,
      };

      // Choose the API endpoint based on the role
      const apiEndpoint = isAdmin
        ? 'http://localhost:8080/admin-api/login'
        : 'http://localhost:8080/user-api/login';

      // Make a POST request to the backend API to create a new user
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      // Handle the response from the server
      if (result.success) {
        console.log(result.msg);
        // You can redirect the user or show a success message here
      } else {
        console.error(result.msg);
        // Handle registration failure, show an error message, etc.
      }
    } catch (error) {
      console.error('Error during user registration:', error);
      // Handle unexpected errors
    }
  };

  return (
    <>
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
        <button onClick={handleSubmit}>Signup</button>
      </div>
    </>
  );
};

export default Login;
