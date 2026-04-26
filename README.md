# dev-deck

A developer portfolio template built with React + Vite. Drop in your GitHub username and a few config values and you get a live portfolio that pulls your repos directly from the GitHub API — complete with per-repo detail pages, language breakdowns, and README rendering.

## Features

- **GitHub integration** — fetches all your public (and private, with a token) repos automatically
- **Repo detail pages** — click any repo card to see its README, language breakdown, and a link to GitHub
- **Language bar** — proportional color bar using each language's official GitHub color
- **Skills ticker** — scrolling marquee of your tech stack
- **Sections** — repos are automatically grouped into Applications, Projects, Other Repositories, and Templates based on topics and config
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

### 3. (Optional) Add a GitHub token

Create a `.env` file in the project root to unlock private repos and raise the API rate limit:

```
VITE_GITHUB_TOKEN=your_personal_access_token
```

The token only needs `repo` scope for private repos, or no scopes at all for public-only access.

### 4. Run

```bash
npm run dev
```

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

## Build

```bash
npm run build
```

Output goes to `dist/`.
