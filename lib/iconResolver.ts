// Tech icon lookup and automatic resolver
export interface TechIconOption {
  name: string
  slug: string
  url: string
  category?: string
}

export const POPULAR_TECHS: TechIconOption[] = [
  // Frontend
  { name: "React.js", slug: "react", url: "https://cdn.simpleicons.org/react", category: "Frontend" },
  { name: "Next.js", slug: "nextdotjs", url: "https://cdn.simpleicons.org/nextdotjs", category: "Frontend" },
  { name: "Vue.js", slug: "vuedotjs", url: "https://cdn.simpleicons.org/vuedotjs", category: "Frontend" },
  { name: "Nuxt.js", slug: "nuxt", url: "https://cdn.simpleicons.org/nuxt", category: "Frontend" },
  { name: "Svelte", slug: "svelte", url: "https://cdn.simpleicons.org/svelte", category: "Frontend" },
  { name: "Angular", slug: "angular", url: "https://cdn.simpleicons.org/angular", category: "Frontend" },
  { name: "Tailwind CSS", slug: "tailwindcss", url: "https://cdn.simpleicons.org/tailwindcss", category: "Frontend" },
  { name: "Bootstrap", slug: "bootstrap", url: "https://cdn.simpleicons.org/bootstrap", category: "Frontend" },
  { name: "HTML5", slug: "html5", url: "https://cdn.simpleicons.org/html5", category: "Frontend" },
  { name: "CSS3", slug: "css3", url: "https://cdn.simpleicons.org/css3", category: "Frontend" },
  { name: "Sass", slug: "sass", url: "https://cdn.simpleicons.org/sass", category: "Frontend" },
  { name: "Framer Motion", slug: "framer", url: "https://cdn.simpleicons.org/framer", category: "Frontend" },
  { name: "JavaScript", slug: "javascript", url: "https://cdn.simpleicons.org/javascript", category: "Languages" },
  { name: "TypeScript", slug: "typescript", url: "https://cdn.simpleicons.org/typescript", category: "Languages" },

  // Backend
  { name: "Laravel", slug: "laravel", url: "https://cdn.simpleicons.org/laravel", category: "Backend" },
  { name: "Filament", slug: "filament", url: "https://cdn.simpleicons.org/filament", category: "Backend" },
  { name: "PHP", slug: "php", url: "https://cdn.simpleicons.org/php", category: "Languages" },
  { name: "Node.js", slug: "nodedotjs", url: "https://cdn.simpleicons.org/nodedotjs", category: "Backend" },
  { name: "Express.js", slug: "express", url: "https://cdn.simpleicons.org/express", category: "Backend" },
  { name: "NestJS", slug: "nestjs", url: "https://cdn.simpleicons.org/nestjs", category: "Backend" },
  { name: "Fastify", slug: "fastify", url: "https://cdn.simpleicons.org/fastify", category: "Backend" },
  { name: "Bun", slug: "bun", url: "https://cdn.simpleicons.org/bun", category: "Backend" },
  { name: "Deno", slug: "deno", url: "https://cdn.simpleicons.org/deno", category: "Backend" },
  { name: "Python", slug: "python", url: "https://cdn.simpleicons.org/python", category: "Languages" },
  { name: "Django", slug: "django", url: "https://cdn.simpleicons.org/django", category: "Backend" },
  { name: "FastAPI", slug: "fastapi", url: "https://cdn.simpleicons.org/fastapi", category: "Backend" },
  { name: "Flask", slug: "flask", url: "https://cdn.simpleicons.org/flask", category: "Backend" },
  { name: "Go (Golang)", slug: "go", url: "https://cdn.simpleicons.org/go", category: "Backend" },
  { name: "Fiber", slug: "fiber", url: "./icons/fiber.svg", category: "Backend" },
  { name: "Rust", slug: "rust", url: "https://cdn.simpleicons.org/rust", category: "Languages" },
  { name: "Java", slug: "openjdk", url: "https://cdn.simpleicons.org/openjdk", category: "Languages" },
  { name: "Spring Boot", slug: "springboot", url: "https://cdn.simpleicons.org/springboot", category: "Backend" },
  { name: "Kotlin", slug: "kotlin", url: "https://cdn.simpleicons.org/kotlin", category: "Languages" },
  { name: "C#", slug: "csharp", url: "https://cdn.simpleicons.org/csharp", category: "Languages" },
  { name: "C++", slug: "cplusplus", url: "https://cdn.simpleicons.org/cplusplus", category: "Languages" },
  { name: "Ruby", slug: "ruby", url: "https://cdn.simpleicons.org/ruby", category: "Languages" },
  { name: "Ruby on Rails", slug: "rubyonrails", url: "https://cdn.simpleicons.org/rubyonrails", category: "Backend" },
  { name: "Flutter", slug: "flutter", url: "https://cdn.simpleicons.org/flutter", category: "Mobile" },
  { name: "React Native", slug: "react", url: "https://cdn.simpleicons.org/react", category: "Mobile" },
  { name: "Swift", slug: "swift", url: "https://cdn.simpleicons.org/swift", category: "Mobile" },

  // Databases
  { name: "MySQL", slug: "mysql", url: "https://cdn.simpleicons.org/mysql", category: "Databases" },
  { name: "PostgreSQL", slug: "postgresql", url: "https://cdn.simpleicons.org/postgresql", category: "Databases" },
  { name: "MongoDB", slug: "mongodb", url: "https://cdn.simpleicons.org/mongodb", category: "Databases" },
  { name: "Redis", slug: "redis", url: "https://cdn.simpleicons.org/redis", category: "Databases" },
  { name: "SQLite", slug: "sqlite", url: "https://cdn.simpleicons.org/sqlite", category: "Databases" },
  { name: "Prisma ORM", slug: "prisma", url: "https://cdn.simpleicons.org/prisma", category: "Databases" },
  { name: "Supabase", slug: "supabase", url: "https://cdn.simpleicons.org/supabase", category: "Databases" },
  { name: "Firebase", slug: "firebase", url: "https://cdn.simpleicons.org/firebase", category: "Databases" },
  { name: "GraphQL", slug: "graphql", url: "https://cdn.simpleicons.org/graphql", category: "Databases" },

  // DevOps & Tools
  { name: "Docker", slug: "docker", url: "https://cdn.simpleicons.org/docker", category: "DevOps" },
  { name: "Kubernetes", slug: "kubernetes", url: "https://cdn.simpleicons.org/kubernetes", category: "DevOps" },
  { name: "Linux", slug: "linux", url: "https://cdn.simpleicons.org/linux", category: "DevOps" },
  { name: "Ubuntu", slug: "ubuntu", url: "https://cdn.simpleicons.org/ubuntu", category: "DevOps" },
  { name: "Nginx", slug: "nginx", url: "https://cdn.simpleicons.org/nginx", category: "DevOps" },
  { name: "Git", slug: "git", url: "https://cdn.simpleicons.org/git", category: "Tools" },
  { name: "GitHub", slug: "github", url: "https://cdn.simpleicons.org/github", category: "Tools" },
  { name: "GitLab", slug: "gitlab", url: "https://cdn.simpleicons.org/gitlab", category: "Tools" },
  { name: "Postman", slug: "postman", url: "https://cdn.simpleicons.org/postman", category: "Tools" },
  { name: "AWS", slug: "amazonwebservices", url: "https://cdn.simpleicons.org/amazonwebservices", category: "Cloud" },
  { name: "Google Cloud", slug: "googlecloud", url: "https://cdn.simpleicons.org/googlecloud", category: "Cloud" },
  { name: "Vercel", slug: "vercel", url: "https://cdn.simpleicons.org/vercel", category: "Cloud" },
  { name: "Keycloak", slug: "keycloak", url: "https://cdn.simpleicons.org/keycloak", category: "Security" },
  { name: "Camunda", slug: "camunda", url: "https://cdn.simpleicons.org/camunda", category: "Tools" },
  { name: "Power BI", slug: "powerbi", url: "https://cdn.simpleicons.org/powerbi", category: "Analytics" },
  { name: "Tableau", slug: "tableau", url: "https://cdn.simpleicons.org/tableau", category: "Analytics" },
  { name: "OpenCV", slug: "opencv", url: "https://cdn.simpleicons.org/opencv", category: "AI & ML" },
  { name: "TensorFlow", slug: "tensorflow", url: "https://cdn.simpleicons.org/tensorflow", category: "AI & ML" },
  { name: "PyTorch", slug: "pytorch", url: "https://cdn.simpleicons.org/pytorch", category: "AI & ML" },
  { name: "Figma", slug: "figma", url: "https://cdn.simpleicons.org/figma", category: "Design" },
  { name: "Swagger", slug: "swagger", url: "https://cdn.simpleicons.org/swagger", category: "Tools" },
  { name: "Jest", slug: "jest", url: "https://cdn.simpleicons.org/jest", category: "Testing" },
  { name: "Cypress", slug: "cypress", url: "https://cdn.simpleicons.org/cypress", category: "Testing" },
  { name: "Playwright", slug: "playwright", url: "https://cdn.simpleicons.org/playwright", category: "Testing" },
  { name: "Maestro", slug: "maestro", url: "https://cdn.simpleicons.org/testinglibrary", category: "Testing" },
]

