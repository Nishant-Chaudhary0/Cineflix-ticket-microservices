import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setForm] = useState({
    username :'',
    email:'',
    password:''
  })
  const [loading, setLoading] = useState(false)

  function handleChange(e){
    setForm({...formData,
    [e.target.name] : e.target.value})
  }

 

 async function submit (e){
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/v1/auth/signup", formData);
      toast.success("Account created successfully!")
      navigate("/login")
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Failed to create account",error);
    }finally{
      setLoading(false);
    }
  }
  return (
     <div className="min-h-screen bg-black/50 flex items-center justify-center">
      <div className="w-[360px] rounded-2xl overflow-hidden bg-white shadow-xl">

        {/* Purple Header */}
        <div className="bg-gradient-to-br from-violet-600 via-purple-500 to-purple-300 px-8 pt-8 pb-10 text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">district</h1>
          <p className="text-[10px] tracking-[3px] text-white/70 mt-1 mb-4">BY ZOMATO</p>
          <p className="text-white/90 text-sm">Experience the best in Dining, Movies, and Events.</p>
        </div>

        {/* Form Body */}
        <div className="px-6 py-7">
          <h2 className="text-xl font-semibold text-center text-gray-900 mb-1">Create your account</h2>
          <p className="text-sm text-gray-400 text-center mb-6">Sign up to get started</p>

          <form onSubmit={submit} className="space-y-4">

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                required
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
{/* 
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )} */}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-black text-white rounded-xl text-sm font-semibold mt-2 hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Continue'}
            </button>

          </form>

          <p className="text-xs text-gray-400 text-center mt-5">
            By continuing, you agree to our{' '}
            <span className="underline cursor-pointer">Terms of Service</span>
            {' '}&nbsp;
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>

      </div>
    </div>
  )
}

export default SignUp
