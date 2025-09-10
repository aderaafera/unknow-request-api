# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Runtime Config

Configure environment variables in your `.env`:

```bash
# Server-only API base URL (used only on server)
API_BASE_URL=https://example.com/api

# Server-only token/secret for external API
API_TOKEN=replace_with_secure_token

# Public name for return URL query param (optional)
PUBLIC_RETURN_PARAM=redirect
```

Behavior:
- Visit `http://localhost:3000/?username=<name>&redirect=<return_url>`
- Server middleware (`server/middleware/username-redirect.ts`) reads `username`, calls `/api/username`, waits, then 302 redirects to `redirect` param, or `Referer`, or same URL without `username`.
