import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const { login } = useContext(AuthContext)

    const handleSubmit = async(e) => {
        e.preventDefault()

        try
        {
            await login({ email, password })
            navigate('/dashboard')
        }

        catch(err)
        {
            alert('Login Failed',err)
        }
    }
    
        return (
            <div className='flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 min-h-screen p-4'>
                <div className='login-card bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md'>
                    <h2 className='text-3xl font-extrabold text-center mb-4 tracking-tight'>Login</h2>

                <form onSubmit={handleSubmit} >
                    <div>
                        <label className='text-gray-600 mb-1 block' htmlFor="">Email</label>

                        <input 
                            type="text" 
                            value = {email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                            
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus-strong transition'
                            required 
                        />
                    </div>

                    <div className=''>
                        <label className='block text-gray-600 mb-1'>Password</label>

                        <input 
                            type="password" 
                            value = {password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder='Enter your password'
                            
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus-strong transition'
                            required
                        />

                        <button
                            type="submit"
                            className='w-full bg-blue-600 text-white mt-4 py-2 rounded-lg hover:bg-blue-700 transform transition'
                        >
                            <span className='font-semibold'>Login</span>
                        </button>
                    </div>
                </form>

                                                <p className='text-sm text-gray-500 text-center mt-4'>Demo Login  <b>test@test.com/123456 </b> </p>

                                                <p className='text-sm text-gray-600 text-center mt-3'>Not registered?{' '}
                                                    <Link to="/register" className='font-semibold text-blue-600'>Click here</Link>
                                                </p>
                                        </div>
                                </div>
    )
}

export default Login