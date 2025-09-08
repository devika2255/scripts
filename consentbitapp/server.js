// server.js
import express from "express";
import axios from "axios";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// ----- MIDDLEWARES -----
app.use(cookieParser());
app.use(express.json()); // parse JSON POST bodies

// Allow requests from your Framer frontend
app.use(cors({
  origin: "https://smaller-list-869789.framer.app",
  credentials: true,
}));

// ----- PORT -----
const PORT = process.env.PORT || 3000;

// ----- ROUTES -----

// POST /auth/google - handle Google Sign-In credentials
app.post("/auth/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).send({ success: false, message: "No credential sent" });
  }

  try {
    // Verify the ID token with Google
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    const user = response.data;

    // Store user info in an HTTP-only cookie
    res.cookie("user", JSON.stringify(user), {
      httpOnly: true,
      secure: true, // true for HTTPS (Render supports HTTPS)
      sameSite: "none",
    });

    res.send({ success: true, user });
  } catch (err) {
    console.error("Token verification failed:", err.response?.data || err.message);
    res.status(500).send({ success: false, message: "Token verification failed" });
  }
});

// GET /profile - returns logged-in user info from cookie
app.get("/profile", (req, res) => {
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  if (user) {
    res.send({ loggedIn: true, user });
  } else {
    res.send({ loggedIn: false, user: null });
  }
});

// GET /logout - clear cookie
app.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.send({ success: true, message: "Logged out" });
});

// ----- START SERVER -----
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
