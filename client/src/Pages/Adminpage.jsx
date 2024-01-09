// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, TextField, Avatar } from '@mui/material';
import { MdEdit ,MdDelete } from "react-icons/md";
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Cardinfo from '../Components/Card';












// Define the AdminDashboard component
const AdminDashboard = () => {
  // State variables
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all users on component mount
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Function to fetch all users from the server
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin-api/Allusers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Function to handle user selection
  const handleUserSelection = (user) => {
    setSelectedUser(user);
    setUpdatedUserData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  };

  // Function to handle user update
  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/admin-api/UpdateUser/${selectedUser._id}`, updatedUserData);

      if (response.data.success) {
        setUsers(users.map((user) => (user._id === selectedUser._id ? response.data.user : user)));
        setSelectedUser(null);
        setUpdatedUserData({
          name: '',
          email: '',
          phone: '',
        });
        setIsModalOpen(false);
      }

      console.log(response.data.msg);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/admin-api/DeleteUser/${selectedUser._id}`);

      if (response.data.msg === 'User deleted successfully') {
        setUsers(users.filter((user) => user._id !== selectedUser._id));
        setSelectedUser(null);
        setUpdatedUserData({
          name: '',
          email: '',
          phone: '',
        });
        setIsModalOpen(false);
      }

      console.log(response.data.msg);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Function to handle edit button click
  const handleEditButtonClick = (event, user) => {
    event.stopPropagation();
    handleUserSelection(user);
    setIsModalOpen(true);
  };

  // JSX for rendering the component
  return (


<>

    <div className="container">
      <h3>Admin Dashboard</h3>
      <div>

        <h4>User List</h4>
        <div className="heading">
          <label htmlFor="">Name</label>
          <label htmlFor="">Email</label>
          <label htmlFor="">Phone</label>
        </div>

        <ul>
          {/* Mapping through users and rendering user details */}
          {users.map((user) => (    

            <li style={{ listStyle: 'none' }} key={user._id} onClick={() => handleUserSelection(user)}>

               <div className="record">

                  <Avatar  className="avtar" alt="Remy Sharp" src={`${user.profileImage}`} sx={{ width: 56, height: 56 }} />
          
               <div> {user.name} {user.email} {user.phone}  </div>

                <div className="buttons">
                  <button variant="outlined" onClick={(e) => handleEditButtonClick(e, user)}> <MdEdit/> </button>
                  <button variant="outlined" onClick={() => handleDeleteUser(user)}> <MdDelete />  </button>
                </div>

              </div> 

              

            </li>

          ))}
        </ul>
      </div>
      {/* Modal for updating user details */}
      {selectedUser && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="ModalContainer">
            <div className="ModalContent">
              <h2 className="ModalTitle">Update User</h2>
              {/* Input fields for updating user details */}
              <TextField
                className="ModalInput"
                label="Name"
                type="text"
                name="name"
                value={updatedUserData.name}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, name: e.target.value })}
              />
              <TextField
                className="ModalInput"
                label="Email"
                type="text"
                name="email"
                value={updatedUserData.email}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })}
              />
              <TextField
                className="ModalInput"
                label="Phone"
                type="text"
                name="phone"
                value={updatedUserData.phone}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, phone: e.target.value })}
              />
              {/* Update and Close buttons */}
              
              <Button className="ModalButton" variant="outlined" onClick={handleUpdateUser}>
                
                Update User
              </Button>
              <Button className="ModalButton" variant="outlined" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>


    </>
  );
};

// Export the component
export default AdminDashboard;
