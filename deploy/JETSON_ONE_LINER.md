# 🐐 Jetson Deployment Options

## Your repository is PRIVATE, so raw URLs return 404.

### Option 1: Copy-Paste the Script Directly

I'll create the script content for you to copy-paste directly onto your Jetson.

### Option 2: Use SSH/SCP to Transfer

From your local machine:
```bash
scp -i ~/.ssh/your_key goat-app/jetson-complete-deploy.sh root@JETSON_IP:/root/
ssh root@JETSON_IP "chmod +x /root/jetson-complete-deploy.sh && /root/jetson-complete-deploy.sh"
```

### Option 3: Create a Public Gist

I can create a public gist with the script for easy download.

### Option 4: Make Repository Public

Go to: https://github.com/DJSPEEDYGA/nextjs-commerce/settings
Scroll to "Danger Zone" → Change visibility to Public

---

## Quick Fix - Download with GitHub Token

If you have a GitHub Personal Access Token:

```bash
# On your Jetson
TOKEN="your_github_personal_access_token"
curl -fsSL -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3.raw" \
  "https://api.github.com/repos/DJSPEEDYGA/nextjs-commerce/contents/jetson-complete-deploy.sh" \
  -o deploy.sh && chmod +x deploy.sh && sudo ./deploy.sh
```