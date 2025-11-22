# JavaScript & Node.js Mastery

> **Complete modern JavaScript & Node.js practice repository with 200+ exercises covering fundamentals, algorithms, design patterns, and real-world scenarios.**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run tests (watch mode - auto-run on save)
npm run test:watch

# Start with first exercise
open js-fundamentals/01-variables.problem.js
```

---

## 📚 What's Inside

### **200+ Exercises Organized by Category:**

| Category               | Exercises | Topics                                             |
| ---------------------- | --------- | -------------------------------------------------- |
| 🟢 **JS Fundamentals** | 30        | Variables, types, functions, arrays, objects       |
| 🔵 **JS Advanced**     | 40        | Array methods, closures, OOP, prototypes           |
| 🟣 **Async**           | 20        | Promises, async/await, event loop                  |
| 🟡 **Data Structures** | 25        | Linked lists, trees, graphs, hash tables           |
| 🟠 **Algorithms**      | 30        | Sorting, searching, recursion, dynamic programming |
| 🔴 **Node.js Core**    | 35        | File system, streams, events, buffers              |
| 🟤 **Express & APIs**  | 25        | REST APIs, middleware, authentication              |
| ⚫ **Design Patterns** | 15        | Singleton, factory, observer, module patterns      |

**Total: 220 exercises** covering every modern JavaScript & Node.js concept.

---

## 🎯 Learning Paths

### **Path 1: Frontend Developer** (8 weeks)

```
Week 1-2:  JS Fundamentals (01-30)
Week 3-4:  JS Advanced (31-70)
Week 5-6:  Async + Data Structures (71-115)
Week 7-8:  Algorithms + Design Patterns (116-165)
```

### **Path 2: Backend Developer** (8 weeks)

```
Week 1-2:  JS Fundamentals (01-30)
Week 3-4:  Async Programming (71-90)
Week 5-6:  Node.js Core (141-175)
Week 7-8:  Express & APIs (176-200)
```

### **Path 3: Full-Stack** (12 weeks)

```
Complete all 220 exercises in order
```

---

## 📖 How It Works

### **1. Open a Problem File**

```javascript
// js-fundamentals/01-variables.problem.js

// TODO: Declare a variable 'userName' with value 'John Doe'
export let userName = ???;  // Your code here
```

### **2. Run Tests**

```bash
npm run test:watch  # Auto-run on save
```

### **3. See Results**

```
✓ js-fundamentals/01-variables.problem.js (4 tests)
  ✓ should have userName defined
