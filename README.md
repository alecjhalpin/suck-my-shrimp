# Suck My Shrimp

Launch website for the Suck My Shrimp fishing apparel brand.

## Stack

- Next.js App Router through vinext
- Cloudflare Workers
- Cloudflare D1 for launch-list emails
- Drizzle-managed database migrations

## First Cloudflare setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Sign in to Cloudflare:

   ```bash
   npx wrangler login
   ```

3. Create the launch-list database:

   ```bash
   npx wrangler d1 create suck-my-shrimp-launch-list
   ```

4. Copy the returned database ID into `wrangler.jsonc`, replacing
   `REPLACE_WITH_D1_DATABASE_ID`.

5. Apply the database migration:

   ```bash
   npm run db:migrate:remote
   ```

6. Deploy:

   ```bash
   npm run deploy
   ```

## Git-connected deployments

In Cloudflare, create a **Workers** application and import this GitHub repository.
Use `npm run deploy` as the deploy command. The included Wrangler configuration
contains the Worker, assets, and D1 binding.

## Local development

```bash
npm run db:migrate:local
npm run dev
```
