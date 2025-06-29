import { useState, useEffect } from "react";
import { User2, Lock, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import pic1 from "../../assets/pic1.png";
import pic2 from "../../assets/pic2.png";
import pic3 from "../../assets/pic3.png";
import logo from "../../assets/oralogo.png";
import { useNavigate } from "react-router-dom";
import api from "../../services/loginService";
import { LOGIN_ENDPOINT } from "../../config/apiConfig";
import "./LoginButton.css";
const images = [pic1, pic2, pic3];
export default function NewLogin() {
  const [currentImage, setCurrentImage] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = 3000; // 3s delay before change
    const timer = setTimeout(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, delay + 4000); // Total cycle: 3s delay + 4s fade

    return () => clearTimeout(timer);
  }, [currentImage, images.length]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;

    if (!username.trim()) {
      newErrors.username = "Username is required.";
    } else if (!emailRegex.test(username)) {
      newErrors.username = "Invalid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }
    // else if (!passwordRegex.test(password)) {
    //   newErrors.password =
    //     "Password must be at least 4 characters long and contain at least one letter and one number.";
    // }

    // If any errors, show them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
console.log('execute');
    setErrors({});

    setLoading(true);
    try {
      const response = await api.post(LOGIN_ENDPOINT, {
        email: username,
        password,
      });

      const {
        token,
        refresh,
        id,
        role_name,
        email: userEmail,
        allowed_pages,
        last_name,
        first_name,
      } = response.data;

      // Save token and user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem('refresh', refresh); 
      localStorage.setItem("role_name", role_name);
      localStorage.setItem(
        "user",
        JSON.stringify({
          role_name,
          id,
          userEmail,
          allowed_pages,
          last_name,
          first_name,
        })
      );

      if (role_name == "patient") {
        navigate("/profile");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#ededf9]">
      {/* Left slideshow section */}
      <div className="w-full lg:w-[65%] relative h-64 lg:h-full">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className={`absolute w-full h-full object-cover p-4 rounded-[20px] lg:rounded-[40px] transition-opacity duration-[4000ms] ease-in-out ${
              currentImage === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div
          className="
    absolute 
    bottom-6 left-6 
    lg:bottom-20 lg:left-10 
    text-white font-normal 
    text-[28px] leading-[36px] tracking-[-0.5px] 
    sm:text-[36px] sm:leading-[44px] sm:tracking-[-0.72px]
    md:text-[42px] md:leading-[52px] md:tracking-[-0.84px] 
    lg:text-[48px] lg:leading-[60px] lg:tracking-[-0.96px]
    font-inter
  "
        >
          <p>Welcome to Eliyya's</p>
          <p>Peaceful World</p>
        </div>
      </div>

      {/* Right login form */}
      <div className="w-full lg:w-[35%] flex flex-col justify-center items-center lg:px-16 px-8 py-8 font-inter">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
          <div className="w-full flex justify-center">
            <img src={logo} alt="Logo" />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div
              className={`input-wrapper ${
                errors.username ? "error" : isFocused ? "focused" : ""
              }`}
            >
              <svg
                className="icon"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                fill="none"
                viewBox="0 0 16 17"
              >
                <circle cx="8.125" cy="4.8125" r="2.625" stroke="#535862" />
                <ellipse
                  cx="8.125"
                  cy="12.0312"
                  rx="4.59375"
                  ry="2.625"
                  stroke="#535862"
                />
              </svg>

              <input
                type="text"
                placeholder="Enter username"
                className="input-field"
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>
          {/* Password Input */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div
              className={`input-wrapper ${
                errors.password ? "error" : isFocusedPassword ? "focused" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M1.5625 11.375C1.5625 9.51884 1.5625 8.59077 2.13913 8.01413C2.71577 7.4375 3.64384 7.4375 5.5 7.4375H10.75C12.6062 7.4375 13.5342 7.4375 14.1109 8.01413C14.6875 8.59077 14.6875 9.51884 14.6875 11.375C14.6875 13.2312 14.6875 14.1592 14.1109 14.7359C13.5342 15.3125 12.6062 15.3125 10.75 15.3125H5.5C3.64384 15.3125 2.71577 15.3125 2.13913 14.7359C1.5625 14.1592 1.5625 13.2312 1.5625 11.375Z"
                  stroke="#535862"
                />
                <path
                  d="M4.1875 7.4375V6.125C4.1875 3.95038 5.95038 2.1875 8.125 2.1875C10.2996 2.1875 12.0625 3.95038 12.0625 6.125V7.4375"
                  stroke="#535862"
                  stroke-linecap="round"
                />
              </svg>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="input-field"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocusedPassword(true)}
                onBlur={() => setIsFocusedPassword(false)}
              />

              <button
                type="button"
                className="text-xs text-gray-500 mr-2 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                    >
                      <path
                        d="M2 2L14 14"
                        stroke="#535862"
                        stroke-width="1.5"
                        stroke-linecap="round"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.875 3.5C5.13064 3.5 3.26285 5.14034 2.14915 6.58722C1.59138 7.31185 1.3125 7.67416 1.3125 8.75C1.3125 9.82584 1.59138 10.1882 2.14915 10.9128C3.26285 12.3597 5.13064 14 7.875 14C9.16987 14 10.2934 13.5718 11.2251 12.918L3.08203 4.7749C4.18159 3.97884 5.51877 3.5 7.875 3.5ZM12.4715 11.2203C13.1812 10.3082 13.6964 9.57809 14.0875 8.75C13.5302 7.62313 12.6787 6.5233 11.5863 5.60469C10.7785 4.92355 9.63834 4.3125 8.125 4.3125C7.85767 4.3125 7.59595 4.33577 7.33984 4.38135L12.4715 9.51299C12.5732 9.84957 12.5732 10.1905 12.4715 11.2203Z"
                        fill="#535862"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                    >
                      <path
                        d="M6.39844 8.75C6.39844 7.93452 7.05952 7.27344 7.875 7.27344C8.69048 7.27344 9.35156 7.93452 9.35156 8.75C9.35156 9.56548 8.69048 10.2266 7.875 10.2266C7.05952 10.2266 6.39844 9.56548 6.39844 8.75Z"
                        fill="#535862"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M1.3125 8.75C1.3125 9.82584 1.59138 10.1882 2.14915 10.9128C3.26285 12.3597 5.13064 14 7.875 14C10.6194 14 12.4871 12.3597 13.6009 10.9128C14.1586 10.1882 14.4375 9.82584 14.4375 8.75C14.4375 7.67416 14.1586 7.31185 13.6009 6.58722C12.4871 5.14034 10.6194 3.5 7.875 3.5C5.13064 3.5 3.26285 5.14034 2.14915 6.58722C1.59138 7.31185 1.3125 7.67416 1.3125 8.75ZM7.875 6.28906C6.51586 6.28906 5.41406 7.39086 5.41406 8.75C5.41406 10.1091 6.51586 11.2109 7.875 11.2109C9.23414 11.2109 10.3359 10.1091 10.3359 8.75C10.3359 7.39086 9.23414 6.28906 7.875 6.28906Z"
                        fill="#535862"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
            {errors.password && (
              <div className="text-sm text-red-500">{errors.password}</div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm space-y-2 sm:space-y-0">
            <label className="flex items-center space-x-2">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />

                <div
                  className="relative w-11 h-6 peer-focus:outline-none peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{
                    backgroundColor: "#e6e5eb",
                    borderColor: "#e6e5eb",
                    "--tw-ring-color": "#e6e5eb",
                  }}
                ></div>

                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-black-300">
                  Remember me
                </span>
              </label>
              {/* <span>Remember me</span> */}
            </label>
          </div>
          {errors.agree && (
            <p className="text-red-500 text-sm">{errors.agree}</p>
          )}

          <div className="w-full flex justify-center">
            <button className="login-button">
              {loading ? <Loader2 className="animate-spin" /> : "Login"}
            </button>
          </div>

          <div className="text-sm text-right"></div>
        </form>
      </div>
    </div>
  );
}
  