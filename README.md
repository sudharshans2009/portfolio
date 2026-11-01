# SS.me

The personal site of Sudharshan S: a small, fast portfolio for thoughtful
digital products at the intersection of design and engineering.

## Stack

- Next.js 15 and React 19
- TypeScript and Tailwind CSS
- PostgreSQL with Drizzle ORM
- Better Auth for optional accounts
- GitHub API for the public project index
- Vercel for production hosting

## Local development

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies with `bun install`.
3. Generate and apply the database schema:

   ```sh
   bun run db:generate
   bun run db:migrate
   ```

4. Start the development server with `bun run dev`.

The home page reads public, non-fork repositories from
`github.com/sudharshans2009` hourly. If GitHub is unavailable, the page renders
an intentional empty state rather than failing the request.

## Production

Set `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, and `BETTER_AUTH_SECRET` in Vercel.
Use a managed PostgreSQL provider and run generated Drizzle migrations during
deployment. The canonical site URL is `https://sudharshans.me`; set that value
for production.

## Validation

```sh
bun run lint
bun run build
```

The contact experience is intentionally public: visitors can send a validated
message directly from `/contact` without an account. Messages are stored in the
PostgreSQL `message` table and are not exposed through a public read endpoint.
Better Auth is available for future authenticated features.
