import React, { useState } from 'react';
import './signup.css';

const Signup = () => {
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
      const { name, email, phone, password } = inputs;

      // Check if the user is trying to register as an admin
      const role = isAdmin ? 'Admin' : 'User';

      // Prepare data for the API call
      const userData = {
        name,
        email,
        phone,
        password,
        role,
        // Add any other necessary fields here
      };

      // Choose the API endpoint based on the role
      console.log(role)
      const apiEndpoint = isAdmin
        ? 'http://localhost:8080/admin-api/create'
        : 'http://localhost:8080/user-api/create';



        console.log(apiEndpoint);
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
        <input type="file" name="" id="" />Upload img
        <input
          type="password"
          name="password"
          id=""
          placeholder="Password"
          onChange={handleOnChange}
        />
        {/* <label htmlFor="role">Select Role:</label> */}
        <input
          type="checkbox"
          id="isAdmin"
          name="isAdmin"
          checked={isAdmin}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="isAdmin">Admin ? </label>
        <button onClick={handleSubmit}>Signup</button>
      </div>
    </>
  );
};

export default Signup;
