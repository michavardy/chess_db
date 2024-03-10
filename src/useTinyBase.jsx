// useTinyBase.js
const host = window.location.hostname;
// for testing
//const API_BASE_URL = `http://${host}/chess-db`; 
// for production
const API_BASE_URL = `https://${host}/chess-db`; 

const useTinyBase = () => {

  const authenticate = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  };

  const getUserData = async(token)=>{
    try{
        const response = await fetch(`${API_BASE_URL}/getUserData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token.access_token}`,  // Include the token in the Authorization header
              },
        })
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Get User Error:', error);
        throw error;
      }
  }

  const getAllResults = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_all_results`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token.access_token}`,  // Include the token in the Authorization header
        },
      });
      return await response.json();

    } 
    catch (error) {
      console.error('Get all results error:', error);
    }
  };

  const getAllUserData = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_all_users`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token.access_token}`,  // Include the token in the Authorization header
        },
      });
      return await response.json();

    } catch (error) {
      console.error('Get user data error:', error);
    }
  };

  const addResult = async (token, record) => {
    try {
      const response = await fetch(`${API_BASE_URL}/add_result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${token.access_token}`,  // Include the token in the Authorization header
        },
        body: JSON.stringify( record ),
      });
      return await response.json()
    } catch (error) {
      console.error('Add result error:', error);
    }
  };

  const removeResult = async (token, recordID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/remove_result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${token.access_token}`,  // Include the token in the Authorization header
        },
        body: JSON.stringify( {recordID: recordID} ),
      });
      return await response.json()
    } catch (error) {
      console.error('Add result error:', error);
    }
  };

  const addUser = async (user) => {
    try{
      const response = await fetch(`${API_BASE_URL}/register_new_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( user ),
      });
      return await response.json();
    }
    catch(error){
      console.error('add User error', error)
    }
  }

  // Return the functions you want to expose
  return {
    authenticate,
    getUserData,
    getAllResults,
    getAllUserData,
    addResult,
    addUser,
    removeResult
  };
};

export default useTinyBase;
