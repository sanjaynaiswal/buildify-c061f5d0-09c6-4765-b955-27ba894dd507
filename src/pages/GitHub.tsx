
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import './GitHub.css';

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

interface GitHubStats {
  totalCommits: number;
  totalRepos: number;
  totalStars: number;
  topLanguages: { [key: string]: number };
  contributionGraph: number[];
}

const GitHub = () => {
  const { user, setUser } = useContext(UserContext);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (user?.githubConnected) {
      fetchGitHubData();
    }
  }, [user]);
  
  const fetchGitHubData = () => {
    setIsLoading(true);
    
    // Simulate API call to fetch GitHub data
    setTimeout(() => {
      // Mock repositories data
      const mockRepos: Repository[] = [
        {
          id: 1,
          name: 'awesome-project',
          description: 'A really awesome project with lots of features',
          html_url: 'https://github.com/username/awesome-project',
          stargazers_count: 42,
          forks_count: 15,
          language: 'TypeScript',
          updated_at: '2025-06-15T10:30:00Z',
        },
        {
          id: 2,
          name: 'react-game',
          description: 'A simple game built with React',
          html_url: 'https://github.com/username/react-game',
          stargazers_count: 28,
          forks_count: 7,
          language: 'JavaScript',
          updated_at: '2025-06-01T14:20:00Z',
        },
        {
          id: 3,
          name: 'personal-website',
          description: 'My personal portfolio website',
          html_url: 'https://github.com/username/personal-website',
          stargazers_count: 12,
          forks_count: 3,
          language: 'HTML',
          updated_at: '2025-05-20T09:15:00Z',
        },
        {
          id: 4,
          name: 'utility-library',
          description: 'A collection of useful utility functions',
          html_url: 'https://github.com/username/utility-library',
          stargazers_count: 35,
          forks_count: 10,
          language: 'TypeScript',
          updated_at: '2025-05-10T16:45:00Z',
        },
      ];
      
      // Mock stats data
      const mockStats: GitHubStats = {
        totalCommits: 847,
        totalRepos: 15,
        totalStars: 127,
        topLanguages: {
          'TypeScript': 45,
          'JavaScript': 30,
          'HTML': 15,
          'CSS': 10,
        },
        contributionGraph: [
          2, 4, 6, 3, 5, 7, 2, 0, 1, 3, 5, 8, 10, 7, 4, 2, 3, 5, 6, 8, 9, 7, 5, 3, 2, 4, 6, 8, 7, 5,
        ],
      };
      
      setRepositories(mockRepos);
      setStats(mockStats);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleConnectGitHub = () => {
    setIsConnecting(true);
    setError(null);
    
    // Simulate GitHub OAuth flow
    setTimeout(() => {
      // Mock successful connection
      if (user) {
        const updatedUser = {
          ...user,
          githubConnected: true,
          githubUsername: 'github_user',
          githubAvatar: 'https://via.placeholder.com/150',
        };
        
        setUser(updatedUser);
        fetchGitHubData();
      }
      
      setIsConnecting(false);
    }, 2000);
  };
  
  const handleDisconnectGitHub = () => {
    setIsConnecting(true);
    
    // Simulate disconnection
    setTimeout(() => {
      if (user) {
        const updatedUser = {
          ...user,
          githubConnected: false,
          githubUsername: undefined,
          githubAvatar: undefined,
        };
        
        setUser(updatedUser);
        setRepositories([]);
        setStats(null);
      }
      
      setIsConnecting(false);
    }, 1000);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const renderContributionGraph = () => {
    if (!stats) return null;
    
    return (
      <div className="contribution-graph">
        <h3>Contribution Activity</h3>
        <div className="graph-container">
          {stats.contributionGraph.map((count, index) => (
            <div 
              key={index} 
              className="contribution-day" 
              style={{ 
                height: `${Math.min(100, count * 10)}%`,
                backgroundColor: count === 0 
                  ? '#ebedf0' 
                  : count < 3 
                    ? '#9be9a8' 
                    : count < 6 
                      ? '#40c463' 
                      : count < 9 
                        ? '#30a14e' 
                        : '#216e39',
              }}
              title={`${count} contributions`}
            />
          ))}
        </div>
        <div className="graph-legend">
          <span>Last 30 days</span>
        </div>
      </div>
    );
  };
  
  const renderLanguageStats = () => {
    if (!stats) return null;
    
    const languages = Object.entries(stats.topLanguages);
    
    return (
      <div className="language-stats">
        <h3>Top Languages</h3>
        <div className="language-bar">
          {languages.map(([language, percentage]) => (
            <div 
              key={language}
              className="language-segment"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: 
                  language === 'TypeScript' ? '#3178c6' :
                  language === 'JavaScript' ? '#f1e05a' :
                  language === 'HTML' ? '#e34c26' :
                  language === 'CSS' ? '#563d7c' : '#ccc',
              }}
              title={`${language}: ${percentage}%`}
            />
          ))}
        </div>
        <div className="language-legend">
          {languages.map(([language, percentage]) => (
            <div key={language} className="language-item">
              <span 
                className="language-color" 
                style={{ 
                  backgroundColor: 
                    language === 'TypeScript' ? '#3178c6' :
                    language === 'JavaScript' ? '#f1e05a' :
                    language === 'HTML' ? '#e34c26' :
                    language === 'CSS' ? '#563d7c' : '#ccc',
                }}
              />
              <span className="language-name">{language}</span>
              <span className="language-percentage">{percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="github-page">
      <div className="github-header">
        <h1>GitHub Integration</h1>
        <p>Connect your GitHub account to track your coding activity and share your projects</p>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
          <button className="close-btn" onClick={() => setError(null)}>
            &times;
          </button>
        </div>
      )}
      
      <div className="github-content">
        {!user?.githubConnected ? (
          <div className="connect-github-card">
            <div className="github-logo">
              <svg height="68" viewBox="0 0 16 16" width="68">
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
            </div>
            <h2>Connect to GitHub</h2>
            <p>
              Connecting your GitHub account allows you to:
            </p>
            <ul className="benefits-list">
              <li>Share your coding projects with other players</li>
              <li>Earn badges based on your GitHub activity</li>
              <li>Showcase your coding skills on your profile</li>
              <li>Track your coding streaks alongside your gaming stats</li>
            </ul>
            <button 
              className="btn btn-primary github-connect-btn"
              onClick={handleConnectGitHub}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect GitHub Account'}
            </button>
            <p className="privacy-note">
              We only access your public repositories and contribution data.
            </p>
          </div>
        ) : (
          <div className="github-dashboard">
            <div className="github-profile-section">
              <div className="github-profile">
                <img 
                  src={user.githubAvatar || 'https://via.placeholder.com/150'} 
                  alt={user.githubUsername || 'GitHub User'} 
                  className="github-avatar"
                />
                <div className="github-profile-info">
                  <h2>{user.githubUsername || 'GitHub User'}</h2>
                  <a 
                    href={`https://github.com/${user.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-profile-link"
                  >
                    View GitHub Profile
                  </a>
                </div>
                <button 
                  className="btn btn-outline disconnect-btn"
                  onClick={handleDisconnectGitHub}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
              
              {isLoading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading GitHub data...</p>
                </div>
              ) : stats && (
                <div className="github-stats-cards">
                  <div className="stat-card">
                    <div className="stat-value">{stats.totalRepos}</div>
                    <div className="stat-label">Repositories</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{stats.totalCommits}</div>
                    <div className="stat-label">Commits</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{stats.totalStars}</div>
                    <div className="stat-label">Stars</div>
                  </div>
                </div>
              )}
            </div>
            
            {isLoading ? null : (
              <>
                <div className="github-stats-section">
                  {renderContributionGraph()}
                  {renderLanguageStats()}
                </div>
                
                <div className="repositories-section">
                  <h3>Top Repositories</h3>
                  
                  {repositories.length === 0 ? (
                    <div className="empty-state">
                      <p>No repositories found</p>
                    </div>
                  ) : (
                    <div className="repositories-list">
                      {repositories.map(repo => (
                        <div key={repo.id} className="repository-card">
                          <h4 className="repo-name">
                            <a 
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {repo.name}
                            </a>
                          </h4>
                          
                          {repo.description && (
                            <p className="repo-description">{repo.description}</p>
                          )}
                          
                          <div className="repo-meta">
                            {repo.language && (
                              <span className="repo-language">
                                <span 
                                  className="language-dot"
                                  style={{ 
                                    backgroundColor: 
                                      repo.language === 'TypeScript' ? '#3178c6' :
                                      repo.language === 'JavaScript' ? '#f1e05a' :
                                      repo.language === 'HTML' ? '#e34c26' :
                                      repo.language === 'CSS' ? '#563d7c' : '#ccc',
                                  }}
                                />
                                {repo.language}
                              </span>
                            )}
                            
                            <span className="repo-stars">
                              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                                <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                              </svg>
                              {repo.stargazers_count}
                            </span>
                            
                            <span className="repo-forks">
                              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                                <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                              </svg>
                              {repo.forks_count}
                            </span>
                            
                            <span className="repo-updated">
                              Updated on {formatDate(repo.updated_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="github-badges-section">
                  <h3>GitHub Badges</h3>
                  <div className="badges-list">
                    <div className="badge-card">
                      <div className="badge-icon">🌟</div>
                      <div className="badge-info">
                        <div className="badge-name">Star Collector</div>
                        <div className="badge-description">Earned for having over 100 stars on GitHub</div>
                      </div>
                    </div>
                    
                    <div className="badge-card">
                      <div className="badge-icon">🔥</div>
                      <div className="badge-info">
                        <div className="badge-name">Coding Streak</div>
                        <div className="badge-description">Committed code for 7 days in a row</div>
                      </div>
                    </div>
                    
                    <div className="badge-card locked">
                      <div className="badge-icon">🏆</div>
                      <div className="badge-info">
                        <div className="badge-name">Open Source Contributor</div>
                        <div className="badge-description">Contribute to 5 open source projects</div>
                      </div>
                      <div className="badge-locked-overlay">
                        <div className="locked-icon">🔒</div>
                      </div>
                    </div>
                    
                    <div className="badge-card locked">
                      <div className="badge-icon">🚀</div>
                      <div className="badge-info">
                        <div className="badge-name">Project Master</div>
                        <div className="badge-description">Create 10 repositories with at least 10 stars each</div>
                      </div>
                      <div className="badge-locked-overlay">
                        <div className="locked-icon">🔒</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHub;