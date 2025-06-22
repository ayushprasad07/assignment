import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";


const Login = () => {
    const [credentials,setCredentials] = useState({email:"",password:""});
    const navigator = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        console.log(credentials);
        try {
            const {email,password} = credentials;
            const URL = "http://localhost:4000/api/v1/user/login";
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            if(response.ok){
                toast.success(data.message);
                localStorage.setItem('userId',data.user._id);
                localStorage.setItem('token',data.authToken);
                navigator('/user-page')
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value});
    }
  return (
    <div className='container my-5 d-flex justify-content-center align-items-center '>
        <div className='card p-3 border-0' style={{maxWidth:"500px",width:"100%" ,boxShadow:"0px 0px 20px blue"}}>
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="email" name='email' placeholder="name@example.com" onChange={handleChange}/>
                    <label htmlFor="email">Email address</label>
                    </div>
                    <div className="form-floating">
                    <input type="password" className="form-control" id="password" name='password' placeholder="Password" onChange={handleChange}/>
                    <label htmlFor="password">Password</label>
                </div>
                <p className='my-4'>Don't have a account? <Link to='/sign-up'> Sign up</Link></p>
                <button type="submit" className="btn btn-primary my-1">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default Login
