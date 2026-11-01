# SS.me

The personal portfolio of Sudharshan S: a small, fast site for coding projects,
learning, and thoughtful digital products.

## Stack

- Next.js 16 and React 19
- TypeScript and Tailwind CSS
- PostgreSQL with Drizzle ORM
- Better Auth for accounts and account recovery
- Vercel Blob for private profile images
- GitHub API for the public project index
- Resend for password reset, email verification, and contact email
- Bun for package management and scripts

## Local development

1. Copy the environment template:

   ```sh
   cp .env.example .env.local
   ```

2. Set `POSTGRES_URL` and `BETTER_AUTH_SECRET`. Add the Resend and Blob
   variables when testing email or profile-image features.
3. Install dependencies:

   ```sh
   bun install
   ```

4. Generate and apply database migrations:

   ```sh
   bun run db:generate
   bun run db:migrate
   bun run db:seed:projects
   ```

5. Start the development server:

   ```sh
   bun run dev
   ```

The homepage and Projects page read public, non-fork GitHub repositories from
`github.com/sudharshans2009` with one-hour revalidation. If GitHub is
unavailable, the site renders an intentional empty state.

The project seed imports the curated project list into PostgreSQL. Homepage
cards are shown only for projects marked as featured in the admin workspace;
unfeatured projects remain available on `/projects`.

## Site features

- Responsive portfolio, About, Projects, and Contact pages
- Mobile navigation optimized for phone screens
- Email/password sign-up and sign-in
- Password reset through Resend
- Verified email changes through Resend
- Profile name and private profile-image updates
- Authenticated contact form backed by PostgreSQL
- Contact confirmation and owner notification emails
- Protected `/admin` workspace for users, messages, and project content
- Basic in-process rate limiting and contact honeypot protection
- Security response headers through the Next.js proxy

The contact form requires an account. Contact messages are stored in the
PostgreSQL `message` table and are not exposed through a public read endpoint.
The permanent owner account is `sudharshans2009@gmail.com`; it can promote or
demote other accounts, manage message deletion, and control project visibility
and home-page highlights. The owner cannot be demoted.

## Production release

Configure these variables in the production deployment:

```env
NEXT_PUBLIC_SITE_URL=https://sudharshans.me
BETTER_AUTH_URL=https://sudharshans.me
POSTGRES_URL=
BETTER_AUTH_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_OWNER_EMAIL=
BLOB_READ_WRITE_TOKEN=
```

Use a managed PostgreSQL provider and apply the committed Drizzle migrations
to the production database before serving traffic:

```sh
bun run db:migrate
```

The configured Resend sender must be verified for production email delivery.
Rotate any credentials that have ever been exposed outside the deployment
secret store.

The current rate limiter is process-local. For a multi-instance deployment,
replace it with a shared edge-compatible store such as Redis.

## Validation

Run the complete release checks:

```sh
bun run lint
bunx tsc --noEmit
bun test
bun run build
bun run start
```

The canonical production URL is `https://sudharshans.me`.
