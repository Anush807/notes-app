import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock } from 'lucide-react'
import axios from 'axios'
import { BACKEND_URL } from '../../config'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'; // add this import at the top

interface SpinnerProps {
  size?: number
  color?: string
}

const bars = [
  {
    animationDelay: '-1.2s',
    transform: 'rotate(.0001deg) translate(146%)'
  },
  {
    animationDelay: '-1.1s',
    transform: 'rotate(30deg) translate(146%)'
  },
  {
    animationDelay: '-1.0s',
    transform: 'rotate(60deg) translate(146%)'
  },
  {
    animationDelay: '-0.9s',
    transform: 'rotate(90deg) translate(146%)'
  },
  {
    animationDelay: '-0.8s',
    transform: 'rotate(120deg) translate(146%)'
  },
  {
    animationDelay: '-0.7s',
    transform: 'rotate(150deg) translate(146%)'
  },
  {
    animationDelay: '-0.6s',
    transform: 'rotate(180deg) translate(146%)'
  },
  {
    animationDelay: '-0.5s',
    transform: 'rotate(210deg) translate(146%)'
  },
  {
    animationDelay: '-0.4s',
    transform: 'rotate(240deg) translate(146%)'
  },
  {
    animationDelay: '-0.3s',
    transform: 'rotate(270deg) translate(146%)'
  },
  {
    animationDelay: '-0.2s',
    transform: 'rotate(300deg) translate(146%)'
  },
  {
    animationDelay: '-0.1s',
    transform: 'rotate(330deg) translate(146%)'
  }
]

const Spinner = ({ size = 20, color = '#ffffff' }: SpinnerProps) => {
  return (
    <div style={{ width: size, height: size }}>
      <style>
        {`
          @keyframes spin {
            0% {
              opacity: 0.15;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
      <div className="relative top-1/2 left-1/2" style={{ width: size, height: size }}>
        {bars.map((item, index) => (
          <div
            key={index}
            className="absolute h-[8%] w-[24%] -left-[10%] -top-[3.9%] rounded-[5px]"
            style={{ backgroundColor: color, animation: 'spin 1.2s linear infinite', ...item }}
          />
        ))}
      </div>
    </div>
  )
}

interface SignupComponentProps {
  onSubmit?: (email: string, password: string) => void
}

function SignupComponent({ onSubmit }: SignupComponentProps = {}) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const response = await axios.post(`${BACKEND_URL}/api/v1/auth/signup`, {
      email: email,
      password: password
    })

    console.log(response.data)
    const token = response.data.token
    localStorage.setItem('token', token);

    if (onSubmit) {
      await onSubmit(email, password)
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    setLoading(false)
    navigate("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-black p-4 ">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/10 bg-black/50 p-8 backdrop-blur-sm">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">
                Email
              </label>
              <motion.div
                animate={{
                  borderColor: focusedField === 'email' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'
                }}
                transition={{ duration: 0.2 }}
                className="relative rounded-lg border bg-black/30"
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg bg-transparent px-11 py-3 text-white placeholder:text-gray-500 outline-none"
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">
                Password
              </label>
              <motion.div
                animate={{
                  borderColor: focusedField === 'password' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'
                }}
                transition={{ duration: 0.2 }}
                className="relative rounded-lg border bg-black/30"
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg bg-transparent px-11 py-3 text-white placeholder:text-gray-500 outline-none"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </div>

              </motion.div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full rounded-lg border border-white/20 bg-white py-3 font-semibold text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <Spinner size={20} color="#000000" />
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <a  onClick={() => {
                navigate('/')
              }} href="#" className="text-white hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function SignupComponentDemo() {
  return <SignupComponent />
}
