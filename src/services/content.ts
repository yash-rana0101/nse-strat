// src/services/content.ts

const API_BASE_URL =
  import.meta.env.PUBLIC_BLOG_API_URL ||
  import.meta.env.PUBLIC_API_URL ||
  'https://blog-api.stratai.live/api';

export interface DbBlog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  metadata?: Record<string, any>;
  publishedAt: string;
  updatedAt: string;
}

export interface DbDoc {
  id: number;
  slug: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  content: string;
  order: number;
  metadata?: Record<string, any>;
  updatedAt: string;
}

export interface DbFeature {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  category: string;
  metrics?: Record<string, any>;
  order: number;
  content: string;
  metadata?: Record<string, any>;
  updatedAt: string;
}

export interface DbChangelog {
  id: number;
  version: string;
  title: string;
  summary: string;
  changes: string[];
  type: string;
  releaseDate: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface DbPolicy {
  id: number;
  slug: string;
  title: string;
  content: string;
  version: string;
  metadata?: Record<string, any>;
  updatedAt: string;
}

async function fetchWithTimeout(
  url: string,
  timeoutMs = 6000
): Promise<Response> {
  return fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
}

/**
 * Fetch all blogs from the database via backend REST API.
 */
export async function fetchBlogs(): Promise<DbBlog[]> {
  try {
    console.log(`📡 [API CALL] GET ${API_BASE_URL}/blogs`);
    const res = await fetchWithTimeout(`${API_BASE_URL}/blogs`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('❌ Failed to fetch blogs from database API:', err);
    return [];
  }
}

/**
 * Fetch a single blog by slug from the database via backend REST API.
 */
export async function fetchBlogBySlug(slug: string): Promise<DbBlog | null> {
  try {
    console.log(`📡 [API CALL] GET ${API_BASE_URL}/blogs/${slug}`);
    const res = await fetchWithTimeout(`${API_BASE_URL}/blogs/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`❌ Failed to fetch blog ${slug} from database API:`, err);
    return null;
  }
}

/**
 * Fetch all documentation entries from the database via backend REST API.
 */
export async function fetchDocs(): Promise<DbDoc[]> {
  try {
    console.log(`📡 [API CALL] GET ${API_BASE_URL}/docs`);
    const res = await fetchWithTimeout(`${API_BASE_URL}/docs`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('❌ Failed to fetch docs from database API:', err);
    return [];
  }
}

/**
 * Fetch a single doc by slug from the database via backend REST API.
 */
export async function fetchDocBySlug(slug: string): Promise<DbDoc | null> {
  try {
    console.log(`📡 [API CALL] GET ${API_BASE_URL}/docs/${slug}`);
    const res = await fetchWithTimeout(`${API_BASE_URL}/docs/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`❌ Failed to fetch doc ${slug} from database API:`, err);
    return null;
  }
}

/**
 * Fetch all features from the database via backend REST API.
 */
export async function fetchFeatures(): Promise<DbFeature[]> {
  try {
    console.log(`📡 [API CALL] GET ${API_BASE_URL}/features`);
    const res = await fetchWithTimeout(`${API_BASE_URL}/features`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('❌ Failed to fetch features from database API:', err);
    return [];
  }
}

/**
 * Fetch a single feature by key from the database via backend REST API.
 */
export async function fetchFeatureByKey(
  key: string
): Promise<DbFeature | null> {
  try {
    console.log(`📡 [API CALL] GET ${API_BASE_URL}/features/${key}`);
    const res = await fetchWithTimeout(`${API_BASE_URL}/features/${key}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`❌ Failed to fetch feature ${key} from database API:`, err);
    return null;
  }
}

/**
 * Fetch all product changelogs from the database via backend REST API.
 */
export async function fetchChangelogs(): Promise<DbChangelog[]> {
  try {
    console.log(`📡 [API CALL] GET ${API_BASE_URL}/changelogs`);
    const res = await fetchWithTimeout(`${API_BASE_URL}/changelogs`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('❌ Failed to fetch changelogs from database API:', err);
    return [];
  }
}

/**
 * Fetch all legal policies from the database via backend REST API.
 */
export async function fetchPolicies(): Promise<DbPolicy[]> {
  try {
    console.log(`📡 [API CALL] GET ${API_BASE_URL}/policies`);
    const res = await fetchWithTimeout(`${API_BASE_URL}/policies`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('❌ Failed to fetch policies from database API:', err);
    return [];
  }
}

/**
 * Fetch a single policy by slug from the database via backend REST API.
 */
export async function fetchPolicyBySlug(
  slug: string
): Promise<DbPolicy | null> {
  try {
    console.log(`📡 [API CALL] GET ${API_BASE_URL}/policies/${slug}`);
    const res = await fetchWithTimeout(`${API_BASE_URL}/policies/${slug}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error(`❌ Failed to fetch policy ${slug} from database API:`, err);
    return null;
  }
}
