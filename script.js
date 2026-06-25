// REACT FUNDAMENTALS - THEORY & BASICS

// 1. REACT UPDATES & RECONCILIATION
// - React updates the UI when state or props change
// - Reconciliation is the process React uses to update the DOM efficiently
// - It compares the current UI with the new UI and makes minimal changes

// 2. RENDER PHASE & COMMIT PHASE
// Render Phase:
// - React creates a new Virtual DOM tree
// - Compares it with the old Virtual DOM tree
// - Identifies what needs to change (diffing algorithm)
// - This phase is interruptible and doesn't affect the actual DOM

// Commit Phase:
// - React applies the changes to the Real DOM
// - This phase is synchronous and cannot be interrupted
// - Updates are batched for better performance

// 3. REAL DOM vs VIRTUAL DOM
// Real DOM:
// - Actual browser DOM elements
// - Slow to update and manipulate
// - Direct changes cause reflow and repaint

// Virtual DOM:
// - Lightweight JavaScript representation of Real DOM
// - Fast to create and compare
// - Changes are calculated in memory before updating Real DOM

// Old Virtual DOM vs New Virtual DOM:
// - Old Virtual DOM: Previous state of UI
// - New Virtual DOM: Updated state of UI after changes
// - React compares both to find differences (diffing)

// 4. DIFFING ALGORITHM (Inside Render Phase)
// - Compares elements by type and key
// - If element type changes, entire subtree is replaced
// - If element type is same, only attributes are updated
// - Uses keys to identify which items have changed, added, or removed
// - Optimizes by comparing level by level (breadth-first)

// ============================================================================
// DETAILED EXPLANATION WITH TREE EXAMPLES
// ============================================================================

// EXAMPLE SCENARIO: User clicks a button that changes a counter from 0 to 1
// Let's trace through the entire process step by step

// ----------------------------------------------------------------------------
// STEP 1: INITIAL STATE - REAL DOM TREE
// ----------------------------------------------------------------------------
// Real DOM (What's actually in the browser):
//
//        <div id="app">
//             |
//        <h1>Counter App</h1>
//             |
//        <p>Count: 0</p>
//             |
//        <button>Increment</button>

// ----------------------------------------------------------------------------
// STEP 2: OLD VIRTUAL DOM TREE (Before State Change)
// ----------------------------------------------------------------------------
// Old Virtual DOM (JavaScript object representation):
//
// {
//   type: 'div',
//   props: { id: 'app' },
//   children: [
//     {
//       type: 'h1',
//       props: {},
//       children: ['Counter App']
//     },
//     {
//       type: 'p',
//       props: {},
//       children: ['Count: 0']  // ← Current count is 0
//     },
//     {
//       type: 'button',
//       props: { onClick: handleClick },
//       children: ['Increment']
//     }
//   ]
// }

// ----------------------------------------------------------------------------
// STEP 3: USER INTERACTION - Button Click
// ----------------------------------------------------------------------------
// User clicks button → setState(1) is called → React triggers re-render

// ----------------------------------------------------------------------------
// STEP 4: NEW VIRTUAL DOM TREE (After State Change)
// ----------------------------------------------------------------------------
// New Virtual DOM (Created during Render Phase):
//
// {
//   type: 'div',
//   props: { id: 'app' },
//   children: [
//     {
//       type: 'h1',
//       props: {},
//       children: ['Counter App']  // ← Same, no change
//     },
//     {
//       type: 'p',
//       props: {},
//       children: ['Count: 1']  // ← CHANGED! Was 0, now 1
//     },
//     {
//       type: 'button',
//       props: { onClick: handleClick },
//       children: ['Increment']  // ← Same, no change
//     }
//   ]
// }

// ----------------------------------------------------------------------------
// STEP 5: DIFFING ALGORITHM - Comparing Old vs New Virtual DOM
// ----------------------------------------------------------------------------
// React compares trees level by level (breadth-first):
//
// Level 0: <div id="app">
//   Old: { type: 'div', props: { id: 'app' } }
//   New: { type: 'div', props: { id: 'app' } }
//   Result: ✓ Same type, same props → No change needed
//
// Level 1: Children of <div>
//   Child 1 - <h1>:
//     Old: { type: 'h1', children: ['Counter App'] }
//     New: { type: 'h1', children: ['Counter App'] }
//     Result: ✓ Same → No change needed
//
//   Child 2 - <p>:
//     Old: { type: 'p', children: ['Count: 0'] }
//     New: { type: 'p', children: ['Count: 1'] }
//     Result: ✗ Same type but DIFFERENT content → Mark for update
//
//   Child 3 - <button>:
//     Old: { type: 'button', children: ['Increment'] }
//     New: { type: 'button', children: ['Increment'] }
//     Result: ✓ Same → No change needed
//
// Diffing Output: Only <p> element's text content needs to be updated

