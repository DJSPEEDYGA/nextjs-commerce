# 🔧 Fix Git Corruption & Deploy GOAT Royalty App

## The Problem

Your Git clone encountered a corruption error during the download. This is a common issue with large repositories on Windows.

## ✅ Quick Fix Solution

Run these commands in your Git Bash terminal:

```bash
# Step 1: Remove the corrupted directory
cd /d
rm -rf GOAT_ROYALTY_APP

# Step 2: Clear Git cache
git gc --prune=now
git repack -a -d --depth=250 --window=250

# Step 3: Clone with increased buffer size
git clone --depth 1 https://github.com/DJSPEEDYGA/nextjs-commerce.git GOAT_ROYALTY_APP

# Step 4: Navigate to the web-app directory
cd GOAT_ROYALTY_APP/web-app

# Step 5: Start the web server
python -m http.server 8080
```

## 📋 Complete Setup Commands

```bash
# 1. Remove corrupted folder (if exists)
cd /d
rm -rf GOAT_ROYALTY_APP

# 2. Clone repository successfully
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git GOAT_ROYALTY_APP

# 3. Navigate to web-app folder
cd GOAT_ROYALTY_APP/web-app

# 4. Start web server on port 8080
python -m http.server 8080

# 5. Open your browser to:
# http://localhost:8080
```

## 🎯 Quick Start (No Problems Expected)

If the above doesn't work, try this simpler approach:

```bash
# Just navigate to where you want it
cd /d

# Clone directly
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git

# This will create a folder called "nextjs-commerce"
cd nextjs-commerce/web-app

# Start server
python -m http.server 8080
```

## 🔍 Verify Your Setup

After cloning, check that you have all the files:

```bash
# Check if web-app folder exists
cd nextjs-commerce/web-app
ls -la

# You should see:
# - goat-agent-crew.html
# - goat-royalty-enhanced.html
# - goat-royalty-idp.html
# - goat-royalty-nlp.html
# - goat-royalty-analytics.html
# - goat-royalty-agents.html
# - js/ folder
# - css/ folder
```

## 🚀 Access Your Agent Crew

Once the server is running:

1. **Main Dashboard**: http://localhost:8080
2. **Agent Crew**: http://localhost:8080/goat-agent-crew.html
3. **Enhanced Platform**: http://localhost:8080/goat-royalty-enhanced.html

## 🤖 Start the Agent Backend (Optional - for Real AI)

If you want real AI responses from your Python agents:

```bash
# Navigate to the repository root
cd nextjs-commerce

# Start the Python agent backend
python ../goat_intel.py

# Or use the startup script (if on Linux/Mac)
./scripts/start-agent-backend.sh

# Or use the batch file (if on Windows)
scripts\windows\start-agent-backend.bat
```

## 📝 Alternative: Use a Different Directory

If D: drive is problematic, try a different location:

```bash
# Try C: drive
cd /c/Users/YOUR_USERNAME/Desktop
git clone https://github.com/DJSPEEDYGA/nextjs-commerce.git
cd nextjs-commerce/web-app
python -m http.server 8080
```

## 🔐 Secret Codes are Already Included

The `.env.agent-secrets` file is now in the repository with default codes:

- **Money Penny**: `MP-007-GOAT-AGENT`
- **GOAT Brain**: `GB-BRAIN-111`
- **GOAT Intel**: `GI-INTEL-007`
- **Legal Agent**: `LA-LAW-999`
- **Finance Agent**: `FA-CASH-777`

You can change these in the `.env.agent-secrets` file if needed.

## 🐛 If You Still Have Problems

### Problem: Permission Denied
```bash
# Run as Administrator or try a different folder
cd /tmp
git clone ...
```

### Problem: Network Timeout
```bash
# Clone with depth to reduce size
git clone --depth 1 https://github.com/DJSPEEDYGA/nextjs-commerce.git
```

### Problem: Corrupted Git Objects
```bash
# Remove .git folder and re-clone
cd GOAT_ROYALTY_APP
rm -rf .git
cd ..
rm -rf GOAT_ROYALTY_APP
git clone ...
```

## ✅ Success Checklist

After running the commands, verify:

- [ ] Repository cloned successfully
- [ ] `web-app` folder exists
- [ ] `goat-agent-crew.html` exists
- [ ] Web server starts without errors
- [ ] Can access http://localhost:8080 in browser
- [ ] Agent Crew page loads

## 🎉 You're Ready!

Once everything is working:

1. Open http://localhost:8080
2. Click on "👥 Agent Crew"
3. Start chatting with Money Penny and your AI agents!

---

**Need Help?** The Git corruption error is common and easy to fix. Just delete the corrupted folder and clone again with the `--depth 1` flag for a faster, more reliable clone.