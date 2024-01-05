import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const Welcome = () => {


  const [user, setUser] = useState();

  const sendRequest = async () => {

      const res = await axios.get('http://localhost:8080/user-api/UserDetails', {
        withCredentials: true,
      }).catch (err=>console.log(err))
      console.log('welcomepage',res);
      const data=await res.data;
      return data;
  };

  useEffect(() => {
    sendRequest().then((data) => setUser(data.CurrentUser));
  }, []);

  return (
    <>
      {user && (
        <div>
          <h2>User Details</h2>
          <h1>{user.name}</h1>
          <h1>{user.password}</h1>
          <h1>{user.email}</h1>
          <h1>{user.phone}</h1>
        </div>
      )}
    </>
  );
};

export default Welcome;
