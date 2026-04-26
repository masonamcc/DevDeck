import {Link} from 'react-router-dom';
import {getLangColor} from '../utils/languageColors.js';

function MiniLangBar({languages}) {
    if (!languages) return null;
    const entries = Object.entries(languages);
    if (entries.length === 0) return null;
    const total = entries.reduce((s, [, b]) => s + b, 0);
    return (
        <div className="mini-lang-bar">
            {entries.map(([lang, bytes]) => (
                <div
                    key={lang}
                    className="mini-lang-segment"
                    style={{width: `${(bytes / total) * 100}%`, background: getLangColor(lang)}}
                    title={`${lang}: ${((bytes / total) * 100).toFixed(1)}%`}
                />
            ))}
        </div>
    );
}

export default function RepoCard({repo}) {
    return (
        <Link
            to={`/repo/${repo.name}`}
            className="repo-card"
        >
            <div className="repo-card-header">
                <span className="repo-card-name">{repo.name}</span>
                {repo.private && <span className="repo-badge">private</span>}
            </div>

            {repo.description && (
                <p className="repo-card-desc">{repo.description}</p>
            )}

            {/*<MiniLangBar languages={repo.languages}/>*/}

            {repo.languages && Object.keys(repo.languages).length > 0 ? (
                <div className="repo-card-langs">
                    {Object.keys(repo.languages).map(lang => (
                        <span key={lang} className="repo-card-lang-pill">
                            <span className="repo-card-lang-dot" style={{background: getLangColor(lang)}}/>
                            {lang}
                        </span>
                    ))}
                </div>
            ) : repo.language ? (
                <div className="repo-card-langs">
                    <span className="repo-card-lang-pill">
                        <span className="repo-card-lang-dot" style={{background: getLangColor(repo.language)}}/>
                        {repo.language}
                    </span>
                </div>
            ) : null}

            <div className="repo-card-meta">
                <span className="repo-meta-item">★ {repo.stargazers_count}</span>
                {repo.fork === false && repo.forks_count > 0 && (
                    <span className="repo-meta-item">⑂ {repo.forks_count}</span>
                )}
            </div>
        </Link>
    );
}
