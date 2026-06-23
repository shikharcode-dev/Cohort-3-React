
// REACT FUNDAMENTALS - What You Need to Know Before Starting

// 1. PREREQUISITES
// - JavaScript ES6+ knowledge (arrow functions, destructuring, spread operator, modules)
// - HTML & CSS basics
// - Understanding of DOM manipulation
// - Node.js and npm/yarn installed on your system

// 2. CORE CONCEPTS OF REACT

// A. COMPONENTS
// React apps are built using components - reusable, independent pieces of UI
// Two types: Function Components (modern) and Class Components (legacy)

// Function Component Example
const WelcomeComponent = () => {
  return <h1>Hello, React!</h1>;
};

// B. JSX (JavaScript XML)
// JSX allows you to write HTML-like syntax in JavaScript
// It gets compiled to React.createElement() calls
const jsxExample = <div className="container">Content here</div>;

// C. PROPS (Properties)
// Props are arguments passed to components (read-only)
const Greeting = (props) => {
  return <h1>Hello, {props.name}!</h1>;
};

// D. STATE
// State is data that changes over time in a component
// Use useState hook for function components
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

// E. HOOKS
// Hooks let you use state and other React features in function components
// Common hooks: useState, useEffect, useContext, useRef, useMemo, useCallback

// F. LIFECYCLE & EFFECTS
// useEffect hook handles side effects (API calls, subscriptions, timers)
import { useEffect } from 'react';

const DataFetcher = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // This runs after component mounts
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => setData(data));
    
    // Cleanup function (optional)
    return () => {
      // Cleanup code here
    };
  }, []); // Empty array means run once on mount
  
  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
};

// 3. ESSENTIAL SETUP STEPS

// A. Create React App (Traditional Method)
// npx create-react-app my-app
// cd my-app
// npm start

// B. Vite (Modern, Faster Alternative)
// npm create vite@latest my-app -- --template react
// cd my-app
// npm install
// npm run dev

// 4. PROJECT STRUCTURE
// my-app/
// ├── node_modules/
// ├── public/
// │   └── index.html
// ├── src/
// │   ├── App.js
// │   ├── index.js
// │   └── components/
// ├── package.json
// └── README.md

// 5. KEY PRINCIPLES

// A. ONE-WAY DATA FLOW
// Data flows from parent to child components via props

// B. VIRTUAL DOM
// React uses a virtual DOM for efficient updates
// Only changed elements are updated in the real DOM

// C. COMPONENT COMPOSITION
// Build complex UIs by combining smaller components
const App = () => {
  return (
    <div>
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

// 6. EVENT HANDLING
const ButtonExample = () => {
  const handleClick = (event) => {
    console.log('Button clicked!');
  };
  
  return <button onClick={handleClick}>Click Me</button>;
};

// 7. CONDITIONAL RENDERING
const ConditionalExample = ({ isLoggedIn }) => {
  return (
    <div>
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in</p>}
    </div>
  );
};

// 8. LISTS & KEYS
const ListExample = () => {
  const items = ['Apple', 'Banana', 'Orange'];
  
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

// 9. FORMS & CONTROLLED COMPONENTS
const FormExample = () => {
  const [inputValue, setInputValue] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', inputValue);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

// 10. IMPORTANT PACKAGES TO KNOW
// - react-router-dom: For routing/navigation
// - axios: For HTTP requests
// - styled-components or tailwindcss: For styling
// - redux or zustand: For state management
// - react-query: For server state management

// 11. BEST PRACTICES
// - Keep components small and focused
// - Use meaningful component and variable names
// - Avoid prop drilling (use Context API or state management)
// - Use keys properly in lists
// - Handle errors with Error Boundaries
// - Optimize performance with React.memo, useMemo, useCallback when needed