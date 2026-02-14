import { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, pin);
      } else {
        await createUserWithEmailAndPassword(auth, email, pin);
      }

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "100px" }}>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <br />

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Create account" : "Already have account?"}
      </button>
    </div>
  );
}

export default Login;
