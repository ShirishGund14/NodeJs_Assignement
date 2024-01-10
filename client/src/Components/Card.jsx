// UserCard.js
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';


const Cardinfo = ({ userinfo ,role}) => {
  const [updatedInfo, setUpdatedInfo] = useState({
    name: userinfo.name,
    email: userinfo.email,
    phone: userinfo.phone,
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUpdatedInfo((prevInfo) => ({ ...prevInfo, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      
      const { data } = await axios.put(
        `http://localhost:8080/user-api/UpdateUser/${userinfo._id}`,
        updatedInfo
      );

      if (data.success) {
        toast.success(data.msg);
        setUpdatedInfo({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        });

        setIsEditing(false); // Disable editing mode after successful update
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleUpdateClick = () => {
    handleUpdate();
  };

  const handleDeleteAccountClick = async () => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/user-api/DeleteUser/${userinfo._id}`
      );

      if (data.success) {
        toast.success(data.msg);
      } else {
        toast.error(data.msg);
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting user account:', error);
    }
  };


  const handleInputChange = (field, value) => {
    setUpdatedInfo((prevInfo) => ({ ...prevInfo, [field]: value }));
  };

  //logout
  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  
  //console.log(userinfo)

  return (
    <>
      <Card sx={{ maxWidth: 345, bgcolor: 'black', color: 'white', borderRadius: '15px' }}>
        <CardMedia sx={{ height: 140 }} image={`${userinfo.profileImage}`} title="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Name:{' '}
            {isEditing ? (
              <TextField
                value={updatedInfo.name}
                onChange={(e) => handleChange(e)}
                name="name"
                inputProps={{ style: { color: 'white' } }} // Set text color to white
              />
            ) : (
              updatedInfo.name
            )}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            Email:{' '}
            {isEditing ? (
              <TextField
                value={updatedInfo.email}
                onChange={(e) => handleChange(e)}
                name="email"
                inputProps={{ style: { color: 'white' } }} // Set text color to white
              />
            ) : (
              updatedInfo.email
            )}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            Phone:{' '}
            {isEditing ? (
              <TextField
                value={updatedInfo.phone}
                onChange={(e) => handleChange(e)}
                name="phone"
                inputProps={{ style: { color: 'white' } }} // Set text color to white
              />
            ) : (
              updatedInfo.phone
            )}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            Password:{' '}
            {isEditing ? (
              <TextField
                type="password"
                value={updatedInfo.password}
                onChange={(e) => handleChange(e)}
                name="password"
                inputProps={{ style: { color: 'white' } }} // Set text color to white
              />
            ) : (
              '********' // Display placeholder for password
            )}
          </Typography>
        </CardContent>
        <CardActions>
          {isEditing ? (
            <>
              <Button size="small" onClick={handleUpdateClick}>
                Save Changes
              </Button>
              <Button size="small" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="small" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button size="small" onClick={handleDeleteAccountClick}>
                Delete Account
              </Button>
              <Button size="small" onClick={handleLogoutClick}>
                Log out
              </Button>
            </>
          )}
        </CardActions>
      </Card>
      <ToastContainer />
    </>
  );
};

export default Cardinfo;