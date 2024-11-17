import loginImg from "../assets/logo/Gemini_Generated_Image_cs38fdcs38fdcs38.jpg"
import Template from "../Componets/core/Template"

function Login() {
  return (
    <Template
      title="Welcome Back"
      description1="Your Garage, Your Control"
      description2="Optimize today, innovate tomorrow. Simplify car management for a better driving experience"
      image={loginImg}
      formType="login"
    />
  )
}

export default Login