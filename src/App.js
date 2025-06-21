import React,{ useState,useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where
} from "firebase/firestore";

import Logged from "./Logged";

import "./index.css";

function App() {
  const [showPass, setShowPass] = useState(false);
  const [logged, setlogged] = useState(false);
  const [loading, setLoading] = useState(false);
  
  
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);  
  }, [darkMode]);
  
  const userRef = collection(db,"users")
  

  const [isSignup, setIsSignup] = useState(false);
  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");
  const signUpFunc = async (e) => {
    e.preventDefault();
    setLoading(true);

    try{
      await addDoc(userRef,{
        user:newUser,
        password:newPass
      });
    
      setIsSignup(false);
    } catch(err) {
      handleError("Failed to create User",err);
    }
    finally{
      setLoading(false);
      setUserState(newUser);
      setlogged(true);
      showToastMessage("Welcome");
    }
  }
 
  const [userState, setUserState] = useState("");
  const [passState, setPassState] = useState("");

  const checkCreds = async (e) => {
    e.preventDefault();
    try{
      const q = query(userRef, where("user", "==", userState), where("password", "==", passState));
      setLoading(true);
      const result = await getDocs(q);
      if(result.empty){
        showToastMessage("User not found","error");
      }else{
        setlogged(true);
        showToastMessage("Welcome")
      }
    }
    catch(err){
      handleError("Error",err);
    }
    finally{
      setLoading(false);
    }
    
  }
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleError = (msg, err) => {
    console.error(msg, err);
    setErrorMessage(`${msg}: ${err.message}`);
    setShowError(true);
  };

  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const passShow = (e) => {
    e.target.classList.toggle("show");
 

    const inp = document.querySelector(".password-wrapper").childNodes[0];
    inp.type = inp.type === "password" ? "text" : "password";
    
    setShowPass(!showPass);
  }
  return(
    <>
      {showToast && 
        <div className={`toast ${toastType}`}>
          {toastMessage}
        </div>}
      {loading && (
        <div className="modal-overlay">
          <div className="modal-loader">Loading tasks...</div>
        </div>
      )}
      {showError && (
        <div className="modal-overlay" onClick={() => setShowError(false)}>
          <div className="error-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Error</h3>
            <p>{errorMessage}</p>
            <button onClick={() => setShowError(false)}>Close</button>
          </div>
        </div>
      )}
      {isSignup && (
        <div className="modal-overlay">
          <div className="signup-modal">
            <h3>
              Sign Up 
              <button 
              className="delete-btn" 
              onClick={(e)=>setIsSignup(false)}>
              ✕
              </button>
            </h3>
            <h4>and get ahead by simplifying your tasks</h4>
            <form className="signup-form">
              <label>Username</label>
              <input className="Newuser" 
              onChange={(e)=>setNewUser(e.target.value)} value={newUser}
              required/>
              <label>Password</label>
              <input className="Newpass"
              onChange={(e)=>setNewPass(e.target.value)} value={newPass}
              required/>
              <button className="signup-btn" onClick={(e)=>signUpFunc(e)}>Submit</button>
            </form>
          </div>
        </div>
      )}
      {logged 
      ? (<Logged loading={loading} setLoading={setLoading}
      setShowError={setShowError} handleError={handleError}
      showToastMessage={showToastMessage} userState={userState}
      setlogged={setlogged}/>)
      : (<div className="login-container">
          <div className="container">
            <h1 className="app-heading">
              Welcome... 
              <button
              className="dark-toggle"
              onClick={() => setDarkMode((prev) => !prev)}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </h1>
            <h3 className="creds">Please Enter your credentials</h3>
            <div className="creds2">
              New User ??....   
              <button onClick={(e)=>setIsSignup(true)}>Sign Up</button>
            </div>
            <div className="loginBody">
              <div className="imageContainer">
              </div>
              <form>
                <label className="credLabel">Username</label>
                <input type="text" required className="credData"
                 onChange={e=>setUserState(e.target.value)} value={userState}
                />
                <label className="credLabel">
                  Password
                  
                </label>
                <div className="password-wrapper">
                  <input type={showPass ? "text" : "password"}
                  required className="credData"
                  onChange={e=>setPassState(e.target.value)} value={passState}/>
                  <span className="pwd-toggle" onClick={(e) => passShow(e)}>
                    
                  </span>
                </div>
                <button 
                className="formBtn" onClick={(e)=>checkCreds(e)}
                onKeyDown={(e)=>{e.key==="Enter" && checkCreds(e)}}>
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>)}
    </>
  )
}

export default App;
