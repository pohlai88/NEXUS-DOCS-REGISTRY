# Publish Instructions

## ✅ Package Ready

- **Version:** 0.1.1 (bumped from 0.1.0)
- **Package Size:** 49.6 kB ✅
- **Build:** ✅ Passing
- **Status:** Ready to publish

## 🚀 Steps to Publish

### Step 1: Login to npm
```bash
npm login
```

You'll be prompted for:
- Username
- Password
- Email
- OTP (if 2FA enabled)

### Step 2: Verify Login
```bash
npm whoami
```

Should show your npm username (e.g., `aibos88`)

### Step 3: Verify Package
```bash
npm pack --dry-run
```

Should show package contents without errors.

### Step 4: Publish
```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages (`@aibos/...`).

## 📦 What Will Be Published

- ✅ `dist/` - Compiled TypeScript code
- ✅ `docs/` - Documentation examples
- ✅ `README.md` - Package documentation
- ✅ `LICENSE` - MIT license
- ✅ Version: 0.1.1

## ⚠️ Troubleshooting

### If you get "Access token expired"
```bash
npm logout
npm login
```

### If you get "Not authorized"
- Make sure you're logged into the correct npm account
- Verify you have access to the `@aibos` scope
- Check: `npm whoami`

### If you get "Package already exists"
- The version 0.1.1 should be new, so this shouldn't happen
- If it does, bump version: `npm version patch --no-git-tag-version`

## ✅ After Publishing

1. Verify on npm: https://www.npmjs.com/package/@aibos/docs-registry
2. Test installation: `npm install @aibos/docs-registry@0.1.1`
3. Update git (if desired):
   ```bash
   git add package.json package-lock.json
   git commit -m "Bump version to 0.1.1"
   git tag v0.1.1
   git push origin main --tags
   ```

