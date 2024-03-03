import React, { useState } from "react";
import SignIn from "./TinySignIn";
import Table from "./Table";

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userData, setUserData] = useState([]);
  const [token, setToken] = useState(null);
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  if (isSignedIn) {
    return (
      <Table
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        userData={userData}
        token={token}
        records={records}
        users={users}
        setUserData={setUserData}
        setToken={setToken}
        setRecords={setRecords}
        setUsers={setUsers}
      />
    );
  } else {
    return (
      <SignIn
        setIsSignedIn={setIsSignedIn}
        setUserData={setUserData}
        setToken={setToken}
        setRecords={setRecords}
        setUsers={setUsers}
        isSignedIn={isSignedIn}
        records={records}
        token={token}
        userData={userData}
      />
    );
  }
}
