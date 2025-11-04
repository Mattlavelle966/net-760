//fisrt serv

import express from "express";
import { spawn } from  "child_process";


const app = express();

const PORT = 5000;

app.use(express.json());

app.post("/api/prompt", (req,res) => {
	const userPrompt = req.body?.prompt;
	if (!userPrompt){
		return res.status(400).json({ error: "Missing 'prompt' field." });
	}
	
	// define the command strings
	//
	const modelPath = "/llama.cpp/models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf";
	const args = [
		"-m",modelPath,
		"-ngl","0",
		"-n","256",
		"-p", `<|user|>\n${userPrompt}\n<|assistant|>\n`
	];
	const llama = spawn("/llama.cpp/build/bin/llama-simple", args, {
		stdio: ["ignore", "pipe", "pipe"],
	});

	let output = "";

	llama.stdout.on("data", (chunk) => {
		output += chunk.toString();	
	});
	llama.stderr.on("data", (chunk) => {
		//recived stderror 
		console.error(`[llama.stderr] ${chunk}`);
	});
	//if process exits send captured output 
	llama.on("close", (code) => {
		console.log(`llama.cpp exited with code ${code}`);
		console.log(output);
		return res.json({ prompt: userPrompt,output: output.trim(),code });
	});

});


app.listen(PORT, "0.0.0.0", () => {
	console.log(`LLM REST API listening on port ${PORT}`);
});


