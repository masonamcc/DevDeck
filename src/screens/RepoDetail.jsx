import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useGitHubRepoDetail } from '../hooks/useGitHubRepoDetail.js';
import { getLangColor } from '../utils/languageColors.js';
import { config } from '../config.js';
import {useXFeed} from "../hooks/useXFeed.js";
import TweetCard from "../components/TweetCard.jsx";
function LanguageBar({ languages }) {
    const total = Object.values(languages).reduce((sum, n) => sum + n, 0);
    if (total === 0) return null;

    const entries = Object.entries(languages);

    return (
        <div className="lang-section">
            <div className="lang-bar">
                {entries.map(([lang, bytes]) => (
                    <div
                        key={lang}
                        className="lang-bar-segment"
                        style={{ width: `${(bytes / total) * 100}%`, background: getLangColor(lang) }}
                        title={`${lang}: ${((bytes / total) * 100).toFixed(1)}%`}
                    />
                ))}
            </div>
            <div className="lang-list">
                {entries.map(([lang, bytes]) => (
                    <span key={lang} className="lang-item">
                        <span className="lang-dot" style={{ background: getLangColor(lang) }} />
                        <span className="lang-name">{lang}</span>
                        <span className="lang-pct">{((bytes / total) * 100).toFixed(1)}%</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function RepoDetail() {
    const { repoName } = useParams();
    const navigate = useNavigate();
    const { repo, readme, languages, loading, error } = useGitHubRepoDetail(config.githubUsername, repoName);
    const { tweets, users, loading: xLoading, error: xError } = useXFeed(config.xUsername);
    const hashtag = repoName.replace(/-/g, '').toLowerCase();
    const repoTweets = tweets.filter(t => t.text.toLowerCase().includes(`#${hashtag}`));

    if (loading) {
        return (
            <div className="mainframe-grid bg-dark">
                <div className="mainframe-section scroll column vertical-center flex-col">
                    <div className="fullwidth vertical-center width-50">
                        <p className="color-faint-text monospace" style={{ paddingBlock: '4rem' }}>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mainframe-grid bg-dark">
                <div className="mainframe-section scroll column vertical-center flex-col">
                    <div className="fullwidth vertical-center width-50">
                        <p className="error-message" style={{ paddingBlock: '4rem' }}>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mainframe-grid bg-dark">
            <div className="mainframe-section scroll horizon-center flex">
                <div className="repo-detail-layout py-2">

                    <div className={'mb-1-children'}>
                        <button
                            className="repo-detail-back"
                            onClick={() => navigate(-1)}
                        >
                            ← Back
                        </button>

                        <div className="repo-detail-header">

                            <div className={'flex space-between mb-2'} style={{alignItems: 'center'}}>
                                <div className="repo-detail-title-row">
                                    <h3 className="color-accent monospace" style={{ margin: 0 }}>{repo?.name}</h3>
                                    {repo?.private && <span className="repo-badge">private</span>}
                                    {repo?.is_template && <span className="repo-badge">template</span>}
                                </div>

                                <a
                                    href={repo?.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="button bg-accent repo-detail-gh-btn"
                                >
                                    View on GitHub ↗
                                </a>
                            </div>


                            {repo?.description && (
                                <p className="color-light" style={{ marginTop: '0.5rem' }}>{repo.description}</p>
                            )}



                            <div className="repo-detail-meta">
                                {repo?.stargazers_count > 0 && (
                                    <span className="repo-meta-item">★ {repo.stargazers_count}</span>
                                )}
                                {repo?.forks_count > 0 && (
                                    <span className="repo-meta-item">⑂ {repo.forks_count}</span>
                                )}
                                {repo?.open_issues_count > 0 && (
                                    <span className="repo-meta-item">◎ {repo.open_issues_count} issues</span>
                                )}
                            </div>
                        </div>

                        {(repoTweets.length > 0 || xLoading || xError) && (
                            <div className="section mobile">
                                <div className="section-header gap-1 color-accent">
                                    <p className="monospace" style={{ whiteSpace: 'nowrap' }}>
                                        Updates
                                    </p>
                                    <div className="horizon-line-faint"/>
                                </div>

                                {xLoading && (
                                    <p className="repo-status color-faint-text">Loading posts...</p>
                                )}

                                {xError && (
                                    <p className="repo-status error-message">{xError}</p>
                                )}

                                {!xLoading && !xError && (
                                    <div className="tweet-grid-horizontal">
                                        {repoTweets.map(tweet => (
                                            <TweetCard key={tweet.id} tweet={tweet} author={users.get(tweet.author_id)}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {Object.keys(languages).length > 0 && (
                            <div className="section" style={{ paddingBlock: '1.5rem' }}>
                                <div className="section-header gap-1 color-accent">
                                    <p className="monospace">Languages</p>
                                    <div className="horizon-line-faint" />
                                </div>
                                <LanguageBar languages={languages} />
                            </div>
                        )}

                        <div className="section" style={{ paddingTop: 0 }}>
                            <div className="section-header gap-1 color-accent">
                                <p className="monospace">README</p>
                                <div className="horizon-line-faint" />
                            </div>

                            {readme ? (
                                <div className="repo-readme">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {readme}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p className="color-faint-text monospace" style={{ fontSize: 14 }}>No README found.</p>
                            )}
                        </div>

                    </div>

                    <div className={'web'}>
                        {(repoTweets.length > 0 || xLoading || xError) && (
                            <div className="section">
                                <div className="section-header gap-1 color-accent">
                                    <p className="monospace" style={{ whiteSpace: 'nowrap' }}>
                                        Updates
                                    </p>
                                    <div className="horizon-line-faint"/>
                                </div>

                                {xLoading && (
                                    <p className="repo-status color-faint-text">Loading posts...</p>
                                )}

                                {xError && (
                                    <p className="repo-status error-message">{xError}</p>
                                )}

                                {!xLoading && !xError && (
                                    <div className="tweet-grid">
                                        {repoTweets.map(tweet => (
                                            <TweetCard key={tweet.id} tweet={tweet} author={users.get(tweet.author_id)}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
