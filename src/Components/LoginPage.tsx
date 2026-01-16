import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "./InfoContext";
import Cookies from "js-cookie"; //import cookies to see the
//const cookies = import from js-cookie

function LoginPage() {
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [tokenNotFound, setTokenNotFound] = useState(false);
  const [tokenErr, setTokenErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);

  //for refresh
  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setTokenNotFound(true);
        navigate("/");
        return;
      }
      try {
        const res = await fetch("http://localhost:4000/users", {
          method: "GET",
          headers: { Authorization: "Bearer " + token },
        });
        const data = await res.json();
        setFirstname(data.first);
        setLastname(data.last);
       
      } catch (error) {
        setTokenErr(true);
        navigate("/");
        Cookies.remove("token");
        return;
      }
    };
    checkToken();
  }, []);

  const [loginU, setLoginU] = useState("");
  const [loginP, setLoginP] = useState("");
  //main guy
  const [correct, setCorrect] = useState(false);
  const [started, setStarted] = useState(false);
  const [info, setInfo] = useState(false);
  const [loginShake, setLoginShake] = useState(false);
  const [none, setNone] = useState(false);
  const [spin, setSpin] = useState(false);

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regCorrect, setRegCorrect] = useState(false);
  const [alreadyEmail, setAlreadyEmail] = useState(false);
  const [wrongPas, setWrongPas] = useState(false);
  const [shake, setShake] = useState(false);
  const [regFirst, setRegFirst] = useState("");
  const [regLast, setRegLast] = useState("");
  const [regSpin, setRegSpin] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  //forgot password states
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLast, setForgotLast] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confNewPass, setConfNewPass] = useState("");

  const [forgot_pass_mismatch, setForgot_pass_mismatch] = useState(false);
  const [passChanged, setPassChanged] = useState(false);
  const [forgotError, setForgotError] = useState(false);
  const [lastNotFound, setLastNotFound] = useState(false);
  const [noEmail, setNoEmail] = useState(false);

  const { setEml } = useUser();
 
  const timer = () => {
    setTimeout(() => {
      navigate("/HomePage");
      setRegEmail("");
      setRegPassword("");
      setRegConfirm("");
    }, 1500);
  };
  const expire = ()=>{
    setTimeout(()=>{
        setEml(true);
    }, 2000)
    setTimeout(()=>{
        setEml(false);
    }, 5000)
  }
  const validate = async ({ email: user, password: pass }) => {
    let error = false;
    try {
      setSpin(true);
      const res = await fetch("http://localhost:4000/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user,
          password: pass,
        }),
      });

      const data = await res.json();
      setStarted(true);
      if (data.success) {
        Cookies.set("token", data.token, { expires: 1 });
        setCorrect(true);
        error = false;
        setNone(false);
        timer();
        setSpin(false);
        checkCookie();
        expire();
      } else {
        setCorrect(false);
        error = true;
        setSpin(false);
        // Only show 'Please Register' if backend says user not found
        if (data.error === "user_not_found") {
          setNone(true);
        } else {
          setNone(false);
        }
      }
      setEml(user);
    } catch (error) {
      console.error(error);
      error = true;
    }
    if (error) {
      setLoginShake(true);
      setTimeout(() => setLoginShake(false), 500);
    }

  };

  const moveToLogin = () => {
    setTimeout(() => {
      setActiveTab("login");
    }, 1500);
  };

  const validateRegister = async (e) => {
    e.preventDefault();
    let error = false;
    if (regPassword !== regConfirm) {
      setRegConfirm("");
      setWrongPas(true);
      setRegCorrect(false);
      error = true;
    } else {
      setWrongPas(false);
    }
    try {
      if (!error) {
        setRegSpin(true);
        const res = await fetch("http://localhost:4000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: regEmail,
            password: regPassword,
            first: regFirst,
            last: regLast,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setRegCorrect(true);
          setAlreadyEmail(false);
          moveToLogin();
          setRegSpin(false);
        } else {
          setRegCorrect(false);
          setAlreadyEmail(true);
          error = true;
          setRegSpin(false);
        }
      }
    } catch (error) {
      console.error(error);
      error = true;
    }
    if (error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleShowForgot = () => {
    setShowForgot(true);
    setStarted(false);
    setCorrect(false);
    setNone(false);
    setLoginShake(false);
    setWrongPas(false);
    setAlreadyEmail(false);
    setRegCorrect(false);
    setShake(false);
    setPassChanged(false);
    setForgot_pass_mismatch(false);
    setForgotError(false);
  };
  const handleBackFromForgot = () => {
    setShowForgot(false);
    setStarted(false);
    setCorrect(false);
    setNone(false);
    setLoginShake(false);
    setWrongPas(false);
    setAlreadyEmail(false);
    setRegCorrect(false);
    setShake(false);
    setPassChanged(false);
    setForgot_pass_mismatch(false);
    setForgotError(false);
  };

  //reset password request
  const reset = async (e) => {
    e.preventDefault();
    if (newPass !== confNewPass) {
      setForgot_pass_mismatch(true);
      setNoEmail(false);
      setLastNotFound(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          last: forgotLast,
          password: newPass,
        }),
      });
      const data = await res.json();
      if (data.status === 400) {
        setNoEmail(true);
        setLastNotFound(false);
        setForgot_pass_mismatch(false);
        return;
      }
      if (data.status === 401) {
        setLastNotFound(true);
        setNoEmail(false);
        setForgot_pass_mismatch(false);
        return;
      }
      if (data.success) {
        setPassChanged(true);
        setLastNotFound(false);
        setNoEmail(false);
        setForgot_pass_mismatch(false);
        setTimeout(() => {
          setActiveTab("login");
          setShowForgot(false);
        }, 1500);
      } else {
        setForgotError(true);
        setLastNotFound(false);
        setNoEmail(false);
      }
    } catch (error) {
      setForgotError(true);
      setLastNotFound(false);
      setNoEmail(false);
    }
  };

  const checkCookie = async () => {
    try {
      const token = Cookies.get("token");
      const res = await fetch("http://localhost:4000/users", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();
      setEml(data.email);
    } catch (error) {
      setEmailErr(true);
      return;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="flex justify-between items-center px-6 py-3 bg-white shadow-sm border-b border-gray-100">
        <span className="text-2xl font-extrabold tracking-tight text-gray-900">
          To:collab.
        </span>
        <ul className="flex items-center gap-4 relative">
          <li className="text-lg text-gray-500 hover:text-gray-900 transition-colors duration-200 cursor-pointer flex items-center justify-center p-2 rounded-full">
            <i className="  text-black border border-gray-300 transition duration-100 hover:cursor-pointer w-12 h-12 hover:bg-gray-100 rounded-3xl flex items-center justify-center fa-regular fa-user text-xl"></i>
          </li>
          <Link
            className={`flex gap-2 items-center border border-gray-200 px-3 py-1 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200 ${
              !started ? "pointer-events-none opacity-60" : ""
            }`}
            to={"/HomePage"}
          >
            Home
          </Link>
          <span className="flex items-center relative">
            <i
              className="fa-regular fa-circle-question text-xl text-gray-400 hover:text-gray-700 cursor-pointer transition-colors duration-200"
              onMouseEnter={() => setInfo(true)}
              onMouseLeave={() => setInfo(false)}
            ></i>
            <span
              className={`absolute right-0 top-8 bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-2 text-xs text-gray-700 z-20 transition-opacity duration-200 ${
                info ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{ minWidth: "180px" }}
            >
              You must be logged in to get on Home page
            </span>
          </span>
        </ul>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 px-2">
        <div className="max-w-md w-full mx-auto px-4 py-12">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              Welcome to To:collab.
            </h2>
            <p className="text-gray-600 text-sm">
              Edit documents live with other users. Please log in or create an
              account to get started.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-4 text-sm font-semibold transition-all duration-300 ${
                  activeTab === "login"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`flex-1 py-4 text-sm font-semibold transition-all duration-300 ${
                  activeTab === "register"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Create Account
              </button>
            </div>

            <div
              className={`relative ${
                activeTab === "register" ? "min-h-[600px]" : "min-h-[430px]"
              }`}
            >
              <div className={`${showForgot && "min-h-[620px]"}`}></div>

              {/* This is "LOGIN" section  ----------------------------------------------------------------*/}

              <div
                className={`absolute top-0 left-0 w-full transition-transform duration-300 ${
                  activeTab === "login" ? "translate-x-0" : "-translate-x-full"
                } z-10`}
              >
                {!showForgot ? (
                  <form
                    onSubmit={(e) => {
                      validate({ email: loginU, password: loginP });
                      e.preventDefault();
                    }}
                    className={`space-y-5 p-6 sm:p-8 ${
                      loginShake ? "animate-shake" : ""
                    }`}
                    style={{
                      animationDuration: "0.4s",
                      animationTimingFunction: "ease-in-out",
                    }}
                  >
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Email
                      </label>
                      <input
                        onChange={(e) => setLoginU(e.target.value)}
                        required
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Password
                      </label>
                      <input
                        onChange={(e) => setLoginP(e.target.value)}
                        required
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 text-sm"
                        autoComplete="off"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-gray-900 rounded"
                        />
                        <span className="text-gray-600">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleShowForgot}
                        className="text-gray-900 font-semibold hover:underline bg-transparent border-none p-0 m-0"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Sign In
                    </button>
                  </form>
                ) : (
                  <form onSubmit={reset} className="space-y-5 p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Reset Password
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Email
                      </label>
                      <input
                        required
                        onChange={(e) => setForgotEmail(e.target.value)}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Last Name
                      </label>
                      <input
                        required
                        onChange={(e) => setForgotLast(e.target.value)}
                        type="text"
                        placeholder="Your Last Name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        New Password
                      </label>
                      <input
                        required
                        onChange={(e) => setNewPass(e.target.value)}
                        type="password"
                        placeholder="New Password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 text-sm"
                        autoComplete="new-password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Confirm New Password
                      </label>
                      <input
                        required
                        onChange={(e) => setConfNewPass(e.target.value)}
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 text-sm"
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleBackFromForgot}
                        className="w-1/2 bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 shadow hover:shadow"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Reset Password
                      </button>
                    </div>
                    <div className="flex items-center justify-center w-full min-h-[40px]">
                      {passChanged ? (
                        <span className="flex items-center gap-2 text-green-600 font-medium text-sm mt-2">
                          <i className="fa-solid fa-circle-check text-green-500"></i>{" "}
                          Password was successfully changed!
                        </span>
                      ) : forgot_pass_mismatch ? (
                        <span className="flex items-center gap-2 text-red-500 font-medium text-sm mt-2">
                          <i className="fa-solid fa-circle-exclamation text-red-400"></i>{" "}
                          Passwords do not match!
                        </span>
                      ) : forgotError ? (
                        <span className="flex items-center gap-2 text-red-500 font-medium text-sm mt-2">
                          <i className="fa-solid fa-circle-exclamation text-red-400"></i>{" "}
                          Reset failed. Please try again.
                        </span>
                      ) : lastNotFound ? (
                        <span className="flex items-center gap-2 text-red-500 font-medium text-sm mt-2">
                          <i className="fa-solid fa-circle-exclamation text-red-400"></i>{" "}
                          Last name not found in our database
                        </span>
                      ) : noEmail ? (
                        <span className="flex items-center gap-2 text-red-500 font-medium text-sm mt-2">
                          <i className="fa-solid fa-circle-exclamation text-red-400"></i>{" "}
                          Email not in our database
                        </span>
                      ) : null}
                    </div>
                  </form>
                )}

                <div
                  className={`flex items-center justify-center flex-col gap-2`}
                >
                  {!showForgot &&
                    started &&
                    (correct ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium text-sm mt-2">
                        <i className="fa-solid fa-circle-check text-green-500"></i>{" "}
                        Successful Login.
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-500 font-medium text-sm mt-2">
                        <i className="fa-solid fa-circle-exclamation text-red-400"></i>{" "}
                        Invalid Credentials
                      </span>
                    ))}
                  {!showForgot && none && (
                    <span className="flex items-center gap-2 text-red-500 font-medium text-sm mt-2">
                      <i className="fa-solid fa-circle-exclamation text-red-400"></i>{" "}
                      Please Register.
                    </span>
                  )}
                  {!showForgot && (
                    <span
                      className={`${
                        spin ? "block" : "hidden"
                      } animate-spin border-2 border-t border-t-blue-500 rounded-3xl w-8 h-8`}
                    ></span>
                  )}
                </div>
              </div>

              {/* This is "Register" section */}
              <div
                className={`absolute top-0 left-0 w-full transition-transform duration-300 ${
                  activeTab === "register"
                    ? "translate-x-0"
                    : "translate-x-full"
                } z-10`}
              >
                <form
                  onSubmit={validateRegister}
                  className={`space-y-5 p-6 sm:p-8 ${
                    shake ? "animate-shake" : ""
                  }`}
                  style={{
                    animationDuration: "0.4s",
                    animationTimingFunction: "ease-in-out",
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        First Name
                      </label>
                      <input
                        onChange={(e) => setRegFirst(e.target.value)}
                        required
                        type="text"
                        placeholder="First Name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Last Name
                      </label>
                      <input
                        onChange={(e) => setRegLast(e.target.value)}
                        required
                        type="text"
                        placeholder="Last Name"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <input
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      Confirm Password
                    </label>
                    <input
                      onChange={(e) => setRegConfirm(e.target.value)}
                      required
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-300 text-sm"
                    />
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer text-sm">
                    <input
                      required
                      type="checkbox"
                      className="w-4 h-4 accent-gray-900 rounded mt-0.5"
                    />
                    <span className="text-gray-600">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-gray-900 font-semibold hover:underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-gray-900 font-semibold hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Create Account
                  </button>
                  {wrongPas ? (
                    <span className="flex items-center gap-2 text-red-500 font-medium text-sm mt-2">
                      <i className="fa-solid fa-circle-exclamation text-red-400"></i>{" "}
                      Passwords do not match!
                    </span>
                  ) : alreadyEmail ? (
                    <span className="flex items-center gap-2 text-red-500 font-medium text-sm mt-2">
                      <i className="fa-solid fa-circle-exclamation text-red-400"></i>{" "}
                      Email already exists
                    </span>
                  ) : regCorrect ? (
                    <span className="flex items-center gap-2 text-green-600 font-medium text-sm mt-2">
                      <i className="fa-solid fa-circle-check text-green-500"></i>{" "}
                      Account was created successfully
                    </span>
                  ) : null}
                  <div className="flex items-center justify-center w-full">
                    <span
                      className={`${
                        regSpin ? "block" : "hidden"
                      } animate-spin border-2 border-t border-t-blue-500 rounded-3xl w-8 h-8`}
                    ></span>
                  </div>
                </form>
              </div>
              {/* Divider and Social Login (always visible below forms) */}
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full py-4 bg-white border-t border-gray-100 text-center text-xs text-gray-500 font-medium tracking-wide shadow-sm">
        © {new Date().getFullYear()} To:collab. All rights reserved.
      </footer>
    </div>
  );
}

export default LoginPage;
