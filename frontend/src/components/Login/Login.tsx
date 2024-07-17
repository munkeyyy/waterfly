import React, { useContext, useEffect, useRef, useState } from "react";
import { Formik, FormikErrors } from "formik";
import axios from "axios";
import { notification } from "antd";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../Contexts/LoginContext/LoginContext";
import { UserContext } from "../../Contexts/User/UserContext";

interface SetIsChanged{
    setIsChanged:React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {

  password:string;
  email: string;


}
const Login:React.FC<SetIsChanged> = ({setIsChanged}) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const loginContext = useContext(LoginContext);

  if (!userContext || !loginContext) {
      throw new Error('SomeComponent must be used within UserProvider and LoginProvider');
  }

  const { user, setUser } = userContext;
  const { isLoggedIn, setIsLoggedIn } = loginContext;
  // useEffect(()=>{

  //   const token =localStorage.getItem("token")
  //   if(!token){
  //     notification.error({message:"Please Login First"})
  //   }
  // },[])
  
  return (
    <div className="bg-transparent border-stroke dark:border-strokedark xl:border-l-2 w-full h-full relative z-[10]">
      <div className="flex px-10 items-center justify-center flex-col">
        <h1 className="text-[#45475B] mt-4 font-semibold text-[2vw]">Welcome To Waterfly</h1>
        <div>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values:FormValues) => {
              const errors: FormikErrors<FormValues> = {};
              if (!values.email) {
                errors.email = "Email is Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }

              if (!values.password) {
                errors.password = "Password is required";
              } else if (values.password.length < 8) {
                errors.password = "Password must be more than 8 cahracters";
              }
              return errors;
            }}
            onSubmit={(values:FormValues) => {
              //   setTimeout(() => {
              //     alert(JSON.stringify(values, null, 2));
              //     setSubmitting(false);
              //   }, 400);
              axios
                .post(`http://localhost:8000/users/sign-in`, {
                  email: values.email,
                  password: values.password,
                })
                .then((res) => {
                  // console.log(res.data);
                  setUser(res.data.data);
                  setIsLoggedIn(true);
                  notification.success({ message: res.data.message });
                  localStorage.setItem("token", res.data.token);
                  localStorage.setItem("user", JSON.stringify(res.data.data));

                  const logout = () => {
                    localStorage.clear();
                    setIsLoggedIn(false);
                    navigate("/");
                    notification.error({
                      message: "Please Log in, session expired.",
                    });
                  };
                  navigate("/");
                  setTimeout(logout, 3600000);
                })
                .catch((err) => {
                  // console.log(err.response);
                  notification.error({ message: err.response.data.message });
                });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form
                className="flex flex-col gap-4 mt-12"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col gap-1 w-[20vw] items-center">
                  <label className="self-start text-[#2e2e2e]" htmlFor="email">
                    Your Email*
                  </label>
                  <input
                    autoComplete="off"
                    type="email"
                    id="email"
                    className="bg-transparent mt-2  border-b w-full border-[#7B7E8C] transition-all active:outline-none visited::outline-none focus:border-b-2 focus:outline-none focus-visible:border-b-2 focus-visible:border-[#02B386] focus-visible:outline-none text-black"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <span className="text-red-600">
                    {errors.email && touched.email && errors.email}
                  </span>
                </div>
                <div className="flex flex-col gap-1 w-[20vw] relative items-center">
                  <label className="self-start text-[#2e2e2e]" htmlFor="password">
                    Enter Password*
                  </label>
                  <input
                    // ref={passwordRef}
                    type={isClicked?"text":"password"}
                    id="password"
                    name="password"
                    className="bg-transparent mt-2 border-b w-full border-[#7B7E8C] transition-all focus-visible:border-b-2 focus-visible:border-[#02B386] focus-visible:outline-none text-black"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <span className="text-red-600">
                    {errors.password && touched.password && errors.password}
                  </span>
                  <button
                    // onClick={() => {
                    //   setIsClicked(!isClicked);
                    //   passwordRef.current.type = `${
                    //     isClicked ? "text" : "password"
                    //   }`;
                    // }}
                    onClick={()=>setIsClicked(!isClicked)}
                    type="button"
                    className="text-lg text-gray-500 absolute top-[40%] right-0 "
                  >
                    {isClicked ? <IoMdEyeOff /> : <IoEye />}
                  </button>
                </div>
                <button
                  className="py-2 font-semibold px-4 w-full cursor-pointer text-white rounded-md mt-4 bg-[#02B386]"
                  type="submit"
                  // disabled={isSubmitting}
                >
                  Submit
                </button>
              </form>
            )}
          </Formik>
        </div>
        {/* <div  className="flex p-4 mt-6 items-center gap-2 text-[#2e2e2e] hover:text-gray-600">
          Don't have an account?{" "}
          <div onClick={()=>{
            setIsChanged(false)
            // console.log("preet i love you")
          }} className="font-semibold cursor-pointer text-black relative">
            Register
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
