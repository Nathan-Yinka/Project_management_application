import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../../assets/auth_image.jpeg";
import { dashboard, signup } from "../../constants/app.routes";
import { toast } from "sonner"
import { Spinner } from "@material-tailwind/react";
import { useUserContext } from "@/context/UserContext";

const Login = () => {
  const { loginUser, isLoadingLogin } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    const errors = [];
  
    if (!email) {
      errors.push("Email or Username is required");
    } 
  
    if (!password) {
      errors.push("Password is required");
    } 
  
    // Show all errors using toast notifications
    errors.forEach((error) => toast.error(error));
  
    // Return true if no errors, otherwise false
    return errors.length === 0;
  };
  
  const handleLogin = async () => {
    if (validateInputs()) {
      const success = await loginUser({ username:email, password });
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-auto">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start md:p-16 relative">
        <div className="w-full md:w-3/4 px-4 md:px-0 md:ml-16">
          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-1 md:mb-2 mt-5 md:mt-0">
            Login
          </h1>
          <p className="text-sm mb-4 md:mb-8 text-center font-thin">
            Get access into your account
          </p>
          <form className="w-full">
            <div className="mb-4 md:mb-8">
              <label
                className="block text-gray-700 text-sm font-normal mb-2"
                htmlFor="email"
              >
                Email/Username
              </label>
              <input
                id="email"
                type="text"
                placeholder="Enter Email or Username"
                className="border rounded-lg w-full py-3 md:py-4 px-3 text-gray-700 leading-tight"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4 md:mb-8">
              <label
                className="block text-gray-700 text-sm font-normal mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  className="border rounded-lg w-full py-3 md:py-4 px-3 text-gray-700 leading-tight"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      className={showPassword ? "hidden" : "block"}
                      d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                    ></path>
                    <path
                      className={showPassword ? "hidden" : "block"}
                      d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                    ></path>
                    <path
                      className={showPassword ? "hidden" : "block"}
                      d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                    ></path>
                    <line
                      className={showPassword ? "hidden" : "block"}
                      x1="2"
                      x2="22"
                      y1="2"
                      y2="22"
                    ></line>
                    <path
                      className={showPassword ? "block" : "hidden"}
                      d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                    ></path>
                    <circle
                      className={showPassword ? "block" : "hidden"}
                      cx="12"
                      cy="12"
                      r="3"
                    ></circle>
                  </svg>
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between md:mr-0">
              <button
                type="button"
                onClick={handleLogin}
                className="bg-black text-white font-bold py-2 px-4 rounded-lg btn-primary w-full"
                disabled={isLoadingLogin}
              >
                {isLoadingLogin ? <Spinner color="white" className="font-bold" /> : "Login"}
              </button>
            </div>
            <p className="text-sm mb-4 md:mb-8 text-center font-thin">
              Don’t have an Account?
              <span
                onClick={() => navigate(signup)}
                className="font-semibold cursor-pointer ml-1"
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-6">
        <div className="relative w-full h-64 md:h-full rounded-tr-[3rem] rounded-bl-[3rem] overflow-hidden">
          <img
            src={loginImage}
            alt="Login"
            className="object-cover w-full h-full rounded-tr-[3rem] rounded-bl-[3rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
