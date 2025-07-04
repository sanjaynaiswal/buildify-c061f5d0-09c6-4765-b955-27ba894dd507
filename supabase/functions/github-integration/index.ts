
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

// Import required libraries
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// GitHub API endpoints
const GITHUB_API_URL = "https://api.github.com";
const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

// GitHub OAuth credentials
const GITHUB_CLIENT_ID = Deno.env.get('GITHUB_CLIENT_ID') || '';
const GITHUB_CLIENT_SECRET = Deno.env.get('GITHUB_CLIENT_SECRET') || '';
const REDIRECT_URI = Deno.env.get('GITHUB_REDIRECT_URI') || '';

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

interface GitHubRepo {
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
  topLanguages: Record<string, number>;
  contributionGraph: number[];
}

serve(async (req) => {
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Get URL and path
  const url = new URL(req.url);
  const path = url.pathname.split('/').filter(Boolean);
  
  // Handle different endpoints
  if (req.method === 'GET' && path[1] === 'auth') {
    // GitHub OAuth authorization URL
    const authUrl = `${GITHUB_OAUTH_URL}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=read:user,repo`;
    
    return new Response(JSON.stringify({ url: authUrl }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }
  
  if (req.method === 'GET' && path[1] === 'callback') {
    // Handle OAuth callback
    const code = url.searchParams.get('code');
    
    if (!code) {
      return new Response(JSON.stringify({ error: 'No code provided' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    try {
      // Exchange code for access token
      const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });
      
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;
      
      if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Failed to get access token' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        });
      }
      
      // Get user data from GitHub
      const userResponse = await fetch(`${GITHUB_API_URL}/user`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      const userData: GitHubUser = await userResponse.json();
      
      // Get user ID from auth
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'No authorization header' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 401,
        });
      }
      
      const token = authHeader.split(' ')[1];
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !authUser) {
        return new Response(JSON.stringify({ error: 'Authentication failed' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 401,
        });
      }
      
      // Update user with GitHub data
      const { error: updateError } = await supabase
        .from('users')
        .update({
          github_connected: true,
          github_username: userData.login,
          github_avatar: userData.avatar_url,
        })
        .eq('id', authUser.id);
      
      if (updateError) {
        return new Response(JSON.stringify({ error: 'Failed to update user' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      // Get repositories
      const reposResponse = await fetch(`${GITHUB_API_URL}/users/${userData.login}/repos?sort=updated&per_page=10`, {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      
      const repos: GitHubRepo[] = await reposResponse.json();
      
      // Calculate stats
      const stats: GitHubStats = {
        totalCommits: 0,
        totalRepos: repos.length,
        totalStars: repos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
        topLanguages: {},
        contributionGraph: Array(30).fill(0).map(() => Math.floor(Math.random() * 10)), // Mock data
      };
      
      // Calculate top languages
      repos.forEach(repo => {
        if (repo.language) {
          if (stats.topLanguages[repo.language]) {
            stats.topLanguages[repo.language]++;
          } else {
            stats.topLanguages[repo.language] = 1;
          }
        }
      });
      
      // Convert language counts to percentages
      const totalLanguages = Object.values(stats.topLanguages).reduce((acc, count) => acc + count, 0);
      Object.keys(stats.topLanguages).forEach(lang => {
        stats.topLanguages[lang] = Math.round((stats.topLanguages[lang] / totalLanguages) * 100);
      });
      
      // Store GitHub data
      const { error: githubDataError } = await supabase
        .from('github_data')
        .upsert({
          user_id: authUser.id,
          access_token: accessToken,
          repositories: repos,
          stats,
          last_synced: new Date().toISOString(),
        });
      
      if (githubDataError) {
        return new Response(JSON.stringify({ error: 'Failed to store GitHub data' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      
      return new Response(JSON.stringify({ 
        success: true,
        github_username: userData.login,
        github_avatar: userData.avatar_url,
        repositories: repos,
        stats
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }
  
  if (req.method === 'GET' && path[1] === 'data') {
    // Get GitHub data for a user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    const token = authHeader.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !authUser) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    // Get GitHub data
    const { data: githubData, error: githubDataError } = await supabase
      .from('github_data')
      .select('*')
      .eq('user_id', authUser.id)
      .single();
    
    if (githubDataError) {
      return new Response(JSON.stringify({ error: 'Failed to get GitHub data' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    return new Response(JSON.stringify({ 
      repositories: githubData.repositories,
      stats: githubData.stats,
      last_synced: githubData.last_synced
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }
  
  if (req.method === 'POST' && path[1] === 'disconnect') {
    // Disconnect GitHub account
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    const token = authHeader.split(' ')[1];
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !authUser) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    // Update user
    const { error: updateError } = await supabase
      .from('users')
      .update({
        github_connected: false,
        github_username: null,
        github_avatar: null,
      })
      .eq('id', authUser.id);
    
    if (updateError) {
      return new Response(JSON.stringify({ error: 'Failed to update user' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    // Delete GitHub data
    const { error: deleteError } = await supabase
      .from('github_data')
      .delete()
      .eq('user_id', authUser.id);
    
    if (deleteError) {
      return new Response(JSON.stringify({ error: 'Failed to delete GitHub data' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }
  
  // Default response for unknown endpoints
  return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 404,
  });
})