# Uninstall / Unregister Self-Hosted GitHub Actions Runner

There are two scenarios covered here:
- **Clean uninstall** — VM still running, you want to gracefully remove the runner
- **Force removal** — VM is gone or token is expired, remove from GitHub UI

---

## Scenario A: Clean Uninstall (VM is still running)

Run all commands on your Azure VM as the user who installed the runner (e.g. `github-runner`).

### Step 1 — Stop and uninstall the systemd service

```bash
cd ~/actions-runner

# Stop the running service
sudo ./svc.sh stop

# Uninstall the service (removes systemd unit file)
sudo ./svc.sh uninstall
```

Verify the service is gone:
```bash
systemctl list-units | grep actions.runner
# Should return nothing
```

---

### Step 2 — Get a removal token from GitHub

> Removal tokens expire after 1 hour, so generate one right before you need it.

**Via GitHub UI:**
1. Go to your repo → **Settings → Actions → Runners**
2. Click the runner name
3. Click **"Remove runner"**
4. GitHub shows you a removal token — copy it

**Via GitHub API (scriptable):**
```bash
curl -X POST \
  -H "Authorization: Bearer <YOUR_GITHUB_PAT>" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/<OWNER>/<REPO>/actions/runners/remove-token
```
Response:
```json
{ "token": "AXXXXXXXXXX", "expires_at": "2024-01-01T00:00:00Z" }
```

---

### Step 3 — Unregister the runner from GitHub

```bash
cd ~/actions-runner

./config.sh remove --token <REMOVAL_TOKEN_FROM_STEP_2>
```

Expected output:
```
√ Runner removed successfully
√ Removed .credentials
√ Removed .runner
```

---

### Step 4 — Clean up files (optional)

```bash
# Remove the runner directory
cd ~
rm -rf actions-runner/

# Remove the dedicated user (if no longer needed)
sudo userdel -r github-runner
```

---

## Scenario B: Force Remove (VM is gone / token expired)

If the VM no longer exists or you can't run the removal command, remove it directly from GitHub.

### Via GitHub UI:
1. Go to repo → **Settings → Actions → Runners**
2. Find the offline runner
3. Click the runner → Click **"Remove runner"**
4. Confirm — GitHub force-removes it

### Via GitHub API:
```bash
# First, find the runner ID
curl -H "Authorization: Bearer <YOUR_PAT>" \
  https://api.github.com/repos/<OWNER>/<REPO>/actions/runners

# Then delete by ID
curl -X DELETE \
  -H "Authorization: Bearer <YOUR_PAT>" \
  https://api.github.com/repos/<OWNER>/<REPO>/actions/runners/<RUNNER_ID>
```

---

## Quick Reference Summary

| Situation | Command / Action |
|---|---|
| Stop the service | `sudo ./svc.sh stop` |
| Uninstall the service | `sudo ./svc.sh uninstall` |
| Unregister from GitHub | `./config.sh remove --token <TOKEN>` |
| Force remove (UI) | GitHub → Settings → Runners → Remove |
| Force remove (API) | `DELETE /repos/:owner/:repo/actions/runners/:id` |

---

## What Each Step Actually Does

| Step | What it removes |
|---|---|
| `svc.sh stop` | Stops the process, runner goes offline in GitHub UI |
| `svc.sh uninstall` | Removes the systemd service unit file |
| `config.sh remove` | Deletes runner registration from GitHub (removes from UI) |
| `rm -rf actions-runner/` | Removes all runner files from the VM |
| `userdel github-runner` | Removes the dedicated OS user |

> **Note:** If you only stop the service without unregistering, the runner will show as **Offline** in GitHub but still appear in the runners list. Always complete Step 3 for a clean removal.