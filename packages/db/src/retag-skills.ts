import "dotenv/config";
import { createDb } from "./client.js";
import { skills } from "./schema.js";
import { eq, sql } from "drizzle-orm";

/**
 * Comprehensive skill tagger — scans ONLY name + description.
 * Uses word-boundary matching for short/ambiguous keywords to prevent false positives.
 *
 * Round 2 QA fix: tightened rules to eliminate garbage tags (robotics on database
 * skills, ios on bioinformatics, frontend on Python-only skills, etc.).
 */

// Keywords that need word-boundary matching (short or ambiguous words)
// These use regex \b matching instead of simple substring includes
const WORD_BOUNDARY_KEYWORDS = new Set([
  'rust', 'swift', 'java', 'php', 'sql', 'go', 'git', 'ios',
  'ruby', 'vue', 'css', 'jsx', 'tsx', 'vim', 'ide', 'pdf',
  'aws', 'gcp', 'mcp', 'nlp', 'rag', 'e2e', 'etl', 'tls',
  'xss', 'csrf', 'jwt', 'afl', 'helm', 'deno', 'vite',
  'expo', 'defi', 'bash', 'zsh',
]);

const TAG_RULES: Record<string, string[]> = {
  // Languages — use specific keywords, avoid short/ambiguous matches
  'python': ['python', 'pyproject', 'pytest', 'django', 'flask', 'fastapi', 'pandas', 'numpy', 'scipy', 'pytorch', 'tensorflow', 'jupyter', 'conda', 'pylint'],
  'typescript': ['typescript', 'tsx'],
  'javascript': ['javascript', 'node.js', 'nodejs', 'webpack', 'vite'],
  'rust': ['rust', 'rustlang', 'cargo', 'tokio', 'axum'],
  'go': ['golang', 'goroutine'],
  'swift': ['swiftui', 'swiftlang', 'swift programming', 'swift package'],
  'java': ['java', 'spring boot', 'maven', 'gradle', 'jvm'],
  'csharp': ['c#', '.net', 'dotnet', 'blazor', 'asp.net'],
  'ruby': ['ruby', 'rails', 'rubygem'],
  'php': ['php', 'laravel', 'wordpress', 'symfony'],
  'sql': ['sql', 'postgres', 'mysql', 'sqlite', 'database query'],
  'shell': ['bash', 'shell script', 'zsh', 'command line', 'shell-script'],

  // Frameworks — require explicit mentions
  'react': ['react', 'jsx', 'nextjs', 'next.js'],
  'vue': ['vue', 'nuxt', 'vuex', 'pinia'],
  'angular': ['angular'],
  'svelte': ['svelte', 'sveltekit'],
  'django': ['django'],
  'tailwind': ['tailwind', 'tailwindcss'],

  // Domains — AI/ML
  'ai': ['artificial intelligence', 'machine learning', 'llm', 'openai', 'anthropic', 'neural network', 'deep learning'],
  'ml': ['machine learning', 'model training', 'scikit', 'sklearn', 'tensorflow', 'pytorch', 'hugging face', 'fine-tun'],
  'nlp': ['nlp', 'natural language processing', 'sentiment analysis'],
  'rag': ['retrieval augmented', 'vector search', 'langchain'],
  'mcp': ['mcp', 'model context protocol'],
  'agent': ['ai agent', 'autonomous agent', 'multi-agent', 'agentic', 'tool-use'],

  // Infrastructure — require explicit infra context
  'devops': ['devops', 'ci/cd', 'ci cd', 'gitops'],
  'docker': ['docker', 'dockerfile', 'docker compose', 'container'],
  'kubernetes': ['kubernetes', 'k8s', 'helm', 'kubectl'],
  'terraform': ['terraform', 'opentofu', 'infrastructure as code'],
  'aws': ['aws', 'amazon web services', 'cloudformation', 'dynamodb'],
  'azure': ['azure', 'arm template', 'bicep'],
  'gcp': ['gcp', 'google cloud', 'bigquery', 'cloud run'],
  'cloudflare': ['cloudflare workers', 'cloudflare pages'],
  'vercel': ['vercel'],

  // Security — require explicit security context
  'security': ['security', 'vulnerability', 'exploit', 'pentest', 'penetration test', 'owasp', 'xss', 'csrf', 'threat model'],
  'auth': ['authentication', 'authorization', 'oauth', 'jwt', 'saml'],
  'crypto': ['cryptograph', 'encryption', 'decryption', 'tls', 'ssl certificate'],
  'audit': ['security audit', 'compliance', 'sast', 'dast'],
  'fuzzing': ['fuzzer', 'fuzzing', 'libfuzzer', 'afl'],

  // Testing — require explicit testing context
  'testing': ['testing', 'test suite', 'test framework', 'test-driven'],
  'e2e': ['e2e', 'end-to-end', 'playwright', 'cypress', 'selenium', 'puppeteer'],
  'unit-testing': ['unit test', 'jest', 'vitest', 'pytest', 'mocha'],
  'performance': ['performance testing', 'benchmark', 'load test', 'profiling'],

  // Data — require explicit data context
  'data': ['data engineering', 'data pipeline', 'etl', 'data warehouse', 'data ingestion'],
  'pandas': ['pandas', 'dataframe'],
  'visualization': ['data visualization', 'plotly', 'grafana dashboard', 'd3.js'],
  'scraping': ['scraping', 'scraper', 'web scraping', 'beautiful soup', 'cheerio'],

  // Frontend — require explicit frontend context
  'frontend': ['frontend', 'front-end', 'user interface', 'responsive design', 'accessibility', 'a11y'],
  'design': ['ui design', 'figma', 'ui/ux', 'wireframe', 'mockup'],
  'animation': ['animation', 'framer motion', 'gsap', 'manim'],

  // Backend — require explicit backend context
  'backend': ['backend', 'back-end', 'rest api', 'graphql', 'grpc', 'microservice'],
  'database': ['database', 'postgres', 'mongodb', 'redis', 'supabase', 'dynamodb', 'clickhouse'],

  // Mobile — require explicit mobile context
  'mobile': ['mobile app', 'react native', 'flutter', 'expo'],
  'ios': ['ios', 'swiftui', 'uikit', 'xcode', 'cocoapods'],
  'android': ['android', 'jetpack compose'],

  // Web3
  'web3': ['blockchain', 'smart contract', 'solidity', 'web3', 'ethereum', 'solana', 'defi'],

  // Content — require explicit content context
  'writing': ['technical writing', 'documentation writing', 'blog writing'],
  'pdf': ['pdf'],

  // Tools
  'git': ['git', 'github', 'gitlab', 'version control', 'pull request'],
  'editor': ['vscode', 'vim', 'neovim', 'emacs'],
  'monitoring': ['monitoring', 'observability', 'logging', 'tracing', 'sentry', 'datadog', 'prometheus'],
};

// Build regex cache for word-boundary keywords
const keywordRegexCache = new Map<string, RegExp>();
function matchesKeyword(text: string, kw: string): boolean {
  if (WORD_BOUNDARY_KEYWORDS.has(kw)) {
    let re = keywordRegexCache.get(kw);
    if (!re) {
      re = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      keywordRegexCache.set(kw, re);
    }
    return re.test(text);
  }
  return text.includes(kw);
}

function generateTags(name: string, description: string): string[] {
  // ONLY scan name + description — readme mentions too many technologies in passing and causes tag spam
  const text = (name + ' ' + (description || '')).toLowerCase();
  const tags: string[] = [];

  for (const [tag, keywords] of Object.entries(TAG_RULES)) {
    for (const kw of keywords) {
      if (matchesKeyword(text, kw)) {
        tags.push(tag);
        break; // only add tag once
      }
    }
  }

  // Deduplicate and cap at 15
  return [...new Set(tags)].slice(0, 15);
}

async function main() {
  const db = createDb();

  // Get all published skills with their readme
  const allSkills = await db.select({
    id: skills.id,
    name: skills.name,
    description: skills.description,
    readme: skills.readme,
    currentTags: skills.tags,
  }).from(skills).where(eq(skills.isPublished, true));

  console.log(`Processing ${allSkills.length} skills...\n`);

  let updated = 0;
  let tagsBefore = 0;
  let tagsAfter = 0;

  for (const skill of allSkills) {
    const oldTags = skill.currentTags || [];
    const newTags = generateTags(skill.name, skill.description || '');

    // REPLACE tags entirely — old tags may be polluted
    tagsBefore += oldTags.length;
    tagsAfter += newTags.length;

    if (JSON.stringify(newTags.sort()) !== JSON.stringify(oldTags.sort())) {
      await db.update(skills).set({ tags: newTags }).where(eq(skills.id, skill.id));
      updated++;
      if (updated <= 20) {
        const removed = oldTags.filter(t => !newTags.includes(t));
        const added = newTags.filter(t => !oldTags.includes(t));
        console.log(`  ${skill.name}: [${oldTags.join(',')}] → [${newTags.join(',')}]`);
        if (removed.length) console.log(`    removed: ${removed.join(', ')}`);
        if (added.length) console.log(`    added: ${added.join(', ')}`);
      }
    }
  }

  console.log(`\n=== Results ===`);
  console.log(`Skills processed: ${allSkills.length}`);
  console.log(`Skills updated: ${updated}`);
  console.log(`Tags before: ${tagsBefore} (avg ${(tagsBefore / allSkills.length).toFixed(1)}/skill)`);
  console.log(`Tags after: ${tagsAfter} (avg ${(tagsAfter / allSkills.length).toFixed(1)}/skill)`);

  process.exit(0);
}

main().catch(console.error);
