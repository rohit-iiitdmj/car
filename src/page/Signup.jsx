import signupImg from "../assets/logo/Gemini_Generated_Image_cs38fdcs38fdcs38.jpg"
import Template from "../Componets/core/Template"

function Signup() {
  return (
    <Template
      title="Streamline Your Vehicle Management for Free,"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Take control of your cars and future-proof your."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup