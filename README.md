# 🧠 Net-760 Local AI Web Stack

**Author:** Matthew Lavelle  
**System:** Linux Mint 22.1 (Ubuntu Noble base)  
**GPUs:** GTX 760 (sm_30), GTX 750 Ti (sm_50)  
**Objective:** Deploy a fully-local LLM (TinyLlama 1.1B) accessible through a Node.js REST API, proxied by NGINX, and served via a lightweight HTML/CSS chat UI.



---



## Overview
I decided to create this repository because I’ve been working on a personal project for a while now, and I wanted to share some of the process I went through to build this stack. I was first inspired to make this system when I was reading Linux manuals and thought, “Wouldn’t it be great to have a dedicated mini LLM trained just on Linux manuals?” Thinking about this idea, I decided to challenge myself in new areas and broaden my horizons.

To start, I set up a series of Docker nodes, connected them through a virtual network, and configured them to commit their images so I could include them in my docker-compose.yml. I also mounted my repository to each container for easy development. I used Nginx as my proxy, and since I planned to host multiple nodes, I figured I’d refurbish my old personal homepage website. I also decided to create both a front-end and a back-end node for the LLM—bringing the total to four distributed nodes running on the server.



---


## 7. Project Structure

```
/net-760
├── .git
├── backend
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── nginx
│   └── nginx.conf
├── sites
│   ├── site1
│   │
│   └── site2
│       ├── css
│       └── test-llm.html
├── .gitignore
├── docker-compose.yml
└── sync-net-760.sh

```

---

## Summary

- **llama.cpp model** hosted inside a GPU-aware container utilizing CPU with GPU offloading of all 22 layers of the llm 
- **Express API** exposing `/api/prompt`  
- **NGINX reverse proxy** handling public routing  
- **Web UI** for interactive chat  

All components run locally, offline, and self-contained making **Net-760** a private, reproducible environment for experimenting with LLMs locally.

