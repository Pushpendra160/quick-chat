import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const {login} = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(currState === "Sign up"&&!isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    } 
      login(currState==="Sign up"? 'signup': 'login',{fullName,email,password,bio});
  }
  return (
    <div className='flex items-center justify-center min-h-screen bg-cover bg-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
       {/* Left side image  */}
       <img src={assets.logo_big} alt="login" className='w-[min(30vw,250px)]' />
       {/* Right side form  */}
       <form onSubmit={handleSubmit} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
         <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {
            isDataSubmitted &&
          <img onClick={()=>{setIsDataSubmitted(false)}} src={assets.arrow_icon} alt="logo" className='w-5 cursor-pointer' />

          }
          </h2>
       {
        currState==="Sign up" && !isDataSubmitted &&
        (
      <input value={fullName} onChange={(e)=>{setFullName(e.target.value)}} type="text" className='p-2  border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required />
        )
       }
       {
        !isDataSubmitted &&
        <>
        <input type="email" className='p-2  border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Email' value={email} onChange={(e)=>{setEmail(e.target.value)}} required />
        <input type="password" className='p-2  border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Password' value={password} onChange={(e)=>{setPassword(e.target.value)}} required />
      
        </>
       
       }
          {
          currState==="Sign up" && isDataSubmitted &&
          (
          <textarea rows={4} className='p-2  border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Bio' value={bio} onChange={(e)=>{setBio(e.target.value)}} required />
          )
        }
        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>{currState==="Sign up"?"Create Account":"Login Now"}</button>
    
          <div className='flex items-center gap-2 text-sm text-gray-500 '>
            <input type="checkbox" />
            <p>Agree to the terms of use & privacy policy.</p>
          </div>

          <div className='flex flex-col gap-2'> 
             {
              currState==="Sign up" ?
              (
              <p className='text-sm text-gray-500'>Already have an account? <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className='text-violet-500 font-medium cursor-pointer'>Login</span></p>
              )
              :
               (
                  <p className='text-sm text-gray-500'>Don't have an account? <span onClick={()=>{setCurrState("Sign up"); setIsDataSubmitted(false)}} className='text-violet-500 font-medium cursor-pointer'>Sign Up</span></p>
               )
             }
          </div>
       </form>
    </div>
  )
}

export default LoginPage