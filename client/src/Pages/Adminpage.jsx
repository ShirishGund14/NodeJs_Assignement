// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, TextField, Avatar } from '@mui/material';
import { MdEdit, MdDelete } from "react-icons/md";
import './AdminDashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';





const AdminDashboard = () => {
 
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

  //  fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin-api/Allusers');
      setUsers(response.data);
      if(response.data.success){
        toast.success(response.data.msg);
      }
    } catch (error) {
      toast.error(error);
      console.error('Error fetching users:', error);
    }
  };

  //  handle user selection
  const handleUserSelection = (user) => {
    setSelectedUser(user);
    setUpdatedUserData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  };

  //  handle user update
  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/admin-api/UpdateUser/${selectedUser._id}`, updatedUserData);

      if (response.data.success) {
        toast.success(response.data.msg);
        setUsers(users.map((user) => (user._id === selectedUser._id ? response.data.user : user)));
        setSelectedUser(null);
        setUpdatedUserData({
          name: '',
          email: '',
          phone: '',
        });
        setIsModalOpen(false);
      }

      //console.log(response.data.msg);
    } catch (error) {
      toast.error(error);
      console.error('Error updating user:', error);
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/admin-api/DeleteUser/${selectedUser._id}`);

      if (response.data.msg === 'User deleted successfully') {
        toast.success(response.data.msg);
        setUsers(users.filter((user) => user._id !== selectedUser._id));
        setSelectedUser(null);
        setUpdatedUserData({
          name: '',
          email: '',
          phone: '',
        });
        setIsModalOpen(false);
      }

     // console.log(response.data.msg);
    } catch (error) {
      toast.error(error);
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
      <ToastContainer/>
      <div >
        <h3>Admin Dashboard</h3>

        <div>

            {users.map((user) => (
                  <>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  <ListItem>

                    <ListItemAvatar>
                      <Avatar className="avtar" alt="Remy Sharp" src={`${user.profileImage}`} sx={{ width: 56, height: 56 }} />
                    </ListItemAvatar>
                    
                    <div className="names">
                    <ListItemText primary={`${user.name}`} secondary={`${user.email}`} /> 
                    </div>
          
                     <div className='btns'>
                     <button className='buttons' onClick={(e) => handleEditButtonClick(e, user)}> <MdEdit /> </button>
                    <button className='buttons'onClick={() => handleDeleteUser(user)}> <MdDelete />  </button>
                     </div>
                  </ListItem>
                </List >

                </>

            ))}
      


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