// Common alias dictionary
const ALIAS_MAP: Record<string, string> = {
  "react": "react",
  "reactjs": "react",
  "react.js": "react",
  "next": "nextdotjs",
  "nextjs": "nextdotjs",
  "next.js": "nextdotjs",
  "vue": "vuedotjs",
  "vuejs": "vuedotjs",
  "vue.js": "vuedotjs",
  "nuxt": "nuxt",
  "nuxtjs": "nuxt",
  "tailwind": "tailwindcss",
  "tailwind css": "tailwindcss",
  "tailwindcss": "tailwindcss",
  "node": "nodedotjs",
  "nodejs": "nodedotjs",
  "node.js": "nodedotjs",
  "express": "express",
  "expressjs": "express",
  "express.js": "express",
  "js": "javascript",
  "ts": "typescript",
  "golang": "go",
  "postgres": "postgresql",
  "mongo": "mongodb",
  "k8s": "kubernetes",
  "gcp": "googlecloud",
  "amazon web services": "amazonwebservices",
  "powerbi": "powerbi",
  "power bi": "powerbi",
  "spring": "springboot",
  "ror": "rubyonrails",
  "rails": "rubyonrails",
  "c sharp": "csharp",
  "cplusplus": "cplusplus",
  "cpp": "cplusplus",
  "html": "html5",
  "css": "css3",
  "framer": "framer",
  "framer motion": "framer",
  "framermotion": "framer",
  "cv": "opencv",
  "tf": "tensorflow",
}

