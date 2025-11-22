# Node.js Mastery

> **Master Node.js and backend development with 90+ exercises covering EVERYTHING from the official roadmap**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run tests (watch mode - auto-run on save)
npm run test:watch

# Start with first exercise
open node-core/147-commonjs-vs-esm.problem.js
```

---

## 📚 What's Inside

**90+ exercises covering the complete Node.js roadmap:**

| Category | Exercises | Topics |
|----------|-----------|--------|
| 🔴 **Node.js Fundamentals** | 15 | Modules, npm, runtime basics |
| 🟠 **Async Programming** | 12 | Promises, event loop, timers |
| 🟡 **File System & CLI** | 15 | fs, path, CLI tools |
| 🟢 **HTTP & APIs** | 20 | HTTP, Express, Fastify, REST |
| 🔵 **Databases** | 10 | SQL, NoSQL, ORMs |
| 🟣 **Testing & Tools** | 10 | Jest, Vitest, logging, debugging |
| ⚫ **Advanced** | 10 | Streams, workers, performance |

**Total: 92 exercises** following [roadmap.sh/nodejs](https://roadmap.sh/nodejs)

---

## 💻 Commands

```bash
# Run all tests
npm test

# Watch mode (recommended)
npm run test:watch

# Run specific category
npm run fundamentals   # Node.js fundamentals
npm run async         # Async programming
npm run filesystem    # File system & CLI
npm run http          # HTTP & APIs
npm run database      # Database integration
npm run testing       # Testing & tools
npm run advanced      # Advanced topics
```

---

## 📋 Complete Curriculum (Based on roadmap.sh)

### 🔴 **Node.js Fundamentals (15)**

**Module Systems (CRITICAL):**
- 147. CommonJS vs ES Modules (ESM) ✅ NEW!
- 148. require() vs import/export
- 149. module.exports vs exports
- 150. Dynamic imports
- 151. Module resolution

**npm & Package Management:**
- 152. npm basics (install, update, uninstall)
- 153. package.json deep dive
- 154. Semantic versioning
- 155. npm scripts
- 156. npx usage
- 157. Package lock files
- 158. npm workspaces

**Node.js Runtime:**
- 159. process object
- 160. global object
- 161. Node.js vs Browser

---

### 🟠 **Async Programming (12)**

**Callbacks & Promises:**
- 162. Callbacks patterns
- 163. Callback hell solutions
- 164. Promise creation
- 165. Promise chaining
- 166. Promise.all/race/allSettled/any
- 167. async/await patterns

**Event Loop & Timers:**
- 168. Event loop explained
- 169. Microtasks vs Macrotasks
- 170. setTimeout vs setImmediate vs process.nextTick
- 171. setInterval patterns
- 172. Event emitters
- 173. Custom event emitters

---

### 🟡 **File System & CLI Development (15)**

**File System Operations:**
- 174. fs.readFile/writeFile (async)
- 175. fs.readFileSync/writeFileSync
- 176. fs.promises API
- 177. Directory operations (mkdir, readdir, rmdir)
- 178. File watching (fs.watch, fs.watchFile)
- 179. File streams
- 180. Path module (join, resolve, relative)

**CLI Development:**
- 181. Command-line arguments (process.argv)
- 182. Environment variables (process.env, dotenv)
- 183. Building CLI tools
- 184. Interactive prompts
- 185. Colors and formatting
- 186. Progress bars
- 187. CLI argument parsing (yargs, commander)
- 188. Publishing CLI tools to npm

---

### 🟢 **HTTP & API Development (20)**

**HTTP Fundamentals:**
- 189. HTTP module basics
- 190. Creating HTTP server
- 191. Handling requests/responses
- 192. Routing with http module
- 193. HTTPS server

**Express.js:**
- 194. Express setup & basics
- 195. Routing & methods
- 196. Route parameters
- 197. Query strings
- 198. Request body parsing
- 199. Middleware concepts
- 200. Custom middleware
- 201. Error handling middleware
- 202. express.Router()
- 203. Serving static files
- 204. Template engines (EJS, Pug)

**API Development:**
- 205. REST API principles
- 206. CRUD operations
- 207. HTTP status codes
- 208. CORS handling

**Other Frameworks:**
- 209. Fastify basics
- 210. NestJS introduction
- 211. Hono framework
- 212. Framework comparison

---

### 🔵 **Database Integration (10)**

**SQL Databases:**
- 213. PostgreSQL connection
- 214. MySQL basics
- 215. SQL queries in Node.js
- 216. Prepared statements

**NoSQL Databases:**
- 217. MongoDB connection
- 218. MongoDB CRUD
- 219. Mongoose schemas
- 220. Mongoose models & queries

**ORMs & Query Builders:**
- 221. Prisma basics
- 222. TypeORM introduction
- 223. Sequelize usage
- 224. Knex.js query builder

---

### 🟣 **Testing & Development Tools (10)**

**Testing Frameworks:**
- 225. Vitest setup & basics
- 226. Jest testing patterns
- 227. Unit testing
- 228. Integration testing
- 229. API testing (Supertest)
- 230. E2E testing (Playwright, Cypress)
- 231. Mocking & Stubbing

**Development Tools:**
- 232. Logging with Winston
- 233. Morgan for HTTP logging
- 234. Debugging techniques
- 235. Performance monitoring
- 236. Memory profiling

---

### ⚫ **Advanced Topics (10)**

**Streams & Performance:**
- 237. Readable streams
- 238. Writable streams
- 239. Transform streams
- 240. Pipe & pipeline
- 241. Backpressure handling

**Concurrency & Scaling:**
- 242. Worker threads
- 243. Cluster module
- 244. Child processes (exec, spawn, fork)
- 245. Memory management
- 246. Performance optimization

**Security & Authentication:**
- 247. JWT implementation
- 248. OAuth 2.0
- 249. Password hashing (bcrypt)
- 250. Input validation
- 251. Rate limiting
- 252. Security headers
- 253. SQL injection prevention
- 254. XSS protection

---

## 📁 Structure

```
nodejs-mastery/
├── node-fundamentals/     # 15 exercises
│   ├── 147-commonjs-vs-esm.problem.js ✅
│   ├── 148-require-vs-import.problem.js
│   └── ...
├── async/                 # 12 exercises
├── filesystem-cli/        # 15 exercises
├── http-apis/             # 20 exercises
├── databases/             # 10 exercises
├── testing-tools/         # 10 exercises
└── advanced/              # 10 exercises
```

---

## 🎯 Learning Path (12 Weeks)

**Week 1: Fundamentals**
- Module systems (CommonJS vs ESM) ⭐
- npm & package management
- Node.js runtime basics

**Week 2: Async Programming**
- Callbacks, Promises, async/await
- Event loop & timers
- Event emitters

**Week 3: File System & CLI**
- File operations (sync & async)
- CLI tool development
- Environment variables

**Week 4-5: HTTP & Express**
- HTTP module
- Express.js framework
- Middleware & routing
- REST API development

**Week 6: Databases**
- SQL & NoSQL connections
- ORMs (Prisma, Mongoose)
- CRUD operations

**Week 7: Authentication & Security**
- JWT & OAuth
- Password hashing
- Security best practices

**Week 8: Testing**
- Vitest/Jest
- API testing
- E2E testing

**Week 9-10: Advanced Topics**
- Streams & buffers
- Worker threads & clustering
- Performance optimization

**Week 11-12: Real Projects**
- Build complete REST API
- Add authentication
- Deploy to production

---

## 📚 Resources

**Official:**
- [Node.js Docs](https://nodejs.org/docs/latest/api/)
- [Node.js Roadmap](https://roadmap.sh/nodejs) - Complete learning path ⭐
- [Express.js Guide](https://expressjs.com/)

**Best Practices:**
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

**Testing:**
- [Vitest Docs](https://vitest.dev/)
- [Supertest](https://github.com/visionmedia/supertest)

**Frameworks:**
- [Fastify](https://www.fastify.io/)
- [NestJS](https://nestjs.com/)
- [Hono](https://hono.dev/)

---

## 🆕 What's New (Updated!)

✅ **Added CommonJS vs ESM** - Critical topic now covered!
✅ **npm & Package Management** - Full coverage
✅ **CLI Development** - Complete CLI tools section
✅ **Multiple Frameworks** - Express, Fastify, NestJS, Hono
✅ **Database ORMs** - Prisma, Mongoose, TypeORM, Sequelize
✅ **Testing Frameworks** - Vitest, Jest, Playwright, Cypress
✅ **Advanced Topics** - Streams, Workers, Performance

---

## 🎓 Key Topics You MUST Learn

1. **CommonJS vs ESM** ⭐ - Module systems (NEW!)
2. **async/await** - Modern async patterns
3. **Express.js** - Most popular framework
4. **REST APIs** - Industry standard
5. **Databases** - SQL & NoSQL
6. **Authentication** - JWT, OAuth
7. **Testing** - Vitest/Jest
8. **Security** - Best practices
9. **Streams** - Efficient I/O
10. **Deployment** - Production ready

---

**Start now:** `npm run test:watch` → Open `node-fundamentals/147-commonjs-vs-esm.problem.js` ⭐
