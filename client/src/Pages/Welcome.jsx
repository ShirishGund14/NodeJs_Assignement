import React, { useEffect, useState } from 'react';
import axios from 'axios';
import{useNavigate} from 'react-router-dom';


const Welcome = () => {
  // const [user, setUser] = useState();
  const navigate = useNavigate();
  
  console.log(localStorage.getItem("token"));
  const GetuserData = async () => {
    try{
   
      const res = await axios.post("http://localhost:8080/user-api/UserDetails",{},
        {
          headers: {
            Authorization: "Bearer "+localStorage.getItem("token"),
          },
        }
      );
    }
    catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  useEffect(() => {
    GetuserData();
  }, []);

  return (
    <>
      WELCOME
    </>
  );
};

export default Welcome;
