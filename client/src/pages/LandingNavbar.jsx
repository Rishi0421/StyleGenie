import React, { useState } from "react";
import { Menu } from "lucide-react";
import logo from "../assets/logo_SG.png";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios
import { toast } from "react-toastify";

// A simple loader component (you can replace this with a more complex one or an SVG)
const Loader = () => (
    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
    </div>
);


const LandingNavbar = () => {
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    // Loading states
    const [isSigningUp, setIsSigningUp] = useState(false); // <-- New state for Sign Up loading
    const [isSigningIn, setIsSigningIn] = useState(false); // <-- New state for Sign In loading

    const URL = import.meta.env.VITE_BE_URL;
    const [signUpData, setSignUpData] = useState({
        fullName: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [signInData, setSignInData] = useState({
        email: "",
        password: "",
    });
    const [signUpError, setSignUpError] = useState("");
    const [signInError, setSignInError] = useState("");

    const navigate = useNavigate(); // Initialize useNavigate

    // Handle modal opening and closing
    const openSignUp = () => setIsSignUpOpen(true);
    const closeSignUp = () => {
        setIsSignUpOpen(false);
        setSignUpError(""); // Clear errors on close
        setSignUpData({ // Reset form data
            fullName: "",
            mobileNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    };
    const openSignIn = () => setIsSignInOpen(true);
    const closeSignIn = () => {
        setIsSignInOpen(false);
        setSignInError(""); // Clear errors on close
        setSignInData({ // Reset form data
            email: "",
            password: "",
        });
    };

    // Close modal when clicking outside of the container
    const handleModalClose = (event) => {
        if (event.target.classList.contains("modal-overlay")) {
            closeSignUp();
            closeSignIn();
        }
    };

    // Handle Sign-Up input changes
    const handleSignUpInputChange = (e) => {
        setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    };

    // Handle Sign-In input changes
    const handleSignInInputChange = (e) => {
        setSignInData({ ...signInData, [e.target.name]: e.target.value });
    };

    // Handle Sign-Up submission
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setSignUpError(""); // Clear previous errors
        setIsSigningUp(true); // <-- Start loading

        try {
            // Basic client-side validation (e.g., password match)
            if (signUpData.password !== signUpData.confirmPassword) {
                setSignUpError("Passwords do not match.");
                setIsSigningUp(false); // Stop loading on client error
                return;
            }

            const response = await axios.post(`${URL}/api/signup`, signUpData);
            if (response.status === 201) {
                toast.success("Sign up successful!");
                closeSignUp();
                navigate(`/home-page/${response.data.userId}`); // Redirect to the products page
            } else {
                // This path might not be reached if axios throws for non-2xx status
                setSignUpError("Sign up failed.");
            }
        } catch (error) {
            console.error("Sign up error:", error);
            setSignUpError(error.response?.data?.error || "An error occurred during sign up.");
        } finally {
             setIsSigningUp(false); // <-- Stop loading regardless of success or error
        }
    };

    // Handle Sign-In submission
    const handleSignInSubmit = async (e) => {
        e.preventDefault();
        setSignInError(""); // Clear previous errors
        setIsSigningIn(true); // <-- Start loading

        try {
            const response = await axios.post(`${URL}/api/signin`, signInData);
            if (response.status === 200) {
                toast.success("Sign in successful!");
                localStorage.setItem("token", response.data.token); // Store the JWT

                closeSignIn();
                navigate(`/home-page/${response.data.userId}`); // Redirect to the products page
            } else {
                 // This path might not be reached if axios throws for non-2xx status
                setSignInError("Sign in failed.");
            }
        } catch (error) {
            console.error("Sign in error:", error);
            setSignInError(error.response?.data?.error || "Invalid credentials or server error.");
        } finally {
            setIsSigningIn(false); // <-- Stop loading regardless of success or error
        }
    };

    return (
        <div className="bg-black">
            <nav className="border-b border-gray-800">
                {/* ... Navbar content ... */}
                 <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <Link to="/" className="flex items-center">
                            <div className="w-32">
                                <img
                                    src={logo}
                                    alt="Style Logo"
                                    className="object-contain"
                                    width={120}
                                    height={50}
                                />
                            </div>
                        </Link>

                        <div className="flex items-center space-x-6">
                            <button
                                onClick={openSignUp}
                                className="text-white flex items-center"
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={openSignIn}
                                className="text-white"
                            >
                                Login
                            </button>
                            <button className="md:hidden text-white">
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sign Up Modal */}
            {isSignUpOpen && (
                <div
                    className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleModalClose}
                >
                    <div className="bg-white p-8 rounded-lg w-96 shadow-lg relative">
                        <button
                            onClick={closeSignUp}
                            disabled={isSigningUp} // Disable close button while loading
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        >
                            X
                        </button>
                        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
                        {signUpError && <div className="text-red-500 mb-2 text-sm text-center">{signUpError}</div>}
                        <form onSubmit={handleSignUpSubmit}>
                            <div className="space-y-4">
                                {/* ... Sign Up form inputs ... */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                        value={signUpData.fullName}
                                        onChange={handleSignUpInputChange}
                                        disabled={isSigningUp} // Disable input while loading
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                    <input
                                        type="text" // Consider type="tel" for better mobile UX
                                        name="mobileNumber"
                                        placeholder="Enter your mobile number"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                        pattern="[0-9]{10,15}" // Example pattern, adjust as needed
                                        title="Please enter a valid mobile number (10-15 digits)"
                                        value={signUpData.mobileNumber}
                                        onChange={handleSignUpInputChange}
                                        disabled={isSigningUp} // Disable input while loading
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                        value={signUpData.email}
                                        onChange={handleSignUpInputChange}
                                        disabled={isSigningUp} // Disable input while loading
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                        minLength="6" // Example: enforce minimum length
                                        value={signUpData.password}
                                        onChange={handleSignUpInputChange}
                                        disabled={isSigningUp} // Disable input while loading
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                        value={signUpData.confirmPassword}
                                        onChange={handleSignUpInputChange}
                                        disabled={isSigningUp} // Disable input while loading
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-green-500 text-white p-2 rounded-md mt-4 hover:bg-green-600 flex justify-center items-center h-10 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isSigningUp} // Disable button while loading
                                >
                                    {isSigningUp ? <Loader /> : "Sign Up"} {/* <-- Show loader or text */}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sign In Modal */}
            {isSignInOpen && (
                <div
                    className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleModalClose}
                >
                    <div className="bg-white p-8 rounded-lg w-96 shadow-lg relative">
                        <button
                            onClick={closeSignIn}
                            disabled={isSigningIn} // Disable close button while loading
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        >
                            X
                        </button>
                        <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
                        {signInError && <div className="text-red-500 mb-2 text-sm text-center">{signInError}</div>}
                        <form onSubmit={handleSignInSubmit}>
                            <div className="space-y-4">
                                {/* ... Sign In form inputs ... */}
                                 <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                        value={signInData.email}
                                        onChange={handleSignInInputChange}
                                        disabled={isSigningIn} // Disable input while loading
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                        value={signInData.password}
                                        onChange={handleSignInInputChange}
                                        disabled={isSigningIn} // Disable input while loading
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-green-500 text-white p-2 rounded-md mt-4 hover:bg-green-600 flex justify-center items-center h-10 disabled:opacity-70 disabled:cursor-not-allowed"
                                    disabled={isSigningIn} // Disable button while loading
                                >
                                     {isSigningIn ? <Loader /> : "Sign In"} {/* <-- Show loader or text */}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingNavbar;