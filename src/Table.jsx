import { useState, useEffect } from "react";
import useTinyBase from "./useTinyBase";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.css';

export default function Table(props) {
  const {addResult } = useTinyBase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    // initialize with default form values
    time_control: "",
    white_player: "",
    black_player: "",
    result: "",
  });
  const {getAllResults} = useTinyBase();

  useEffect(()=>{
    console.log('records')
    console.log(props.records)
    console.log('users')
    console.log(props.users)
    console.log('token')
    console.log(props.token)
  },[props])

  const showIziToastSuccess = (message) => {
    iziToast.success({
      title: 'Submit Success',
      message,
      position:'topRight'
    })
  }
    // Function to show an iziToast error message
const showIziToastError = (message) => {
  iziToast.error({
    title: 'Submit Failed',
    message,
    position: 'topRight',
  });
};

  function handleLogOut() {
    props.setIsSignedIn(false)
    props.setUserData([])
    props.setToken(null)
    props.setRecords([])
    props.setUsers([])
  }

  function handleAddResult() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    // Add logic to handle form submission
    try{
      addResult(
        props.token,
        formData
      );
      showIziToastSuccess("add result")
    }
    catch{
      showIziToastError("result submission failed")
    }
    // Close the modal after submitting
    setIsModalOpen(false);
    const allResults = await getAllResults(props.token)
    props.setRecords(allResults)


  }

  return (
    <div className="bg-gray-100 p-4 border-b-2 border-gray-300 h-screen">
      {/* Top Banner */}
      <div className="bg-gray-300 h-20vh flex justify-between items-center p-4">
        <div className="bg_text-gray-800 text-white flex items-center ml-auto">
          <span className="mr-2 text-sm">User: {props.userData.username}</span>
          <button
            className="border border-gray-800 text-gray-800 p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring focus:border-gray-300"
            onClick={handleLogOut}
          >
            Log Out
          </button>
          <button
            className="border border-gray-800 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring focus:border-gray-300"
            onClick={handleAddResult}
          >
            Add Result
          </button>
        </div>
      </div>

      {/* Records Title */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Chess Database Records
        </h1>
        {props.records? (
          /* Your table component goes here using the records data */
          <table className="w-full">
            <thead>
              <tr className=" bg-blue-800 text-white">
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Time Control</th>
                <th className="py-2 px-4">White Player</th>
                <th className="py-2 px-4">Black Player</th>
                <th className="py-2 px-4">Result</th>
              </tr>
            </thead>
            <tbody>
              {props.records.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="py-2 px-4 text-center">{item.created}</td>
                    <td className="py-2 px-4 text-center">
                      {item.time_control}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {item.player_black}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {item.player_white}
                    </td>
                    <td className="py-2 px-4 text-center">{item.result}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          /* Render something when records are not available */
          <p>No records available.</p>
        )}
      </div>
      {/* Modal overlay */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            {/* Form inside the modal */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Your form inputs go here */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Time Control:
                </label>
                <select
                  name="time_control"
                  value={formData.time_control}
                  onChange={handleFormChange}
                  className="w-full border rounded-md py-2 px-3 text-gray-700"
                >
                  <option value="1">1 minute</option>
                  <option value="3">3 minutes</option>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  White Player:
                </label>
                  <select
                    name="white_player"
                    value={formData.white_player}
                    onChange={handleFormChange}
                    className="w-full border rounded-md py-2 px-3 text-gray-700"
                  >
                    <option value="">Select White Player</option>
                    {props.users.map(user => (
                      <option key={user.id} value={user.username}>
                        {user.username}
                      </option>
                    ))}
                  </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Black Player:
                </label>
                <select
                    name="black_player"
                    value={formData.black_player}
                    onChange={handleFormChange}
                    className="w-full border rounded-md py-2 px-3 text-gray-700"
                  >
                    <option value="">Select Black Player</option>
                    {props.users.map(user => (
                      <option key={user.id} value={user.username}>
                        {user.username}
                      </option>
                    ))}
                  </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Result:
                </label>
                  <select
                    name="result"
                    value={formData.result}
                    onChange={handleFormChange}
                    className="w-full border rounded-md py-2 px-3 text-gray-700"
                  >
                    <option value="">Select Result</option>
                    <option value={formData.white_player}>{formData.white_player}</option>
                    <option value={formData.black_player}>{formData.black_player}</option>
                    <option value="Tie">Tie</option>
                  </select>
              </div>

              {/* Submit and Cancel buttons */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="ml-2 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
