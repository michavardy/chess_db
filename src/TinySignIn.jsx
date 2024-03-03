import React, { useState } from "react";
import useTinyBase from "./useTinyBase";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.css';


export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });
  const { authenticate, getUserData, getAllResults, getAllUserData, addUser } = useTinyBase();

  const handleAuthenticate = async(email, password)=>{
    return await authenticate(email, password)
  }
  
  // Function to show an iziToast error message
const showIziToastError = (message) => {
  iziToast.error({
    title: 'Authentication Failed',
    message,
    position: 'topRight',
  });
};

const showIziToastSuccess = (message) => {
  iziToast.success({
    title: 'Submit Success',
    message,
    position:'topRight'
  })
}


  const handleRegisterNewUser = async()=>{
    
    setModalOpen(true);
    console.log(isModalOpen)
  }
  const handleModalClose = () => {
    setModalOpen(false);
    setUser({
      username: "",
      email: "",
      password: "",
      avatar: "",
    });
  };
  const handleModalSubmit = () => {
    // Handle form submission logic here
    console.log("Form submitted:", user);
    // Close the modal
    const msg = addUser(user)
    if (msg){
      showIziToastSuccess("new user registered")
    }
    else{
      showIziToastError("failed to register new user")
    }
    handleModalClose();
  };
  
  //const handleAvatarChange = (e) => {
  //  const file = e.target.files[0];
  //  if (file) {
  //    // Convert the image to base64
  //    const reader = new FileReader();
  //    reader.onloadend = () => {
  //      setUser((prevUser) => ({ ...prevUser, avatar: reader.result }));
  //    };
  //    reader.readAsDataURL(file);
  //  }
  //};

  const handleSignIn = async () => {

      const token = await handleAuthenticate(email, password)
      if (!token.hasOwnProperty('access_token')){
        showIziToastError("sign in failed")
      }
      else{
        const userData = await getUserData(token)
        const allResults = await getAllResults(token)
        const allUsers = await getAllUserData(token)
        props.setUserData(userData)
        props.setRecords(allResults)
        props.setUsers(allUsers)
        props.setToken(token)
        props.setIsSignedIn(true)
      }

  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email:
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md bg-gray-200"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Password:
          <input
            type="password"
            className="mt-1 p-2 w-full border rounded-md bg-gray-200"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="flex">
        <button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 block mx-auto"
          onClick={handleSignIn}
        >
          Sign In
        </button>
        <button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 block mx-auto"
          onClick={handleRegisterNewUser}
        >
          New User
        </button>
        </div>
      </div>
       {/* User Registration Modal */}
       {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">User Registration</h2>
        <form className="flex flex-col gap-4 ">
          <label className="flex flex-col">
            <span className="mb-1">Username:</span>
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="border rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Email:</span>
            <input
              type="text"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="border rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Password:</span>
            <input
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="border rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </label>

          <label className="flex flex-col">
            <span className="mb-1">Avatar:</span>
            <input 
              type="file" 
              accept="image/*" 
              className=""
            />
          </label>
        </form>
        <div className="flex flex-row justify-center space-between p-2 m-2">
        <button 
          onClick={handleModalSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Submit</button>
        <button 
          onClick={handleModalClose}
          className="ml-2 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:border-gray-300"
            >
              Cancel</button>
        </div>
      </div>
      </div>
      )}
    </div>
  );
}