```

### **4. Compare with Solution**

```javascript
// 01-variables.solution.js
export let userName = 'John Doe';
```

### **5. Move to Next Exercise**

---

## 📋 Complete Topic List

<details>
<summary><b>🟢 JavaScript Fundamentals (30)</b></summary>

**Variables & Types (1-10)**

- 1.  Variables (let, const, var)
- 2.  Primitive Types
- 3.  String Methods
- 4.  Number Methods
- 5.  Type Conversion
- 6.  == vs === vs typeof
- 7.  Operators
- 8.  Conditionals
- 9.  Loops
- 10. Truthy/Falsy Values

**Functions (11-20)**

- 11. Function Declaration/Expression
- 12. Arrow Functions
- 13. Parameters & Arguments
- 14. Default Parameters
- 15. Rest/Spread Operators
- 16. Destructuring
- 17. Scope (Global, Function, Block)
- 18. Hoisting
- 19. Template Literals
- 20. Expressions vs Statements

**Arrays & Objects (21-30)**

- 21. Arrays Basics
- 22. Array Methods (push, pop, shift, unshift)
- 23. Array Iteration
- 24. Objects Basics
- 25. Object Methods
- 26. Object Destructuring
- 27. Object.keys/values/entries
- 28. JSON (parse, stringify)
- 29. Value vs Reference Types
- 30. Shallow vs Deep Copy

</details>

<details>
<summary><b>🔵 JavaScript Advanced (40)</b></summary>

**Array Methods (31-40)**

- 31. Higher-Order Functions
- 32. Callbacks
- 33. Array.map()
- 34. Array.filter()
- 35. Array.reduce()
- 36. Array.find/findIndex
- 37. Array.some/every
- 38. Array.sort()
- 39. Array.flat/flatMap
- 40. Method Chaining

**Functions Advanced (41-50)**

- 41. Closures
- 42. IIFE
- 43. this Keyword
- 44. call, apply, bind
- 45. Pure Functions
- 46. Side Effects
- 47. Currying
- 48. Partial Application
- 49. Function Composition (compose, pipe)
- 50. Recursion

**OOP & Prototypes (51-60)**

- 51. Constructor Functions
- 52. new Keyword
- 53. Prototypes
- 54. Prototype Chain
- 55. ES6 Classes
- 56. Class Inheritance
- 57. Static Methods
- 58. Getters & Setters
- 59. Private Fields (#)
- 60. instanceof

**Modern Features (61-70)**

- 61. Symbols
- 62. Iterators
- 63. Generators
- 64. Map Data Structure
- 65. Set Data Structure
- 66. WeakMap & WeakSet
- 67. Proxy & Reflect
- 68. Optional Chaining (?.)
- 69. Nullish Coalescing (??)
- 70. Bitwise Operators

</details>

<details>
<summary><b>🟣 Async Programming (20)</b></summary>

**Event Loop & Timers (71-75)**

- 71. Call Stack
- 72. Event Loop
- 73. Microtasks vs Macrotasks
- 74. setTimeout/setInterval
- 75. requestAnimationFrame

**Promises (76-85)**

- 76. Promise Basics
- 77. Promise.then/catch/finally
- 78. Promise Chaining
- 79. Promise.all()
- 80. Promise.race()
- 81. Promise.allSettled()
- 82. Promise.any()
- 83. Error Handling
- 84. Async Iterators
- 85. Async Generators

**async/await (86-90)**

- 86. async/await Basics
- 87. Error Handling (try/catch)
- 88. Parallel vs Sequential
- 89. fetch API
- 90. AbortController

</details>

<details>
<summary><b>🟡 Data Structures (25)</b></summary>

**Linear Structures (91-100)**

- 91. Arrays Advanced
- 92. Linked List
- 93. Doubly Linked List
- 94. Stack
- 95. Queue
- 96. Deque
- 97. Priority Queue
- 98. Circular Queue
- 99. Type Arrays
- 100. Array Buffers

**Trees (101-110)**

- 101. Binary Tree
- 102. Binary Search Tree (BST)
- 103. AVL Tree
- 104. Tree Traversal (DFS, BFS)
- 105. Heap (Min/Max)
- 106. Trie (Prefix Tree)
- 107. Segment Tree
- 108. Fenwick Tree
- 109. Red-Black Tree
- 110. B-Tree

**Graphs & Hash (111-115)**

- 111. Graph (Adjacency List)
- 112. Graph (Adjacency Matrix)
- 113. Hash Table
- 114. Bloom Filter
- 115. LRU Cache

</details>

<details>
<summary><b>🟠 Algorithms (30)</b></summary>

**Searching (116-120)**

- 116. Linear Search
- 117. Binary Search
- 118. Jump Search
- 119. Interpolation Search
- 120. Exponential Search

**Sorting (121-130)**

- 121. Bubble Sort
- 122. Selection Sort
- 123. Insertion Sort
- 124. Merge Sort
- 125. Quick Sort
- 126. Heap Sort
- 127. Counting Sort
- 128. Radix Sort
- 129. Bucket Sort
- 130. Tim Sort

**Graph Algorithms (131-135)**

- 131. DFS (Depth-First Search)
- 132. BFS (Breadth-First Search)
- 133. Dijkstra's Algorithm
- 134. Bellman-Ford
- 135. Floyd-Warshall

**Dynamic Programming (136-140)**

- 136. Fibonacci (Memoization)
- 137. Longest Common Subsequence
- 138. Knapsack Problem
- 139. Coin Change
- 140. Edit Distance

**Advanced (141-145)**

- 141. Backtracking
- 142. Greedy Algorithms
- 143. Divide & Conquer
- 144. Big O Notation
- 145. Time & Space Complexity

</details>

<details>
<summary><b>🔴 Node.js Core (35)</b></summary>

**Basics (146-155)**

- 146. Node.js Basics (process, global)
- 147. CommonJS vs ES Modules
- 148. module.exports vs exports
- 149. require() Mechanism
- 150. **dirname &**filename
- 151. process.argv
- 152. process.env
- 153. process.exit()
- 154. Command-line Arguments
- 155. REPL

**File System (156-165)**

- 156. fs.readFileSync
- 157. fs.readFile (async)
- 158. fs.writeFile
- 159. fs.appendFile
- 160. fs.unlink (delete)
- 161. fs.rename
- 162. Directory Operations
- 163. fs.watch
- 164. fs Promises API
- 165. Path Module

**Streams & Events (166-175)**

- 166. EventEmitter
- 167. Custom Events
- 168. Readable Streams
- 169. Writable Streams
- 170. Transform Streams
- 171. Pipe
- 172. Buffer Basics
- 173. Buffer Operations
- 174. HTTP Module
- 175. HTTPS Module

**Advanced (176-180)**

- 176. Crypto (Hashing)
- 177. Crypto (Encryption)
- 178. Child Process
- 179. Cluster Module
- 180. Worker Threads

</details>

<details>
<summary><b>🟤 Express & APIs (25)</b></summary>

**Express Basics (181-190)**

- 181. Express Setup
- 182. Routing
- 183. Route Parameters
- 184. Query Parameters
- 185. Request Body (JSON)
- 186. Middleware
- 187. Custom Middleware
- 188. Error Handling Middleware
- 189. express.Router()
- 190. Static Files

**REST APIs (191-200)**

- 191. REST API Design
- 192. CRUD Operations
- 193. Status Codes
- 194. CORS
- 195. Authentication (JWT)
- 196. Password Hashing (bcrypt)
- 197. Input Validation
- 198. Rate Limiting
- 199. Pagination
- 200. Filtering & Sorting

**Testing & Security (201-205)**

- 201. API Testing (Vitest + Supertest)
- 202. Unit Testing
- 203. Integration Testing
- 204. Security Best Practices
- 205. Environment Variables

</details>

<details>
<summary><b>⚫ Design Patterns (15)</b></summary>

**Creational (206-210)**

- 206. Singleton Pattern
- 207. Factory Pattern
- 208. Builder Pattern
- 209. Prototype Pattern
- 210. Module Pattern

**Structural (211-215)**

- 211. Adapter Pattern
- 212. Decorator Pattern
- 213. Facade Pattern
- 214. Proxy Pattern
- 215. Composite Pattern

**Behavioral (216-220)**

- 216. Observer Pattern
- 217. Strategy Pattern
- 218. Command Pattern
- 219. Iterator Pattern
- 220. State Pattern

</details>

---

## 💻 Commands

```bash
# Run all tests
npm test

# Watch mode (recommended) - auto-run on save
npm run test:watch

# Interactive UI
npm run test:ui

# Run specific category
npm run fundamentals    # JS fundamentals only
npm run advanced        # Advanced JS only
npm run async          # Async programming only
npm run algorithms     # Algorithms only
npm run node-core      # Node.js core only
npm run express        # Express & APIs only
```

---

## 📁 Structure

```
javascript-nodejs-mastery/
├── js-fundamentals/        # 30 exercises
│   ├── 01-variables.problem.js
│   ├── 01-variables.solution.js
│   └── ...
│
├── js-advanced/            # 40 exercises
│   ├── 33-array-map.problem.js
│   ├── 43-closures.problem.js
│   └── ...
│
├── async/                  # 20 exercises
│   ├── 69-promise-basics.problem.js
│   └── ...
│
├── data-structures/        # 25 exercises
│   ├── 91-linked-list.problem.js
│   └── ...
│
├── algorithms/             # 30 exercises
│   ├── 121-bubble-sort.problem.js
│   └── ...
│
├── node-core/              # 35 exercises
│   ├── 146-nodejs-basics.problem.js
│   └── ...
│
├── node-advanced/          # 25 exercises
│   ├── 181-express-setup.problem.js
│   └── ...
│
└── design-patterns/        # 15 exercises
    ├── 206-singleton.problem.js
    └── ...
```

---

## 🎓 Daily Practice Routine

### **Week 1-2: Foundations**

- 5 exercises/day from JS Fundamentals
- Run tests in watch mode
- Compare with solutions

### **Week 3-4: Advanced Concepts**

- 3-4 exercises/day from JS Advanced
- Focus on understanding, not speed
- Build small projects using concepts

### **Week 5-8: Specialization**

- Choose your path (Frontend/Backend/Full-Stack)
- 2-3 exercises/day + coding challenges
- Build real projects

### **Ongoing: Mastery**

- Review exercises weekly
- Solve LeetCode/HackerRank using learned patterns
- Teach others (best way to solidify knowledge)

---

## 📚 Resources

- **JavaScript:** [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [JavaScript.info](https://javascript.info/)
- **Node.js:** [Official Docs](https://nodejs.org/docs/latest/api/)
- **Algorithms:** [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
- **Design Patterns:** [Patterns.dev](https://www.patterns.dev/)

---

## ✅ Inspired By

- [33 JavaScript Concepts](https://github.com/leonardomso/33-js-concepts)
- [JavaScript Algorithms](https://github.com/trekhleb/javascript-algorithms)
- [Eloquent JavaScript](https://github.com/marijnh/Eloquent-JavaScript)

---

## 🎯 Goal

**Master modern JavaScript & Node.js through deliberate practice.**

Each exercise teaches one concept clearly. 220 exercises = complete mastery.

**Start now:** `npm run test:watch` → Open `js-fundamentals/01-variables.problem.js`
