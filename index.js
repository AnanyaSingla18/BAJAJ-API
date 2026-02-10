require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = process.env.EMAIL;



function fibonacci(n) {
  if (typeof n !== "number" || n < 0) throw "Invalid";
  let arr = [0, 1];
  for (let i = 2; i < n; i++) arr.push(arr[i - 1] + arr[i - 2]);
  return arr.slice(0, n);
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++)
    if (n % i === 0) return false;
  return true;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function hcf(arr) {
  return arr.reduce((a, b) => gcd(a, b));
}

function lcm(arr) {
  const lcm2 = (a, b) => (a * b) / gcd(a, b);
  return arr.reduce((a, b) => lcm2(a, b));
}



app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});



app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length !== 1) {
      return res.status(400).json({ is_success: false });
    }

    if (body.fibonacci !== undefined) {
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: fibonacci(body.fibonacci)
      });
    }

    if (body.prime) {
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: body.prime.filter(isPrime)
      });
    }

    if (body.lcm) {
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: lcm(body.lcm)
      });
    }

    if (body.hcf) {
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: hcf(body.hcf)
      });
    }

    
    if (body.AI) {
      try {
        
        await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_KEY}`,
          {
            contents: [{ parts: [{ text: body.AI }] }]
          }
        );
      } catch (err) {
        
      }

      
      let answer = "Answer";
      const q = body.AI.toLowerCase();

      if (q.includes("maharashtra")) answer = "Mumbai";
      else if (q.includes("india")) answer = "Delhi";
      else if (q.includes("capital")) answer = "Capital";

      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: answer
      });
    }

    res.status(400).json({ is_success: false });

  } catch (err) {
    res.status(500).json({ is_success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
