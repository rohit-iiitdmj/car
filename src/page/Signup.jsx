import signupImg from "../assets/logo/Gemini_Generated_Image_cs38fdcs38fdcs38.jpg"
import Template from "../Componets/core/Template"

function Signup() {
  return (
    <Template
      title="Join the millions learning to code with StudyNotion for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup