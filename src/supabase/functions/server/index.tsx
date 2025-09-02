import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Auth routes
app.post('/make-server-cd010421/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log('Login error:', error);
      return c.json({ error: error.message }, 401);
    }

    return c.json({ 
      success: true, 
      access_token: data.session?.access_token,
      user: data.user 
    });
  } catch (error) {
    console.log('Login catch error:', error);
    return c.json({ error: 'Invalid request format' }, 400);
  }
});

app.post('/make-server-cd010421/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      user: data.user 
    });
  } catch (error) {
    console.log('Signup catch error:', error);
    return c.json({ error: 'Invalid request format' }, 400);
  }
});

// Episodes routes
app.get('/make-server-cd010421/episodes', async (c) => {
  try {
    const episodes = await kv.getByPrefix('episode_');
    return c.json({ episodes: episodes || [] });
  } catch (error) {
    console.log('Get episodes error:', error);
    return c.json({ error: 'Failed to fetch episodes' }, 500);
  }
});

app.post('/make-server-cd010421/episodes', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log('Auth error while creating episode:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const episode = await c.req.json();
    const episodeId = `episode_${Date.now()}`;
    
    await kv.set(episodeId, {
      ...episode,
      id: episodeId,
      publishDate: new Date().toISOString().split('T')[0],
      createdBy: user.id,
      createdAt: new Date().toISOString()
    });

    return c.json({ success: true, id: episodeId });
  } catch (error) {
    console.log('Create episode error:', error);
    return c.json({ error: 'Failed to create episode' }, 500);
  }
});

app.put('/make-server-cd010421/episodes/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log('Auth error while updating episode:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const episodeId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingEpisode = await kv.get(episodeId);
    if (!existingEpisode) {
      return c.json({ error: 'Episode not found' }, 404);
    }

    await kv.set(episodeId, {
      ...existingEpisode,
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Update episode error:', error);
    return c.json({ error: 'Failed to update episode' }, 500);
  }
});

app.delete('/make-server-cd010421/episodes/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log('Auth error while deleting episode:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const episodeId = c.req.param('id');
    await kv.del(episodeId);

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete episode error:', error);
    return c.json({ error: 'Failed to delete episode' }, 500);
  }
});

// Blog posts routes
app.get('/make-server-cd010421/blog', async (c) => {
  try {
    const posts = await kv.getByPrefix('blog_');
    // Filter to only show published posts for public access
    const publishedPosts = posts.filter(post => post.published);
    return c.json({ posts: publishedPosts || [] });
  } catch (error) {
    console.log('Get blog posts error:', error);
    return c.json({ error: 'Failed to fetch blog posts' }, 500);
  }
});

app.get('/make-server-cd010421/blog/admin', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log('Auth error while fetching admin blog posts:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const posts = await kv.getByPrefix('blog_');
    return c.json({ posts: posts || [] });
  } catch (error) {
    console.log('Get admin blog posts error:', error);
    return c.json({ error: 'Failed to fetch blog posts' }, 500);
  }
});

app.post('/make-server-cd010421/blog', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log('Auth error while creating blog post:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const post = await c.req.json();
    const postId = `blog_${Date.now()}`;
    
    await kv.set(postId, {
      ...post,
      id: postId,
      publishDate: new Date().toISOString().split('T')[0],
      createdBy: user.id,
      createdAt: new Date().toISOString()
    });

    return c.json({ success: true, id: postId });
  } catch (error) {
    console.log('Create blog post error:', error);
    return c.json({ error: 'Failed to create blog post' }, 500);
  }
});

app.put('/make-server-cd010421/blog/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log('Auth error while updating blog post:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingPost = await kv.get(postId);
    if (!existingPost) {
      return c.json({ error: 'Blog post not found' }, 404);
    }

    await kv.set(postId, {
      ...existingPost,
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Update blog post error:', error);
    return c.json({ error: 'Failed to update blog post' }, 500);
  }
});

app.delete('/make-server-cd010421/blog/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log('Auth error while deleting blog post:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('id');
    await kv.del(postId);

    return c.json({ success: true });
  } catch (error) {
    console.log('Delete blog post error:', error);
    return c.json({ error: 'Failed to delete blog post' }, 500);
  }
});

// Contact form route
app.post('/make-server-cd010421/contact', async (c) => {
  try {
    const { name, email, subject, body } = await c.req.json();
    
    if (!name || !email || !subject || !body) {
      return c.json({ error: 'All fields are required' }, 400);
    }
    
    // Get profile data to get the contact email
    const profile = await kv.get('profile_data');
    const contactEmail = profile?.email || 'sakshi99tantak@gmail.com';
    
    // Store the contact message
    const contactId = `contact_${Date.now()}`;
    await kv.set(contactId, {
      id: contactId,
      name,
      email,
      subject,
      body,
      timestamp: new Date().toISOString(),
      status: 'new'
    });
    
    // In a real application, you would send an email here
    // For now, we'll just store the message and return success
    console.log(`New contact message from ${name} (${email}): ${subject}`);
    console.log(`Message: ${body}`);
    console.log(`Would send notification to: ${contactEmail}`);
    
    return c.json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });
  } catch (error) {
    console.log('Contact form error:', error);
    return c.json({ error: 'Failed to submit contact form' }, 500);
  }
});

// Contact messages admin route
app.get('/make-server-cd010421/contact/admin', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log('Auth error while fetching contact messages:', authError);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const messages = await kv.getByPrefix('contact_');
    // Sort by timestamp, newest first
    const sortedMessages = messages.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return c.json({ messages: sortedMessages || [] });
  } catch (error) {
    console.log('Get contact messages error:', error);
    return c.json({ error: 'Failed to fetch contact messages' }, 500);
  }
});

// Profile routes
app.get('/make-server-cd010421/profile', async (c) => {
  try {
    const profile = await kv.get('profile_data');
    return c.json({ 
      profile: profile || {
        name: 'Sakshi Tantak',
        title: 'Data Scientist & AI Researcher',
        bio: 'Passionate data scientist exploring the intersection of artificial intelligence, neuroscience, and consciousness.',
        photo: 'https://images.unsplash.com/photo-1712174766230-cb7304feaafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGRhdGElMjBzY2llbnRpc3QlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTY3MTIyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        email: 'sakshi99tantak@gmail.com',
        linkedinUrl: 'https://linkedin.com/in/sakshitantak',
        twitterUrl: '',
        education: 'Masters in Computer Science, Bachelors in Data Science',
        workStartDate: '2021-01',
        skills: ['Data Science', 'Machine Learning', 'AI Research', 'Python', 'Neural Networks', 'Deep Learning'],
        achievements: 'Published researcher in AI and consciousness, Podcast host, Data science consultant for multiple startups'
      }
    });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

app.put('/make-server-cd010421/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    console.log('Profile update - received token:', accessToken ? 'Token present' : 'No token');
    
    if (!accessToken) {
      console.log('Profile update - no access token provided');
      return c.json({ error: 'Unauthorized', code: 401, message: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      console.log('Profile update - auth error:', authError);
      return c.json({ 
        error: 'Invalid or expired token', 
        code: 401, 
        message: 'Invalid JWT',
        details: authError.message 
      }, 401);
    }
    
    if (!user?.id) {
      console.log('Profile update - no user found');
      return c.json({ error: 'User not found', code: 401, message: 'Invalid JWT' }, 401);
    }

    console.log('Profile update - authenticated user:', user.id);
    const profileData = await c.req.json();
    console.log('Profile update - data to save:', profileData);
    
    await kv.set('profile_data', {
      ...profileData,
      updatedBy: user.id,
      updatedAt: new Date().toISOString()
    });

    console.log('Profile update - success');
    return c.json({ success: true });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Health check
app.get('/make-server-cd010421/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);