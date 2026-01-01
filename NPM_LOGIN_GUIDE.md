# NPM Login Guide

## Current Status

Your npm authentication token is **expired or invalid**. You need to re-authenticate.

## Option 1: Interactive Login (Recommended)

Run this command in your terminal:

```bash
npm login
```

You'll be prompted for:
1. **Username** - Your npm username
2. **Password** - Your npm password  
3. **Email** - Your npm email
4. **OTP** - One-time password (if 2FA is enabled)

After successful login, verify with:
```bash
npm whoami
```

Then publish:
```bash
npm publish --access public
```

## Option 2: Use Access Token (Alternative)

If you have an npm access token:

1. **Get your token** from: https://www.npmjs.com/settings/[your-username]/tokens

2. **Set the token:**
   ```bash
   npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN_HERE
   ```

3. **Verify:**
   ```bash
   npm whoami
   ```

4. **Publish:**
   ```bash
   npm publish --access public
   ```

## Option 3: Use .npmrc File

Create/edit `.npmrc` in your home directory (`C:\Users\dlbja\.npmrc`):

```
//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE
```

## Troubleshooting

### "401 Unauthorized"
- Token expired → Run `npm login` again
- Wrong credentials → Check username/password
- 2FA required → Make sure you have OTP ready

### "404 Not Found" when publishing
- Check you have access to `@aibos` scope
- Verify package name is correct
- Make sure you're logged into the right account

### "Access denied"
- Verify you're a member of the `@aibos` organization
- Check organization permissions on npmjs.com

## Quick Command Reference

```bash
# Login
npm login

# Verify login
npm whoami

# Logout (if needed)
npm logout

# Publish
npm publish --access public

# Check current user
npm config get //registry.npmjs.org/:_authToken
```

