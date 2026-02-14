import { useState } from "react";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, pin);

const user = userCredential.user;

await setDoc(doc(db, "users", user.uid), {
  email: user.email,
  displayName: user.email.split("@")[0]
});

      }

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #eef3f0, #f7faf8)"
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "45px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.08)"
        }}
      >
        <h2 style={{ marginBottom: "8px" }}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
  
        <p
          style={{
            fontSize: "14px",
            color: "#6b8e7e",
            marginBottom: "30px"
          }}
        >
          {isLogin
            ? "Login to continue to TaskFlow."
            : "Start organizing your productivity."}
        </p>
  
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #d8e0dc",
              fontSize: "14px",
              outline: "none"
            }}
          />
  
          <input
            type="password"
            placeholder="6(atleast)-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #d8e0dc",
              fontSize: "14px",
              outline: "none"
            }}
          />
  
          <button
            type="submit"
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#6b8e7e",
              color: "white",
              fontSize: "15px",
              fontWeight: 500,
              cursor: "pointer",
              marginTop: "10px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
              transition: "all 0.2s ease"
            }}
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>
  
        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
            fontSize: "14px"
          }}
        >
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{
              color: "#6b8e7e",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {isLogin ? "Create account" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
  
}

export default Login;
