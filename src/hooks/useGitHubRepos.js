import { useState, useEffect } from 'react';

export function useGitHubRepos(username) {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([])

    useEffect(() => {
        if (!username) return;

        const token = import.meta.env.VITE_GITHUB_TOKEN;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // With a token use /user/repos to include private repos, otherwise use public endpoint
        const url = token
            ? `https://api.github.com/user/repos?per_page=100&sort=pushed&affiliation=owner`
            : `https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`;

        setLoading(true);
        setError(null);

        fetch(url, { headers })
            .then(res => {
                if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
                return res.json();
            })
            .then(data => {
                // console.log('GitHub Repos:', data);
                setRepos(data.filter(r => !r.fork));
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [username]);

    return { repos, loading, error };
}
