import { useState, useEffect } from 'react';

export function useXFeed(hashtag, username) {
    const [tweets, setTweets] = useState([]);
    const [users, setUsers] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!hashtag || !username) return;

        setLoading(true);
        setError(null);

        fetch(`/api/x/2/users/by/username/${username}`)
            .then(res => {
                if (!res.ok) throw new Error(`X API error: ${res.status}`);
                return res.json();
            })
            .then(({ data: user }) => {
                const params = new URLSearchParams({
                    'tweet.fields': 'created_at,public_metrics',
                    expansions: 'author_id',
                    'user.fields': 'name,username,profile_image_url',
                    max_results: '100',
                });
                return fetch(`/api/x/2/users/${user.id}/tweets?${params}`)
                    .then(res => {
                        if (!res.ok) throw new Error(`X API error: ${res.status}`);
                        return res.json();
                    })
                    .then(data => ({ data, user }));
            })
            .then(({ data, user }) => {
                const tag = hashtag.toLowerCase();
                const filtered = (data.data ?? []).filter(t =>
                    t.text.toLowerCase().includes(`#${tag}`)
                );
                setTweets(filtered);
                const userMap = new Map(
                    (data.includes?.users ?? []).map(u => [u.id, u])
                );
                if (!userMap.has(user.id)) userMap.set(user.id, user);
                setUsers(userMap);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [hashtag, username]);

    return { tweets, users, loading, error };
}
