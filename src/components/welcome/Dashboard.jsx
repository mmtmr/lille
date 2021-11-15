import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const Dashboard = ({ setAuth }) => {
  const [name, setName] = useState("");

  const getProfile = async () => {
    try {
      const res = await fetch("/dashboard", {
        method: "GET",
        headers: { jwt_token: localStorage.token }
      });

      const parseData = await res.json();
      if (parseData) {
        console.log(parseData);
        setAuth(parseData.user_name);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout successfully");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div>
      <h1 className="mt-5">Dashboard</h1>
      <h2>Welcome {name}</h2>
      <button onClick={e => logout(e)} className="btn btn-primary">
        Logout
      </button>
    </div>
  );
};