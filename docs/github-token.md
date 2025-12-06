# GitHub Personal Access Token

## Token
```
[REDACTED - Store token in secure location, not in repository]
```

## Expiration
**Active for 30 days** from creation date.

## Usage
This token is used for pushing to the GitHub repository: `https://github.com/dudchenkoo/cropdot.git`

## Security Note
⚠️ **Important**: This token will expire in 30 days. Make sure to:
- Generate a new token before expiration
- Store the token securely (e.g., in password manager or environment variables)
- Never commit tokens to the repository
- Keep this file secure and never commit it to public repositories

## How to Use
When pushing to GitHub, you can temporarily set the remote URL with the token:
```bash
git remote set-url origin https://[TOKEN]@github.com/dudchenkoo/cropdot.git
git push
git remote set-url origin https://github.com/dudchenkoo/cropdot.git
```

Or use it directly in the push command:
```bash
git push https://[TOKEN]@github.com/dudchenkoo/cropdot.git main
```

