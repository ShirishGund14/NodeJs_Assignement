import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Cardinfo from '../Components/Card';
import Adminpage from './Adminpage';


const Welcome = () => {
  const navigate = useNavigate();
  const [userinfo, setUserinfo] = useState(null);

  const GetuserData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/user-api/UserDetails",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.data.success) {
        setUserinfo(res.data.user);
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const HasAccess = () => {
    try {
      if (!localStorage.getItem('token')) {
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    HasAccess();
  }, []);

  useEffect(() => {
    GetuserData();
    HasAccess();
  }, []);

  return (
    <>
      {userinfo && (
        <>
          {userinfo.role === 'Admin' ? (
          <Adminpage  userinfo={userinfo}/>
          ) : (
             <Cardinfo userinfo={userinfo} />
            // <Profile userinfo={userinfo} />
          )}
        </>
      )}
    </>
  );
};

export default Welcome;