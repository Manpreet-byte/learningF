import { useState } from 'react';
import './TheoryPage.css';

const TheoryPage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Simplified theory data with proper escaping
  const theoryTopics = [
    // --- Existing topics above ---
        // --- Additional JavaScript Core Topics ---
        {
          id: 13,
          category: 'JavaScript Core',
          name: 'ES6+ Features',
          explanation: 'Modern JavaScript (ES6+) introduced features like let/const, arrow functions, template literals, destructuring, spread/rest, classes, and modules.',
          keyPoints: [
            'let/const for block-scoped variables',
            'Arrow functions: concise syntax',
            'Template literals: `${}` for string interpolation',
            'Destructuring arrays/objects',
            'Spread/rest operators (...)',
            'Classes and modules for structure'
          ],
          examples: [
            {
              title: 'ES6+ Syntax',
              code: `// Template literals
const name = "Sam";
console.log("Hello, " + name + "!"); // or use: 'Hello, ' + name + '!'

// Destructuring
const [a, b] = [1, 2];
const {x, y} = {x: 10, y: 20};

// Spread
const arr = [1, 2, 3];
const arr2 = [...arr, 4];

// Class
class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + ' makes a sound'; }
}`
            }
          ]
        },
        {
          id: 14,
          category: 'JavaScript Core',
          name: 'Modules & Import/Export',
          explanation: 'Modules help organize code. Use export/import to share code between files.',
          keyPoints: [
            'export: expose functions/variables',
            'import: bring in code from other files',
            'Default vs named exports',
            'Tree-shaking for optimization',
            'Modules are file-scoped',
            'Use .js/.mjs or bundler support'
          ],
          examples: [
            {
              title: 'Module Syntax',
              code: `// math.js
    export function add(a, b) { return a + b; }
    export const PI = 3.14;

    // main.js
    import { add, PI } from './math.js';
    console.log(add(2, 3), PI);`
            }
          ]
        },
        // --- New HTML & CSS Topics ---
        {
          id: 15,
          category: 'HTML & CSS',
          name: 'HTML Structure & Semantics',
          explanation: 'HTML provides the structure of web pages. Semantic tags improve accessibility and SEO.',
          keyPoints: [
            'HTML5 semantic tags: <header>, <nav>, <main>, <section>, <article>, <footer>',
            'Use <h1>-<h6> for headings',
            'Forms: <form>, <input>, <label>, <button>',
            'Accessibility: alt text, labels, ARIA',
            'SEO: proper tag usage',
            'DOCTYPE and meta tags'
          ],
          examples: [
            {
              title: 'Semantic HTML',
              code: `<header><h1>My Site</h1></header>
    <nav><a href="/">Home</a></nav>
    <main>
      <section>
        <article>
          <h2>Post Title</h2>
          <p>Content...</p>
        </article>
      </section>
    </main>
    <footer>© 2025</footer>`
            }
          ]
        },
        {
          id: 16,
          category: 'HTML & CSS',
          name: 'CSS Selectors & Specificity',
          explanation: 'CSS selectors target HTML elements. Specificity determines which styles apply when rules conflict.',
          keyPoints: [
            'Element, class, ID, attribute selectors',
            'Pseudo-classes: :hover, :active, :nth-child',
            'Pseudo-elements: ::before, ::after',
            'Specificity: ID > class > element',
            'Avoid !important',
            'Cascading and inheritance'
          ],
          examples: [
            {
              title: 'CSS Selectors',
              code: `/* Element */
    h1 { color: purple; }
    /* Class */
    .card { box-shadow: 0 2px 8px #aaa; }
    /* ID */
    #main { padding: 2rem; }
    /* Attribute */
    input[type="text"] { border: 1px solid #ccc; }
    /* Pseudo-class */
    a:hover { color: #00ff88; }
    /* Pseudo-element */
    p::first-line { font-weight: bold; }`
            }
          ]
        },
        {
          id: 17,
          category: 'HTML & CSS',
          name: 'Flexbox & Grid',
          explanation: 'Flexbox and Grid are modern CSS layout systems for building responsive designs.',
          keyPoints: [
            'Flexbox: 1D layout (row/column)',
            'Grid: 2D layout (rows & columns)',
            'justify-content, align-items, gap',
            'grid-template-rows/columns',
            'media queries for responsiveness',
            'Combine for complex layouts'
          ],
          examples: [
            {
              title: 'Flexbox & Grid',
              code: `/* Flexbox */
    .container { display: flex; gap: 1rem; }
    .item { flex: 1; }

    /* Grid */
    .grid { display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; }
    .cell { background: #f093fb; }`
            }
          ]
        },
        // --- New Best Practices & Tooling Topics ---
        {
          id: 18,
          category: 'Best Practices',
          name: 'Code Readability & Style',
          explanation: 'Readable code is easier to maintain and debug. Use consistent style and meaningful names.',
          keyPoints: [
            'Use descriptive variable/function names',
            'Consistent indentation and spacing',
            'Comment why, not what',
            'Break code into small functions',
            'Follow community style guides',
            'Automate with linters/formatters'
          ],
          examples: [
            {
              title: 'Readable Code',
              code: `// Bad
    let x = 1; function y(z){return z+1;}

    // Good
    let userCount = 1;
    function increment(value) {
      return value + 1;
    }`
            }
          ]
        },
        {
          id: 19,
          category: 'Best Practices',
          name: 'Version Control with Git',
          explanation: 'Git tracks code changes and enables collaboration. Use branches, commits, and pull requests.',
          keyPoints: [
            'git init, git add, git commit',
            'Branching for features/bugs',
            'git status, git log for history',
            'Pull requests for code review',
            'Resolve merge conflicts',
            'Write clear commit messages'
          ],
          examples: [
            {
              title: 'Git Workflow',
              code: `$ git init
    $ git add .
    $ git commit -m "Initial commit"
    $ git checkout -b feature/login
    $ git merge main`
            }
          ]
        },
        // --- New React & Vite Topics ---
        {
          id: 20,
          category: 'React & Vite',
          name: 'React Context API',
          explanation: 'Context provides a way to pass data through the component tree without props drilling.',
          keyPoints: [
            'Create context with React.createContext()',
            'Provider wraps components',
            'useContext hook to consume',
            'Good for theme, auth, locale',
            'Avoid overuse for all state',
            'Combine with useReducer for complex state'
          ],
          examples: [
            {
              title: 'Context API',
              code: `import React, { createContext, useContext } from "react";

    const ThemeContext = createContext("light");

    function App() {
      return (
        <ThemeContext.Provider value="dark">
          <Toolbar />
        </ThemeContext.Provider>
      );
    }

    function Toolbar() {
      const theme = useContext(ThemeContext);
      return <div>Theme: {theme}</div>;
    }`
            }
          ]
        },
        {
          id: 21,
          category: 'React & Vite',
          name: 'React Router',
          explanation: 'React Router enables navigation between pages in single-page apps.',
          keyPoints: [
            'BrowserRouter wraps app',
            'Route for each page',
            'Link for navigation',
            'useParams/useNavigate hooks',
            'Nested routes',
            'Dynamic route parameters'
          ],
          examples: [
            {
              title: 'React Router Example',
              code: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

    function App() {
      return (
        <BrowserRouter>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </BrowserRouter>
      );
    }`
            }
          ]
        },
        // --- New Tooling & Deployment Topics ---
        {
          id: 22,
          category: 'Tooling & Deployment',
          name: 'Vite & Fast Refresh',
          explanation: 'Vite is a modern build tool for fast development. Fast Refresh updates UI instantly on save.',
          keyPoints: [
            'Vite uses native ES modules',
            'Instant server start',
            'Hot module replacement (HMR)',
            'Optimized production builds',
            'Config via vite.config.js',
            'Supports React, Vue, Svelte, etc.'
          ],
          examples: [
            {
              title: 'Vite Usage',
              code: `$ npm create vite@latest my-app -- --template react
    $ cd my-app
    $ npm install
    $ npm run dev`
            }
          ]
        },
        {
          id: 23,
          category: 'Tooling & Deployment',
          name: 'Deploying to Netlify',
          explanation: 'Netlify makes it easy to deploy static sites and SPAs. Connect your repo and deploy automatically.',
          keyPoints: [
            'Push code to GitHub',
            'Connect repo on Netlify',
            'Configure build command (npm run build)',
            'Set publish directory (dist/)',
            'Automatic deploys on push',
            'Custom domains and HTTPS'
          ],
          examples: [
            {
              title: 'Netlify Deploy',
              code: `# Build for production
    $ npm run build
    # Drag & drop dist/ to Netlify UI
    # Or connect GitHub repo for CI/CD`
            }
          ]
        },
        // --- End of new topics ---
    {
      id: 1,
      category: 'JavaScript Core',
      name: 'Variables & Data Types',
      explanation: 'Variables store data values. JavaScript has different variable types (const, let) and data types (string, number, boolean, object, array, etc.).',
      keyPoints: [
        'const: constant, cannot reassign (preferred)',
        'let: can reassign, block-scoped (ES6+)',
        'var: function-scoped (legacy, avoid)',
        'Primitive types: string, number, boolean, null, undefined',
        'Complex types: object, array, function',
        'typeof operator returns the data type'
      ],
      examples: [
        {
          title: 'Variable Declaration',
          code: `// Prefer const by default
const name = "Alice";
const age = 25;

// Use let when reassigning
let counter = 0;
counter++;

// typeof operator
console.log(typeof name);     // "string"
console.log(typeof age);      // "number"

// Arrays and Objects
const colors = ["red", "green", "blue"];
const person = {
  name: "John",
  age: 30,
  email: "john@example.com"
};`
        }
      ]
    },
    {
      id: 2,
      category: 'JavaScript Core',
      name: 'Functions',
      explanation: 'Functions are reusable blocks of code. They accept parameters, perform operations, and return results.',
      keyPoints: [
        'Functions eliminate code duplication (DRY principle)',
        'Parameters: inputs to function',
        'Return statement: output from function',
        'Arrow functions: modern, concise syntax',
        'Scope: determines where variables are accessible',
        'Closure: inner functions remember outer scope'
      ],
      examples: [
        {
          title: 'Function Types',
          code: `// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const multiply = (a, b) => a * b;

// Arrow with multiple lines
const calculateArea = (width, height) => {
  const area = width * height;
  return area;
};

// Default parameters
const greet = (name = "Guest") => {
  return 'Hello, ' + name + '!';
};

// Function calls
console.log(add(5, 3));        // 8
console.log(multiply(4, 3));   // 12
console.log(greet());          // "Hello, Guest!"
console.log(greet("Alice"));   // "Hello, Alice!"`
        }
      ]
    },
    {
      id: 3,
      category: 'JavaScript Core',
      name: 'Conditionals & Loops',
      explanation: 'Conditionals control program flow based on boolean conditions. Loops repeat code multiple times.',
      keyPoints: [
        'if/else: execute code based on condition',
        'Boolean operators: &&, ||, !',
        'Switch statement: for many discrete values',
        'Ternary operator: shorthand for if/else',
        'for, while, forEach loops',
        'break and continue statements'
      ],
      examples: [
        {
          title: 'Conditionals & Loops',
          code: `// if/else statement
const age = 20;
if (age < 18) {
  console.log("Minor");
} else if (age < 65) {
  console.log("Adult");
} else {
  console.log("Senior");
}

// Ternary operator
const status = age >= 18 ? "Adult" : "Minor";

// for loop
for (let i = 0; i < 5; i++) {
  console.log(i);  // 0, 1, 2, 3, 4
}

// Array iteration
const colors = ["red", "green", "blue"];
colors.forEach((color, index) => {
  console.log(index + ': ' + color);
});

// while loop
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}`
        }
      ]
    },
    {
      id: 4,
      category: 'JavaScript Core',
      name: 'Arrays & Objects',
      explanation: 'Arrays store ordered lists. Objects store key-value pairs. Both are essential for data structures.',
      keyPoints: [
        'Arrays: ordered, indexed collections',
        'Objects: unordered key-value pairs',
        'Array methods: map, filter, reduce, find',
        'Object properties and methods',
        'Destructuring for clean code',
        'Spread operator for copying'
      ],
      examples: [
        {
          title: 'Array & Object Operations',
          code: `// Array methods
const numbers = [1, 2, 3, 4, 5];

// map - transform
const doubled = numbers.map(n => n * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]

// filter - select
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens);    // [2, 4]

// reduce - combine
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum);      // 15

// Object creation
const person = {
  name: "Alice",
  age: 25,
  greet: function() {
    return "Hi, I'm " + this.name;
  }
};

console.log(person.name);        // "Alice"
console.log(person.greet());     // "Hi, I'm Alice"

// Object properties
person.email = "alice@example.com";
delete person.age;`
        }
      ]
    },
    {
      id: 5,
      category: 'JavaScript Core',
      name: 'DOM & Events',
      explanation: 'DOM is how JavaScript interacts with HTML. Events are user interactions like clicks and typing.',
      keyPoints: [
        'Select elements: getElementById, querySelector',
        'Modify content: textContent, innerHTML',
        'Change styles: className, style',
        'addEventListener for events',
        'Event object contains event details',
        'Event delegation for efficiency'
      ],
      examples: [
        {
          title: 'DOM Manipulation & Events',
          code: `// Select elements
const button = document.getElementById("myBtn");
const elements = document.querySelectorAll(".card");

// Modify content
button.textContent = "Click Me";
button.innerHTML = "<span>Click Me</span>";

// Change styles
button.style.backgroundColor = "blue";
button.className = "active";

// Add event listener
button.addEventListener("click", function(event) {
  console.log("Button clicked!");
  event.target.style.color = "red";
});

// Input event
const input = document.querySelector("input");
input.addEventListener("input", function(event) {
  console.log(event.target.value);
});

// Form submission
const form = document.querySelector("form");
form.addEventListener("submit", function(event) {
  event.preventDefault();
  console.log("Form submitted");
});`
        }
      ]
    },
    {
      id: 6,
      category: 'Advanced JavaScript',
      name: 'Promises & Async/Await',
      explanation: 'Promises handle asynchronous operations. Async/await provides cleaner syntax for promise handling.',
      keyPoints: [
        'Promise states: pending, fulfilled, rejected',
        '.then() for success, .catch() for error',
        'async functions return promises',
        'await pauses until promise resolves',
        'Try-catch for error handling',
        'Promise.all() for parallel execution'
      ],
      examples: [
        {
          title: 'Promises & Async/Await',
          code: `// Promise creation
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success!");
  }, 1000);
});

// Using promise
promise
  .then(result => console.log(result))
  .catch(error => console.error(error))
  .finally(() => console.log("Done"));

// Async/await
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// Parallel with Promise.all
async function getMultiple() {
  const [data1, data2] = await Promise.all([
    fetch("/url1").then(r => r.json()),
    fetch("/url2").then(r => r.json())
  ]);
  return { data1, data2 };
}`
        }
      ]
    },
    {
      id: 7,
      category: 'Advanced JavaScript',
      name: 'Error Handling & Debugging',
      explanation: 'Proper error handling prevents crashes. Debugging tools help identify and fix issues.',
      keyPoints: [
        'Try-catch blocks catch errors',
        'Error types: Error, TypeError, ReferenceError',
        'Throw custom errors',
        'Console methods: log, error, warn',
        'Debugger statement pauses execution',
        'DevTools for breakpoints'
      ],
      examples: [
        {
          title: 'Error Handling',
          code: `// Try-catch block
try {
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  console.error("Error:", error.message);
} finally {
  console.log("Cleanup");
}

// Throwing errors
function validateEmail(email) {
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }
  return email;
}

// Custom error class
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.field = field;
  }
}

// Console methods
console.log("Regular message");
console.error("Error message");
console.warn("Warning message");
console.table([{name: "Alice"}, {name: "Bob"}]);

// Timing
console.time("operation");
// ... code ...
console.timeEnd("operation");`
        }
      ]
    },
    {
      id: 8,
      category: 'React & Vite',
      name: 'React Basics & JSX',
      explanation: 'React builds UIs from components. JSX is HTML-like syntax in JavaScript.',
      keyPoints: [
        'Components are reusable UI pieces',
        'JSX compiles to React.createElement()',
        'Props pass data parent to child',
        'Functional components (preferred)',
        'JSX rules and syntax',
        'Component composition'
      ],
      examples: [
        {
          title: 'React Components',
          code: `import React from "react";

// Functional component
function Welcome() {
  return <h1>Hello, React!</h1>;
}

// Component with props
function Greeting({ name, age }) {
  return (
    <div>
      <h2>Hello, {name}!</h2>
      <p>You are {age} years old</p>
    </div>
  );
}

// Component with children
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}

// Using components
function App() {
  return (
    <div>
      <Welcome />
      <Greeting name="Alice" age={25} />
      <Card title="My Card">
        <p>Card content here</p>
      </Card>
    </div>
  );
}

export default App;`
        }
      ]
    },
    {
      id: 9,
      category: 'React & Vite',
      name: 'React Hooks - useState',
      explanation: 'useState manages component state. When state updates, React re-renders with new data.',
      keyPoints: [
        'useState hook for state management',
        'Returns [value, setter]',
        'setState triggers re-render',
        'Never mutate state directly',
        'Multiple useState calls allowed',
        'State updates are asynchronous'
      ],
      examples: [
        {
          title: 'useState Examples',
          code: `import { useState } from "react";

// Counter component
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}

// Form with multiple states
function Form() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}`
        }
      ]
    },
    {
      id: 10,
      category: 'React & Vite',
      name: 'React Hooks - useEffect',
      explanation: 'useEffect handles side effects after render. Manages data fetching, subscriptions, timers.',
      keyPoints: [
        'useEffect runs after component renders',
        'Dependency array controls execution',
        'Empty array runs once on mount',
        'No array runs after every render',
        'Cleanup function prevents memory leaks',
        'Dependencies trigger re-execution'
      ],
      examples: [
        {
          title: 'useEffect Examples',
          code: `import { useState, useEffect } from "react";

// Run once on mount
function Profile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch("/api/users/" + userId)
      .then(r => r.json())
      .then(data => setUser(data));
  }, []);  // Empty dependency array
  
  return user ? <h1>{user.name}</h1> : <p>Loading...</p>;
}

// Run when dependency changes
function UserBio({ userId }) {
  const [bio, setBio] = useState("");
  
  useEffect(() => {
    fetch("/api/users/" + userId + "/bio")
      .then(r => r.json())
      .then(data => setBio(data.bio));
  }, [userId]);  // Re-run when userId changes
  
  return <p>{bio}</p>;
}

// Cleanup function
function ChatConnection() {
  useEffect(() => {
    const connection = new WebSocket("ws://example.com");
    
    return () => {
      connection.close();  // Cleanup
    };
  }, []);
}`
        }
      ]
    },
    {
      id: 11,
      category: 'React & Vite',
      name: 'Working with APIs',
      explanation: 'Fetch data from servers using Fetch API. Handle responses, errors, and loading states.',
      keyPoints: [
        'Fetch API for HTTP requests',
        'Request methods: GET, POST, PUT, DELETE',
        'Response handling and parsing',
        'Error handling for failures',
        'Loading and error states',
        'Headers and authentication'
      ],
      examples: [
        {
          title: 'API Requests',
          code: `import { useState, useEffect } from "react";

// GET request
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch("/api/users")
      .then(r => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then(data => setUsers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// POST request
async function CreateUser() {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Alice", email: "alice@example.com" })
  });
  const data = await response.json();
  return data;
}`
        }
      ]
    },
    {
      id: 12,
      category: 'React & Vite',
      name: 'Component Composition',
      explanation: 'Build complex UIs from simple components. Props flow down, state lifts up.',
      keyPoints: [
        'Composition over inheritance',
        'Reusable component patterns',
        'Props pass data down',
        'State lifting for shared data',
        'Container vs presentational',
        'Compound components'
      ],
      examples: [
        {
          title: 'Component Patterns',
          code: `import { useState } from "react";

// Parent component
function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text }]);
  };
  
  const removeTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };
  
  return (
    <div>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} onRemove={removeTodo} />
    </div>
  );
}

// Child components
function TodoForm({ onAdd }) {
  const [input, setInput] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(input);
    setInput("");
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button>Add</button>
    </form>
  );
}

function TodoList({ todos, onRemove }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => onRemove(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}`
        }
      ]
    }
  ];

  return (
    <div className="theory-page">
      <div className="theory-header">
        <h1>📚 Theory & Concepts</h1>
        <p>Explore detailed explanations and code examples for each topic</p>
      </div>

      <div className="theory-container">
        {/* Sidebar with topics */}
        <div className="theory-sidebar">
          <div className="category-section">
            {['JavaScript Core', 'Advanced JavaScript', 'React & Vite'].map(category => (
              <div key={category} className="category">
                <h3>{category}</h3>
                <div className="topic-list">
                  {theoryTopics
                    .filter(topic => topic.category === category)
                    .map(topic => (
                      <button
                        key={topic.id}
                        className={`topic-btn ${selectedTopic?.id === topic.id ? 'active' : ''}`}
                        onClick={() => setSelectedTopic(topic)}
                      >
                        {topic.name}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="theory-content">
          {selectedTopic ? (
            <div className="topic-detail">
              <div className="topic-header">
                <h2>{selectedTopic.name}</h2>
                <span className="category-badge">{selectedTopic.category}</span>
              </div>

              {/* Explanation */}
              <section className="explanation-section">
                <h3>Overview</h3>
                <p className="explanation-text">{selectedTopic.explanation}</p>
              </section>

              {/* Key Points */}
              <section className="keypoints-section">
                <h3>Key Points</h3>
                <ul className="keypoints-list">
                  {selectedTopic.keyPoints.map((point, idx) => (
                    <li key={idx}>
                      <span className="point-icon">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Code Examples */}
              <section className="examples-section">
                <h3>Code Examples</h3>
                {selectedTopic.examples.map((example, idx) => (
                  <div key={idx} className="code-example">
                    <h4>{example.title}</h4>
                    <pre className="code-block">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                ))}
              </section>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📖</div>
              <h2>Select a Topic</h2>
              <p>Click on a topic from the left to view detailed explanations and code examples.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TheoryPage;
