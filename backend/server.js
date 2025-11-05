//fisrt serv rest_api

import express from "express";
import { spawn } from  "child_process";


const app = express();

const PORT = 5000;
const sytemPrompt = `You are Net-760's native llm please assist the user.`
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
		"-ngl","22",
		"-n","512",
		"-sys", sytemPrompt,
		"-p", `<|user|>\n${userPrompt}\n<|assistant|>\n`
	];
	const llama = spawn("/llama.cpp/build/bin/llama-simple", args, {
		stdio: ["ignore", "pipe", "pipe"],
		env:{...process.env, CUDA_VISIBLE_DEVICES: "0"}
	});
	

	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive",
	});

       let output = "";

	llama.stdout.on("data", (chunk) => {	
		let text = chunk.toString();

		output += text;
		//sends tokens live rather then accumulating in output string
		const parts = text.split("<|assistant|>");
		if (parts.length > 1) {
			text = parts[1];
		}

		const cleanedText = text
			.replace(/<\|s\|>/g, '')
			.replace(/<\|user\|>/g,'')
			.replace(/<\|assistant\|>/g, '')
			.replace(/<s>/g, '')
			.replace(/<\/s>/g, '');
		res.write(cleanedText);

	});

	llama.stderr.on("data", (chunk) => {
		//recived stderror 
		console.error(`[llama.stderr] ${chunk}`);
	});
	//if process exits send captured output 
	llama.on("close", (code) => {
		console.log(`llama.cpp exited with code ${code}`);
		console.log(output);
		res.write(`\n[END]`)
		res.end();
	});
//	req.on("close", () => {
//		llama.kill("SIGTERM");
//		res.end();
//	});

});


app.listen(PORT, "0.0.0.0", () => {
	console.log(`LLM REST API listening on port ${PORT}`);
});


