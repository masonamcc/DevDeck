import {config} from '../config.js';
import {useGitHubRepos} from '../hooks/useGitHubRepos.js';
import RepoCard from '../components/RepoCard.jsx';
import TweetCard from '../components/TweetCard.jsx';
import {useNavigate} from "react-router-dom";

export default function Home() {
    const {repos, loading, error} = useGitHubRepos(config.githubUsername);
    const navigator = useNavigate()

    return (
        <div className="mainframe-grid bg-dark">
            <div className="mainframe-section scroll column vertical-center flex-col">
                <div className="fullwidth width-50 mb-1-children">

                    <div className="color-white mb-1-children"
                         style={{justifyContent: 'center'}}>
                        <div className={'fullwidth mb-1-children'}>
                            <div className={'py-2 mb-2-children'} style={{textAlign: 'center'}}>
                                <h1 style={{marginTop: 0}}>
                                    Mason McCall
                                </h1>
                                <h4 className={'monospace color-accent mb-1'}>{config.title}</h4>
                                <a href={config.resumeLink} target="_blank" rel="noreferrer" className={'bg-accent resume-btn'}>Resume ↗</a>

                            </div>
                            <div className={'horizon-line-faint'} />
                            <div className={'mb-1-children monospace'}>
                                <p>{config.location}</p>
                                <p className={'monospace'}>{config.bio}</p>
                            </div>
                        </div>

                        {/*<div className="web name-circle-container ">*/}
                        {/*    <svg viewBox="0 0 200 200" className="name-circle-svg">*/}
                        {/*        <defs>*/}
                        {/*            <path*/}
                        {/*                id="circlePath"*/}
                        {/*                d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"*/}
                        {/*            />*/}

                        {/*        </defs>*/}
                        {/*        <text className="name-circle-text monospace">*/}
                        {/*            <textPath href="#circlePath">*/}
                        {/*                <tspan style={{fill: 'white'}}>MASON MCCALL</tspan> • SOFTWARE ENGINEER •*/}
                        {/*            </textPath>*/}
                        {/*        </text>*/}
                        {/*    </svg>*/}
                        {/*</div>*/}
                        {/*<div className={'mb-1-children monospace web'}>*/}
                        {/*    <p>{config.location}</p>*/}
                        {/*    <p className={'monospace'}>{config.bio}</p>*/}
                        {/*</div>*/}
                    </div>

                    <div className="skills-ticker-wrapper">
                        <div className="skills-ticker-track">
                            {(() => {
                                const sorted = [...config.skills].sort((a, b) => a.localeCompare(b));
                                return [...sorted, ...sorted, ...sorted];
                            })().map((skill, i) => (
                                <span key={i} className="skills-ticker-item">{skill}</span>
                            ))}
                        </div>
                    </div>

                    {config.xPosts?.length > 0 && (
                        <div className="section">
                            <div className="section-header gap-1 color-accent">
                                <p className="monospace">#{config.xHashtag}</p>
                                <div className="horizon-line-faint"/>
                            </div>
                            <div className="tweet-grid">
                                {config.xPosts.map(post => (
                                    <TweetCard key={post.id} tweet={post} author={post.author}/>
                                ))}
                            </div>
                        </div>
                    )}

                    {repos.some(repo => repo.topics?.some(topic => topic.includes('app'))) && (
                        <div className="section">
                            <div className="section-header gap-1 color-accent">
                                <p className="monospace">Applications</p>
                                <div className="horizon-line-faint"/>
                            </div>

                            {loading && (
                                <p className="repo-status color-faint-text">Loading repositories...</p>
                            )}

                            {error && (
                                <p className="repo-status error-message">{error}</p>
                            )}

                            {!loading && !error && (
                                <div className="repo-grid">
                                    {repos
                                        .filter(repo =>
                                            repo.topics?.some(topic => topic.includes('app'))
                                        )
                                        .map(repo => (
                                            <RepoCard key={repo.id} repo={repo}/>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}


                    {config.projects.length > 0 && (
                        <div className="section">
                            <div className="section-header gap-1 color-accent">
                                <p className="monospace">Projects</p>
                                <div className="horizon-line-faint"></div>
                            </div>

                            {loading && (
                                <p className="repo-status color-faint-text">Loading repositories...</p>
                            )}

                            {error && (
                                <p className="repo-status error-message">{error}</p>
                            )}

                            {!loading && !error && (
                                <div className={'mb-2-children'}>
                                    {config.projects.sort((a,b) => a.projectName.localeCompare(b.projectName)).map(project => (
                                        <div className={"grid-2-col gap-1s"}>
                                            <div className={"mb-half-children color-white"}>
                                                <h4 style={{fontWeight: 700}}>{project.projectName}</h4>
                                                <p>{project.status}</p>
                                                <p className={'monospace color-light'}>{project.projectDescription}</p>
                                            </div>

                                            <div className={'mb-1-children'} key={project.projectName}>
                                                {repos
                                                    .filter(repo => repo.name.toLowerCase().includes(project.projectName.toLowerCase()))
                                                    .map(repo => (
                                                        <RepoCard key={repo.id} repo={repo}/>
                                                    ))}
                                            </div>

                                        </div>


                                    ))}
                                </div>
                            )}
                        </div>
                    )}


                    <div className="section">
                        <div className="section-header gap-1 color-accent">
                            <p className="monospace">Other Repositories</p>
                            <div className="horizon-line-faint"/>
                        </div>

                        {loading && (
                            <p className="repo-status color-faint-text">Loading repositories...</p>
                        )}

                        {error && (
                            <p className="repo-status error-message">{error}</p>
                        )}

                        {!loading && !error && (


                            <div className="repo-grid">

                                {repos.filter(repo =>
                                    !repo.is_template && !repo.topics.some(topic => topic.includes('app')) &&
                                    !config.projects.some(proj =>
                                        repo.name.toLowerCase().includes(proj.projectName.toLowerCase())
                                    )
                                ).map(repo => (
                                    <RepoCard key={repo.id} repo={repo}/>
                                ))}
                            </div>
                        )}
                    </div>

                    {repos.some(repo => repo.is_template) && (
                        <div className="section mb-5">
                            <div className="section-header gap-1 color-accent">
                                <p className="monospace">Template Repos</p>
                                <div className="horizon-line-faint"/>
                            </div>

                            {loading && (
                                <p className="repo-status color-faint-text">Loading repositories...</p>
                            )}

                            {error && (
                                <p className="repo-status error-message">{error}</p>
                            )}

                            {!loading && !error && (
                                <div className="repo-grid">
                                    {repos.filter(repo => repo.is_template).map(repo => (
                                        <RepoCard key={repo.id} repo={repo}/>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
