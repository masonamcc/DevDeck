# dev-deck

A developer portfolio template built with React + Vite. Drop in your GitHub username and a few config values and you get a live portfolio that pulls your repos directly from the GitHub API — complete with per-repo detail pages, language breakdowns, README rendering, and an X/Twitter feed on each repo detail page.

## Features

- **GitHub integration** — fetches all your public (and private, with a token) repos automatically
- **Repo detail pages** — click any repo card to see its README, language breakdown, and a link to GitHub
- **Language bar** — proportional color bar using each language's official GitHub color
- **Skills ticker** — scrolling marquee of your tech stack
- **Sections** — repos are automatically grouped into Applications, Projects, Other Repositories, and Templates based on topics and config
- **X/Twitter feed** — each repo detail page shows your tweets tagged with the repo's hashtag (e.g. `dev-deck` → `#devdeck`)
- **Responsive** — mobile and desktop layouts

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/masonamcc/dev-deck.git
cd dev-deck
npm install
```

### 2. Configure your profile

Edit `src/config.js`:

```js
export const config = {
    firstName: 'Your',
    lastName:  'Name',
    title:     'Full-Stack Software Engineer',
    location:  'City, State',
    bio:       'A short bio...',
    githubUsername: 'your-github-username',
    xUsername: 'your-x-username',
    xHashtag:  'yourhashtag',
    xPosts:    [],           // optional static posts (see X feed section below)
    skills: ['JavaScript', 'React', 'Node.js'],
    projects: [
        {
            projectName: 'my-project',       // must match repo name (partial match)
            projectDescription: 'What it does',
            status: 'In Progress'
        }
    ]
}
```

### 3. Add tokens

Create a `.env` file in the project root:

```
GITHUB_TOKEN=your_github_personal_access_token
TWITTER_BEARER_TOKEN=your_x_bearer_token
```

- `GITHUB_TOKEN` — unlocks private repos and raises the API rate limit. Generate at **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**. Needs `repo` scope for private repos, or no scopes for public-only.
- `TWITTER_BEARER_TOKEN` — required for the X feed on repo detail pages. Needs X API **Basic** tier ($100/month) for live fetching. Generate at **developer.twitter.com → Your app → Keys and tokens → Bearer Token**.

Neither token is exposed to the browser — both are injected server-side via the Vite proxy locally and Vercel serverless functions in production.

### 4. Run

```bash
npm run dev
```

## Deploying to Vercel

### Environment variables

Add both tokens in **Vercel → Project → Settings → Environment Variables**:

```
GITHUB_TOKEN=your_github_personal_access_token
TWITTER_BEARER_TOKEN=your_x_bearer_token
```

Do **not** use the `VITE_` prefix — these are server-side only and must stay out of the client bundle.

### How the API proxy works

GitHub and X API calls go through serverless functions in the `api/` directory rather than directly from the browser. This keeps tokens off the client entirely.

- **Locally** (`npm run dev`): Vite's dev server proxies `/api/github/*` → `https://api.github.com` and `/api/x/*` → `https://api.x.com`, injecting the tokens from `.env` at the proxy layer.
- **Production** (Vercel): `api/github/[...path].js` and `api/x/[...path].js` are deployed as serverless functions and receive the tokens from Vercel's environment variables.

### `vercel.json` routing

The `vercel.json` requires explicit routes to connect incoming requests to the catch-all Lambda functions. Without them, Vercel's SPA fallback catches everything and serves `index.html` instead of invoking the functions:

```json
{
  "routes": [
    { "src": "/api/github/(.*)", "dest": "/api/github/[...path]?path=$1" },
    { "src": "/api/x/(.*)",      "dest": "/api/x/[...path]?path=$1"      },
    { "handle": "filesystem" },
    { "src": "/(.*)",            "dest": "/index.html"                    }
  ]
}
```

The `dest` must reference the Lambda file path directly (`/api/github/[...path]`) and pass the captured segment as `?path=$1`. Using a generic `dest: "/api/$1"` does not resolve to the catch-all Lambda — it has to be explicit.

## X feed

Each repo detail page shows tweets you've posted tagged with the sanitized repo name (hyphens removed, lowercased). For example, the `dev-deck` repo shows tweets tagged `#devdeck`.

The feed fetches your last 100 posts via the user timeline endpoint and filters client-side. This requires X API **Basic** tier. If you're on the free tier, use the static `xPosts` array in `config.js` instead:

```js
xPosts: [
    {
        id: '1234567890',
        text: 'Shipped something new on #devdeck today...',
        created_at: '2026-04-20T14:00:00Z',
        public_metrics: { like_count: 5, retweet_count: 1 },
        author: {
            name: 'Your Name',
            username: 'yourusername',
            profile_image_url: '',
        }
    }
]
```

The home page feed section only renders when `xPosts` has entries.

## Repo sections

| Section | How repos are selected |
|---|---|
| Applications | Repo has a topic containing `app` |
| Projects | Repo name matches a `projectName` in `config.projects` |
| Template Repos | Repo is marked as a template on GitHub |
| Other Repositories | Everything else |

## Tech stack

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [GitHub REST API](https://docs.github.com/en/rest)
- [X API v2](https://developer.twitter.com/en/docs/twitter-api)

## Build

```bash
npm run build
```

Output goes to `dist/`.