// ----------------------------------------------------------------------------
// STEP 6A: STACK RECONCILIATION (Old Way - Before 2015)
// ----------------------------------------------------------------------------
// How Stack Reconciliation would process this:
//
// Call Stack (Synchronous, top-to-bottom):
// ┌─────────────────────────────────┐
// │ reconcile(<div>)                │ ← Start here
// │   ├─ reconcile(<h1>)            │ ← Process child 1
// │   ├─ reconcile(<p>)             │ ← Process child 2 (MUST FINISH)
// │   └─ reconcile(<button>)        │ ← Process child 3
// └─────────────────────────────────┘
//
// Problems with Stack:
// - Cannot pause: If this takes 100ms, browser is blocked for 100ms
// - No prioritization: User input must wait until reconciliation finishes
// - Recursive: Uses JavaScript call stack, can cause stack overflow
// - All-or-nothing: Must complete entire tree before committing
//
// Timeline:
// 0ms ────────────────────────────────────────────────────────────> 100ms
// [========== RECONCILIATION (BLOCKING) ==========][COMMIT]
//                                                   ↑
//                                    User tries to type here but UI is frozen

// ----------------------------------------------------------------------------
// STEP 6B: FIBER RECONCILIATION (New Way - After 2016)
// ----------------------------------------------------------------------------
// How Fiber Reconciliation processes this:
//
// Fiber Tree (Linked List Structure):
// Each node is a "Fiber" with pointers to child, sibling, and parent
//
// Fiber(<div>)
//   ↓ child
// Fiber(<h1>) → sibling → Fiber(<p>) → sibling → Fiber(<button>)
//   ↑ return              ↑ return              ↑ return
//   └─────────────────────┴─────────────────────┘
//
// Work Units (Can be paused and resumed):
// Unit 1: Process Fiber(<div>)     - Priority: Normal
// Unit 2: Process Fiber(<h1>)      - Priority: Normal
// Unit 3: Process Fiber(<p>)       - Priority: Normal (has update)
// Unit 4: Process Fiber(<button>)  - Priority: Normal
//
// Fiber Processing with Interruption:
// 0ms ──────────────────────────────────────────────────────────────> 100ms
// [Unit1][Unit2][PAUSE: User Input][Handle Input][Unit3][Unit4][COMMIT]
//                  ↑                    ↑
//                  User types           React pauses reconciliation,
//                                       handles input, then resumes
//
// Fiber Advantages:
// - Can pause: Yields to browser for high-priority tasks
// - Prioritization: User input processed immediately
// - Incremental: Work split into small units
// - Resumable: Can continue where it left off
// - Time-slicing: Uses requestIdleCallback for scheduling

// ----------------------------------------------------------------------------
// STEP 7: COMMIT PHASE - Applying Changes to Real DOM
// ----------------------------------------------------------------------------
// After reconciliation (Stack or Fiber), React commits changes:
//
// Changes to Apply (from diffing):
// - Update <p> element's text content from "Count: 0" to "Count: 1"
//
// Commit Phase Actions:
// 1. Get reference to <p> element in Real DOM
// 2. Update textContent: element.textContent = "Count: 1"
// 3. Browser repaints only the <p> element (not entire page)
//
// Final Real DOM (After Commit):
//
//        <div id="app">
//             |
//        <h1>Counter App</h1>
//             |
//        <p>Count: 1</p>  ← UPDATED!
//             |
//        <button>Increment</button>

// ----------------------------------------------------------------------------
// COMPLETE FLOW COMPARISON: STACK vs FIBER
// ----------------------------------------------------------------------------
//
// STACK RECONCILIATION FLOW:
// ┌──────────────────────────────────────────────────────────────────┐
// │ 1. User clicks button                                            │
// │ 2. setState(1) called                                            │
// │ 3. Create New Virtual DOM (synchronously)                        │
// │ 4. Diff Old vs New Virtual DOM (synchronously, cannot pause)    │
// │ 5. Build list of changes (synchronously)                         │
// │ 6. Commit changes to Real DOM (synchronously)                    │
// │ 7. Browser repaints                                              │
// └──────────────────────────────────────────────────────────────────┘
// Problem: Steps 3-6 block the main thread. If they take 100ms,
//          the UI is frozen for 100ms. User input is delayed.
//
// FIBER RECONCILIATION FLOW:
// ┌──────────────────────────────────────────────────────────────────┐
// │ 1. User clicks button                                            │
// │ 2. setState(1) called                                            │
// │ 3. Schedule work with priority                                   │
// │ 4. Create New Virtual DOM (in small chunks)                      │
// │    ├─ Process Fiber 1 (5ms)                                      │
// │    ├─ Check: Any high-priority work? No → Continue               │
// │    ├─ Process Fiber 2 (5ms)                                      │
// │    ├─ Check: Any high-priority work? Yes! → Pause                │
// │    ├─ Handle user input (10ms)                                   │
// │    ├─ Resume: Process Fiber 3 (5ms)                              │
// │    └─ Process Fiber 4 (5ms)                                      │
// │ 5. Diff complete, build change list                              │
// │ 6. Commit changes to Real DOM (synchronously, cannot pause)      │
// │ 7. Browser repaints                                              │
// └──────────────────────────────────────────────────────────────────┘
// Benefit: Steps 3-5 can be paused. User input handled immediately.
//          UI remains responsive even during heavy updates.

