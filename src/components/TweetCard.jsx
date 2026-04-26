function relativeTime(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

function highlightText(text) {
    const parts = text.split(/([@#]\w+)/g);
    return parts.map((part, i) =>
        /^[@#]\w+$/.test(part)
            ? <span key={i} className="tweet-highlight">{part}</span>
            : part
    );
}

export default function TweetCard({tweet, author}) {
    return (
        <div className="tweet-card">
            <div className="tweet-header">
                {author?.profile_image_url && (
                    <img src={author.profile_image_url} alt={author.name} className="tweet-avatar"/>
                )}
                <div className="tweet-author">
                    <span className="tweet-name">{author?.name}</span>
                    <span className="tweet-handle">@{author?.username} · {relativeTime(tweet.created_at)}</span>
                </div>
            </div>
            <p className="tweet-body">{highlightText(tweet.text)}</p>
            <div className="tweet-meta">
                <span className="tweet-meta-item">♡ {tweet.public_metrics?.like_count ?? 0}</span>
                <span className="tweet-meta-item">↺ {tweet.public_metrics?.retweet_count ?? 0}</span>
                <a
                    href={`https://x.com/i/web/status/${tweet.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tweet-link"
                >↗</a>
            </div>
        </div>
    );
}
