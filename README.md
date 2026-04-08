# API Discovery Lab

A self-contained lab environment to test and observe Cloudflare's API Discovery feature (both Session Identifier-based and Machine Learning-based).

## Architecture

This project spins up 2 Docker containers:
1. `api`: A Node.js Express REST API with 14 endpoints and in-memory seed data.
2. `traffic-gen`: A script that runs in a loop, hitting the API endpoints periodically to generate the traffic volume required for Cloudflare to discover them (>500 requests over 10 days).

It relies on a host-level installation of `cloudflared` to proxy traffic from Cloudflare into the `api` container.

## Setup Instructions

### 1. Cloudflare Dashboard (Tunnel)
Assuming you already have a tunnel running on your VM:
1. Go to **Networking > Tunnels**.
2. Click on your active tunnel and hit **Configure**.
3. Under the **Public Hostname** tab, add a new routing rule:
   - Subdomain: `demo-api` (or your choice)
   - Domain: `yourdomain.com`
   - Service: `http://localhost:3001`

### 2. Cloudflare Dashboard (Session Identifier)
1. Go to **Security > API Shield > Settings**.
2. Under Session identifiers, configure:
   - Type: `HTTP Header`
   - Name: `Authorization`

### 3. Deploy the Lab
On your VM:

```bash
# Clone this repo
git clone <repo-url>
cd api-discovery-lab

# Start the stack
docker compose up -d --build
```

### 3. Verify
Check the logs to ensure the API is running, the tunnel connected, and traffic is being generated:

```bash
docker compose logs -f traffic-gen
```

You can also verify the tunnel is working by visiting `https://demo-api.yourdomain.com/api/v1/health`.

## What to expect
After approximately 10 days, navigate to **Security > API Shield > Discovery**. You should see endpoints like `/api/v1/users/{var1}` appearing, discovered via both Session Identifiers and Machine Learning.
