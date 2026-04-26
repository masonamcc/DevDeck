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

        const params = new URLSearchParams({
            query: `#${hashtag} from:${username}`,
            'tweet.fields': 'created_at,public_metrics',
            expansions: 'author_id',
            'user.fields': 'name,username,profile_image_url',
            max_results: '10',
        });

        fetch(`/api/x/2/tweets/search/recent?${params}`)
            .then(res => {
                if (!res.ok) throw new Error(`X API error: ${res.status}`);
                return res.json();
            })
            .then(data => {
                setTweets(data.data ?? []);
                const userMap = new Map(
                    (data.includes?.users ?? []).map(u => [u.id, u])
                );
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
