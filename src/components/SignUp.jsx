import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const SignUp = () => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", gender: "" });
  const [file, setFile] = useState(null);

  const navigator = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "userImage") {
      setFile(e.target.files[0]);
    } else {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const URL = "https://assignment-1-6jv4.onrender.com/api/v1/user/signUp"; // ✅ Updated backend URL

      const formData = new FormData();
      for (let key in credentials) {
        formData.append(key, credentials[key]);
      }
      if (file) {
        formData.append("userImage", file);
      }

      const response = await fetch(URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Signup response:", data);

      if (response.ok && data.authToken && data.user) {
        toast.success(data.message || "Account created successfully!");
        localStorage.setItem('token', data.authToken);
        localStorage.setItem('userId', data.user._id);
        navigator("/user-page");
      } else {
        toast.error(data.message || "Signup failed");
      }

    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className='container d-flex justify-content-center align-items-center' style={{ marginTop: "70px", marginBottom: "50px" }}>
        <div className="card p-4" style={{
          width: "100%", maxWidth: "500px", boxShadow: "0px 0px 20px white"
        }}>

          <form onSubmit={handleSubmit}>
            <h1>Sign up to Continue</h1>

            <div className='mb-3'>
              <label htmlFor="userImage" className="form-label">Profile</label>
              <input type="file" className="form-control" id="userImage" name="userImage" onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" name='name' onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" name='email' onChange={handleChange} />
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" name='password' onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label htmlFor="gender" className="form-label d-block">Gender</label>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="gender" id="male" value="male" onChange={handleChange} />
                <label className="form-check-label" htmlFor="male">Male</label>
              </div>
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="gender" id="female" value="female" onChange={handleChange} />
                <label className="form-check-label" htmlFor="female">Female</label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
          </form>

        </div>
      </div>
    </>
  );
};

export default SignUp;
