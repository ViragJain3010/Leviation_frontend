import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginAsync, reset } from "@/Slice/Auth.Slice";
import { AppDispatch, RootState } from "@/store/store";
import Logo from "@/assets/Logo.png";
import img2 from "@/assets/pic2.png";
import img3 from "@/assets/pic3.png";
import LogoSymbol from "@/assets/LogoSymbol.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"

const LoginPage = () => {
  const { toast } = useToast()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [sliderPosition, setSliderPosition] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, isError, isSuccess, message, token } = useSelector(
    (state: RootState) => state.auth
  );

  // Slide animation every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderPosition((prev) => (prev === 0 ? 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate('/products'); 
    }

    if (isError) {
      toast({
        title: "Login Failed",
        description: message || "Invalid credentials. Please try again.",
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

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset any previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) return;

    // Dispatch login action
    dispatch(LoginAsync({ email, password }));
  };

  return (
    <div className="w-full min-h-screen bg-[#141414] text-white font-sans relative overflow-hidden">
      <div className="absolute bottom-[10px] left-[-50px] w-[300px] h-[300px] rounded-full bg-[#A3EA5D] opacity-20 blur-[80px] pointer-events-none"></div>
      <div className="absolute top-[50px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[#4F59A8] opacity-20 blur-[80px] pointer-events-none"></div>

      {/* Navbar */}
      <div className="flex bg-[#1F1F1F] justify-between items-center px-8 py-4">
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" />
        </div>

        <Button
          variant="default"
          className="text-[#CCF575] border border-[#CCF575] px-4 py-6"
        >
          Connecting People With Technology
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-8 px-20 h-[80vh] items-center">
        {/* Left Section: Image Slider */}
        <div className="relative h-full w-3/4 overflow-hidden mx-8 rounded-lg">
          <div
            className="absolute top-0 left-0 w-fit h-5/6 transition-all duration-1000 ease-in-out"
            style={{
              transform: `translateX(${sliderPosition === 0 ? "0" : "-90%"})`,
            }}
          >
            <img
              src={img2}
              alt="Technology Poster"
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
          <div
            className="absolute top-0 left-0 w-fit h-5/6 transition-all duration-1000 ease-in-out"
            style={{
              transform: `translateX(${sliderPosition === 1 ? "20%" : "110%"})`,
            }}
          >
            <img
              src={img3}
              alt="Technology Poster"
              className="rounded-lg shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Right Section: Login Form */}
        <div className="space-y-8">
          <div className="space-y-12">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <img src={LogoSymbol} alt="Logo" className="h-16" />
                <span className="flex flex-col">
                  <span className="text-white text-2xl font">levitation</span>
                  <span className="text-md text-white font-light">infotech</span>
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-semibold">Let the Journey Begin!</h1>
              <p className="text-[#AAAAAA]">
                This is basic login page which is used for levitation assignment
                purpose.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="bg-[#1F1F1F] text-white border border-[#333333] focus:ring-[#A3EA5D]"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-lg font-medium mb-2"
              >
                Current Password
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Enter the Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1F1F1F] text-white border border-[#333333] focus:ring-[#A3EA5D]"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                type="submit"
                className="text-[#CCF575] bg-[#303030] font-semibold px-6 py-3 rounded-lg hover:bg-[#92d952] hover:text-black"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login now'}
              </Button>
              <p className="text-[#AAAAAA] hover:underline hover:cursor-pointer">
                Forget password?
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
