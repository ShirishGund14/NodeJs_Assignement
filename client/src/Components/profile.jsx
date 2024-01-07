// Import React and necessary Material-UI components
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  IconButton 
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

// Profile component
const Profile = ({ userinfo }) => {
  // State variables
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: userinfo.name,
    email: userinfo.email,
    phone: userinfo.phone,
  });

  // Function to handle update button click
  const handleUpdateClick = async () => {
    try {
      // Update user information API call
      const response = await fetch('http://localhost:8080/user-api/UpdateUser/:userId', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditing(false); // Disable editing after update
      } else {
        console.error('Error updating user:', data.msg);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Function to handle delete account button click
  const handleDeleteAccountClick = async () => {
    try {
      // Delete user account API call
      const response = await fetch('http://localhost:8080/user-api/DeleteUser/:userId', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.msg === 'User Account Deleted successfully') {
        console.log('User account deleted successfully');
      } else {
        console.error('Error deleting user account:', data.msg);
      }
    } catch (error) {
      console.error('Error deleting user account:', error);
    }
  };

  // Function to handle input field changes
  const handleInputChange = (field, value) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [field]: value,
    }));
  };

  // Fetch user details when the component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:8080/user-api/UserDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: 'yourUserIdHere' }),
        });

        const data = await response.json();

        if (data.success) {
          setUserInfo(data.user);
        } else {
          console.error('Error fetching user details:', data.msg);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []); // Run only once when the component mounts

  // Render the profile card
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Name:{' '}
          {isEditing ? (
            <TextField
              value={userInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          ) : (
            userInfo.name
          )}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Email:{' '}
          {isEditing ? (
            <TextField
              value={userInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          ) : (
            userInfo.email
          )}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Phone:{' '}
          {isEditing ? (
            <TextField
              value={userInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          ) : (
            userInfo.phone
          )}
        </Typography>
      </CardContent>
      <CardActions>
        {isEditing ? (
          <Button size="small" onClick={handleUpdateClick}>
            Save Changes
          </Button>
        ) : (
          <IconButton  size="small" onClick={() => setIsEditing(true)}>
            <EditTwoToneIcon/>
          </IconButton>
        )}
        <Button size="small" onClick={handleDeleteAccountClick}>
          Delete Account
        </Button>
      </CardActions>
    </Card>
  );
};

export default Profile;
