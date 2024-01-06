import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    
    
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user-api/UserDetails', {
          withCredentials: true, // Send cookies with the request
        });

        if (response.data.status) {
          setUserDetails(response.data.CurrentUser[0]); // Assuming the user details are in an array
        } else {
          // Handle error, e.g., redirect to login page
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Handle error, e.g., redirect to login page
      }
    };

    fetchUserDetails();
  }, []); // Run once when the component mounts

  return (
    <div>
      <h2>User Profile</h2>
      {userDetails ? (
        <div>
          <p>Name: {userDetails.name}</p>
          <p>Email: {userDetails.email}</p>
          <p>Phone: {userDetails.phone}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default Profile;
