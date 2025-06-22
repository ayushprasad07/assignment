import React from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/')
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <a className="navbar-brand" href="/">Navbar</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <div>
                  {localStorage.getItem('userId') && 
                    <>
                      <button className='btn btn-outline-primary' onClick={handleLogout}>Logout</button>
                    </>
                  }
                </div>
            </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