// ----------------------------------------------------------------------------
// COMPLEX EXAMPLE: List Update with Keys
// ----------------------------------------------------------------------------
//
// Old Virtual DOM:
// <ul>
//   <li key="1">Apple</li>
//   <li key="2">Banana</li>
//   <li key="3">Cherry</li>
// </ul>
//
// New Virtual DOM (User adds "Avocado" at position 1):
// <ul>
//   <li key="1">Apple</li>
//   <li key="4">Avocado</li>  ← NEW ITEM
//   <li key="2">Banana</li>
//   <li key="3">Cherry</li>
// </ul>
//
// Diffing with Keys:
// - key="1": Found in both → No change
// - key="4": Not in old → INSERT new element
// - key="2": Found in both → MOVE (was position 2, now position 3)
// - key="3": Found in both → MOVE (was position 3, now position 4)
//
// Without Keys (BAD):
// React would think:
// - Position 1: "Apple" → "Apple" (no change)
// - Position 2: "Banana" → "Avocado" (UPDATE text)
// - Position 3: "Cherry" → "Banana" (UPDATE text)
// - Position 4: Nothing → "Cherry" (INSERT)
// Result: 3 updates + 1 insert = INEFFICIENT!
//
// With Keys (GOOD):
// React knows:
// - key="1": Same position, same content → No change
// - key="4": New key → INSERT once
// - key="2" & key="3": Same content, just moved → MOVE (cheaper than update)
// Result: 1 insert + 2 moves = EFFICIENT!

// 5. RECONCILIATION: STACK (Before 2015) vs FIBER (After 2016)

// Stack Reconciliation (Before 2015):
// - Synchronous and recursive
// - Once started, cannot be interrupted
// - Processes entire component tree in one go
// - Could cause UI freezing for large updates
// - Used JavaScript call stack

// Fiber Reconciliation (After 2016):
// - Asynchronous and incremental
// - Can pause, resume, and prioritize work
// - Breaks work into small units (fibers)
// - Allows browser to handle high-priority tasks (user input, animations)
// - Uses linked list data structure instead of stack

// 6. WHY FIBER WAS INTRODUCED
// - Better user experience with smoother animations
// - Prevents UI blocking during heavy computations
// - Priority-based rendering (urgent updates first)
// - Ability to split rendering work across multiple frames
// - Support for concurrent features and Suspense
// - Improved performance for complex applications

// Key Differences Summary:
// Stack: Synchronous, blocking, all-or-nothing
// Fiber: Asynchronous, non-blocking, incremental, prioritized

// ============================================================================
// SUMMARY: THE COMPLETE REACT UPDATE CYCLE
// ============================================================================
//
// 1. TRIGGER: State/Props change
//    ↓
// 2. RENDER PHASE (Interruptible with Fiber):
//    - Create New Virtual DOM tree
//    - Diff Old Virtual DOM vs New Virtual DOM
//    - Identify changes (insertions, updates, deletions, moves)
//    - Build work-in-progress tree (Fiber nodes)
//    ↓
// 3. COMMIT PHASE (Synchronous, cannot interrupt):
//    - Apply changes to Real DOM
//    - Run useEffect cleanup functions
//    - Run useEffect callbacks
//    - Update refs
//    ↓
// 4. BROWSER: Repaints only changed elements
//
// Key Insight: Fiber makes step 2 non-blocking, allowing React to:
// - Pause work to handle user input
// - Prioritize urgent updates (user typing) over less urgent ones (data fetching)
// - Split work across multiple frames for smooth 60fps animations
// - Abandon work if it becomes irrelevant (component unmounts)







// important steps
import React from 'react';
console.log(React)