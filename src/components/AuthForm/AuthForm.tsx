'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
         }}>
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2 min-h-[600px]">
        
        {/* Left Side - Login Form */}
        <div className="p-12 flex flex-col justify-center bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back!'}
              </h1>
              <p className="text-gray-600">
                {isSignUp ? 'Join us and start your journey' : 'Sign in to continue to your account'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-700"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-700"
                  placeholder="Enter your password"
                />
              </div>

              {!isSignUp && (
                <div className="text-right">
                  <button type="button" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Login')}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gradient-to-br from-purple-50 to-pink-50 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  className="flex justify-center items-center py-3 px-4 rounded-2xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  className="flex justify-center items-center py-3 px-4 rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5" fill="#181717" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  className="flex justify-center items-center py-3 px-4 rounded-2xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                  }}
                  className="text-sm text-gray-600"
                >
                  {isSignUp ? (
                    <>Already have an account? <span className="text-purple-600 hover:text-purple-800 font-medium">Sign in</span></>
                  ) : (
                    <>Don't have an account? <span className="text-purple-600 hover:text-purple-800 font-medium">Sign up</span></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden md:flex items-center justify-center p-12 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden">
          <div className="text-center relative z-10">
            {/* 3D Cartoon Boy Illustration */}
            <div className="relative">
              <div className="w-80 h-80 mx-auto mb-8 relative">
                {/* Boy sitting on chair */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Chair */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <div className="w-32 h-20 bg-gradient-to-b from-amber-200 to-amber-300 rounded-2xl shadow-lg transform rotate-3"></div>
                      <div className="w-6 h-16 bg-gradient-to-b from-amber-300 to-amber-400 rounded-full absolute -bottom-16 left-4 shadow-md"></div>
                      <div className="w-6 h-16 bg-gradient-to-b from-amber-300 to-amber-400 rounded-full absolute -bottom-16 right-4 shadow-md"></div>
                    </div>
                    
                    {/* Boy */}
                    <div className="relative z-10">
                      {/* Head */}
                      <div className="w-24 h-24 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full mx-auto mb-2 relative shadow-lg">
                        {/* Hair */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-28 h-16 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full shadow-md"></div>
                        {/* Eyes */}
                        <div className="absolute top-8 left-6 w-3 h-3 bg-gray-800 rounded-full"></div>
                        <div className="absolute top-8 right-6 w-3 h-3 bg-gray-800 rounded-full"></div>
                        {/* Smile */}
                        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-gray-700 rounded-full"></div>
                      </div>
                      
                      {/* Body */}
                      <div className="w-20 h-24 bg-gradient-to-b from-blue-400 to-blue-500 rounded-2xl mx-auto relative shadow-lg">
                        {/* Arms */}
                        <div className="absolute -left-6 top-4 w-12 h-4 bg-gradient-to-r from-blue-400 to-orange-200 rounded-full transform -rotate-12 shadow-md"></div>
                        <div className="absolute -right-6 top-4 w-12 h-4 bg-gradient-to-l from-blue-400 to-orange-200 rounded-full transform rotate-12 shadow-md"></div>
                      </div>
                      
                      {/* Laptop */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                        <div className="w-16 h-12 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg shadow-lg transform -rotate-3">
                          <div className="w-14 h-10 bg-gradient-to-b from-gray-100 to-gray-200 rounded-md m-1">
                            <div className="w-12 h-8 bg-gradient-to-b from-blue-200 to-purple-200 rounded-sm m-1"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Legs */}
                      <div className="absolute -bottom-4 left-3 w-6 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-md"></div>
                      <div className="absolute -bottom-4 right-3 w-6 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shadow-md"></div>
                    </div>
                  </div>
                </div>
                
                {/* Cactus */}
                <div className="absolute right-4 bottom-8">
                  <div className="w-8 h-20 bg-gradient-to-b from-green-400 to-green-500 rounded-full relative shadow-lg">
                    {/* Cactus spines */}
                    <div className="absolute top-2 left-1 w-1 h-1 bg-green-700 rounded-full"></div>
                    <div className="absolute top-6 right-1 w-1 h-1 bg-green-700 rounded-full"></div>
                    <div className="absolute top-10 left-1 w-1 h-1 bg-green-700 rounded-full"></div>
                    <div className="absolute top-14 right-1 w-1 h-1 bg-green-700 rounded-full"></div>
                  </div>
                  {/* Pot */}
                  <div className="w-12 h-8 bg-gradient-to-b from-amber-600 to-amber-700 rounded-lg shadow-lg"></div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">Start Your Journey</h2>
              <p className="text-gray-600 max-w-xs mx-auto leading-relaxed">
                Join thousands of users who trust us with their productivity and organization needs.
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-32 right-16 w-6 h-6 bg-pink-300 rounded-full opacity-40 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-8 w-3 h-3 bg-purple-300 rounded-full opacity-50 animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  )
}