/**
 * Automatically resolve an icon URL based on tech name.
 */
export function resolveTechIcon(name: string): string {
  if (!name || !name.trim()) return ""
  
  const trimmed = name.trim()
  const lower = trimmed.toLowerCase()

  // 1. Direct match in Popular list
  const found = POPULAR_TECHS.find(t => t.name.toLowerCase() === lower || t.slug.toLowerCase() === lower)
  if (found) return found.url

  // 2. Check alias map
  if (ALIAS_MAP[lower]) {
    const slug = ALIAS_MAP[lower]
    const matched = POPULAR_TECHS.find(t => t.slug === slug)
    if (matched) return matched.url
    return `https://cdn.simpleicons.org/${slug}`
  }

  // 3. Clean slug generation
  const cleanSlug = lower
    .replace(/\.js$/, "dotjs")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "")

  if (ALIAS_MAP[cleanSlug]) {
    return `https://cdn.simpleicons.org/${ALIAS_MAP[cleanSlug]}`
  }

  // 4. Default to SimpleIcons CDN with sanitized slug
  return `https://cdn.simpleicons.org/${cleanSlug}`
}

/**
 * Filter popular technologies matching query
 */
export function searchTechIcons(query: string): TechIconOption[] {
  if (!query || !query.trim()) return POPULAR_TECHS.slice(0, 12)
  const q = query.toLowerCase().trim()
  return POPULAR_TECHS.filter(t => 
    t.name.toLowerCase().includes(q) || 
    t.slug.toLowerCase().includes(q) ||
    (t.category && t.category.toLowerCase().includes(q))
  ).slice(0, 8)
}
