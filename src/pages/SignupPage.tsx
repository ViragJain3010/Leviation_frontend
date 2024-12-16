import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import img from '@/assets/pic1.png';
import Logo from '@/assets/Logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { SignupAsync, reset } from '@/Slice/Auth.Slice';
import { RootState, AppDispatch } from '@/store/store';
import { useToast } from "@/hooks/use-toast"

const SignUpPage = () => {
  const {toast} = useToast()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, isError, isSuccess, message, token } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(SignupAsync({ name, email, password }));
  };

  useEffect(() => {
      if (isSuccess) {
        toast({
          title: "Registration Successful",
          description: "Welcome!",
        });
        navigate('/products'); 
      }
  
      if (isError) {
        toast({
          title: "Signup Failed",
          description: message || "Please try again.",
          variant: "destructive",
        });
      }

      if (token) {
        toast({
          title: "You were successfully logged in",
          description: "Redirecting",
        });
        navigate('/products'); 
      }
  
      // Reset state after showing the toast
      dispatch(reset());
    }, [isSuccess, isError, message, navigate, dispatch]);

  return (
    <div className="w-full min-h-screen bg-[#121212] text-white font-sans mx-auto relative overflow-hidden">
      <div className="absolute bottom-[10px] left-[-50px] w-[300px] h-[300px] rounded-full bg-[#A3EA5D] opacity-20 blur-[80px] pointer-events-none"></div>
      <div className="absolute top-[30px] left-[50%] w-[400px] h-[400px] rounded-full bg-[#A3EA5D] opacity-20 blur-[80px] pointer-events-none"></div>
      <div className="absolute top-[50px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[#4F59A8] opacity-20 blur-[80px] pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 h-max">
        {/* Navbar */}
        <div className="flex bg-[#1F1F1F] justify-between items-center px-8 py-3 opacity bg-opacity-100 z-10">
          <div className="flex items-center space-x-2 px-12">
            <img src={Logo} alt="Logo" />
          </div>

          {/* Login Button */}
          <Button
            className="bg-[#A3EA5D] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#92d952]"
            asChild
          >
            <Link to="/login">Login</Link>
          </Button>
        </div>

        {/* Content Section */}
        <div className="flex gap-6 h-full align-middle items-center justify-between py-12 z-10">
          {/* Left Section: Signup Form */}
          <div className="space-y-8 p-20 mx-8">
            <div>
              <h1 className="text-4xl font-semibold">Sign up to begin journey</h1>
              <p className="text-[#AAAAAA] mt-2">
                This is a basic signup page for levitation assignment purposes.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 font-poppins">
              {/* Enter Your Name */}
              <div>
                <Label htmlFor="name" className="block text-lg font-medium mb-2">
                  Enter your name
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1F1F1F] border border-[#333333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#A3EA5D]"
                  required
                  disabled={isLoading}
                />
                <p className="text-[#B8B8B8] text-sm mt-1">
                  This name will be displayed with your inquiry
                </p>
              </div>

              {/* Email Address */}
              <div>
                <Label htmlFor="email" className="block text-lg font-medium mb-2">
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1F1F1F] border border-[#333333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#A3EA5D]"
                  required
                  disabled={isLoading}
                />
                <p className="text-[#B8B8B8] text-sm mt-1">
                  This email will be displayed with your inquiry
                </p>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="block text-lg font-medium mb-2">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter the Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A3EA5D]"
                  required
                  disabled={isLoading}
                />
                <p className="text-[#B8B8B8] text-sm mt-1">
                  Any further updates will be forwarded on this Email ID
                </p>
              </div>

              {/* Register Button */}
              <div className="flex items-center space-x-4">
                <Button
                  type="submit"
                  variant="default"
                  className="bg-[#303030] text-[#CCF575] font-semibold px-6 py-3 rounded-lg hover:bg-[#92d952] hover:text-black"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
                <Link to="/login" className="text-[#B8B8B8] hover:underline cursor-pointer">
                  Already have an account?
                </Link>
              </div>
            </form>
          </div>

          {/* Right Section: Image */}
          <div className="hidden lg:flex items-center justify-center relative">
            <img
              src={img}
              alt="Green technology wall"
              className="rounded-lg shadow-lg object-fill"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
