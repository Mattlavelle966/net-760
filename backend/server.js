// old: spawn llama.cpp each time
// new: proxy to llama-server
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/node2/api/prompt", async (req, res) => {
  try {
    const { prompt } = req.body;

    const llamaRes = await fetch("http://localhost:5000/completion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        n_predict: 512,
        temperature: 0.8,
        top_p: 0.95
      }),
    });

    // stream back directly
    res.setHeader("Content-Type", "application/json");
    llamaRes.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Backend error");
  }
});

app.listen(5000, () => console.log("Node proxy running on port 5000"));

