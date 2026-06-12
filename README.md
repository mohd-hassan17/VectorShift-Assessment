# VectorShift Frontend Technical Assessment
### Submitted by — Mohd Hassan

A fully functional AI pipeline builder built with React, ReactFlow, and FastAPI. Drag nodes onto the canvas, connect them, and submit to validate the pipeline structure.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, ReactFlow 11, Zustand |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | Python 3.10+, FastAPI, Uvicorn |
| Styling | Inline styles + CSS (no UI library) |

---

## Project Structure

```
root/
├── frontend/               # React application
│   ├── src/
│   │   ├── nodes/
│   │   │   ├── BaseNode.js       # Core node abstraction
│   │   │   ├── inputNode.js
│   │   │   ├── outputNode.js
│   │   │   ├── llmNode.js
│   │   │   ├── textNode.js       # Auto-resize + {{ var }} handles
│   │   │   ├── apiNode.js        # New node
│   │   │   ├── filterNode.js     # New node
│   │   │   ├── transformNode.js  # New node
│   │   │   ├── mergeNode.js      # New node
│   │   │   └── noteNode.js       # New node
│   │   ├── App.js
│   │   ├── ui.js                 # ReactFlow canvas
│   │   ├── toolbar.js            # Draggable node chips
│   │   ├── draggableNode.js
│   │   ├── submit.js             # Backend integration + modal
│   │   ├── store.js              # Zustand state
│   │   └── index.css
│   └── package.json
└── backend/
    └── main.py                   # FastAPI + DAG validation
```

---

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.10+
- pip

### 1. Clone the repository

```bash
git clone https://github.com/mohd-hassan17/VectorShift-Assessment.git
cd vectorshift-assessment
```

### 2. Start the Backend

```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```

Backend runs at → `http://127.0.0.1:8000`

### 3. Start the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at → `http://localhost:3000`

> Make sure both terminals are running simultaneously.

### 4. Environment Variables (Optional)

By default the frontend points to `http://127.0.0.1:8000`. To override:

```bash
# frontend/.env
REACT_APP_API_URL=http://127.0.0.1:8000
```

---

## What Was Built

### Part 1 — Node Abstraction

Created a `BaseNode` component that serves as the single source of truth for all nodes. Every node is defined by a simple config object:

```js
// After — 15 lines using BaseNode  Hello {{name}}, your scoreis {{score}}

export const APINode = ({ id, data }) => (
  <BaseNode
    id={id} data={data}
    title="API Request" icon="⚡" color="#34d399"
    handles={{
      inputs:  [{ id: `${id}-body` }],
      outputs: [{ id: `${id}-response` }],
    }}
    fields={[
      { key: 'url',    label: 'Endpoint URL', type: 'text' },
      { key: 'method', label: 'Method', type: 'select', options: ['GET','POST','PUT','DELETE'] },
    ]}
  />
);
```

**5 new nodes built:** API Request, Filter, Transform, Merge, Note

**BaseNode handles automatically:**
- Handle positioning and distribution
- Field rendering (text / select / textarea)
- Focus states with accent color glow
- Framer Motion entrance animation
- Selection state with border glow

---

### Part 2 — Styling

Built a unified dark design system inspired by Linear and Vercel, without any CSS framework:

- Dark canvas with radial gradient depth effect and visible dot grid
- Color-coded nodes — each type has its own accent color reflected in border, header, handles
- Framer Motion animations on node drop and entrance
- Animated dashed edges for active connections
- Consistent typography hierarchy and spacing
- Responsive toolbar with staggered chip animation
- Polished modal with backdrop blur for pipeline results

---

### Part 3 — Text Node Logic

Two features implemented in `textNode.js`:

**Auto-resize (width + height)**
```js
// Height: scrollHeight recalculated on every keystroke
useEffect(() => {
  taRef.current.style.height = 'auto';
  taRef.current.style.height = taRef.current.scrollHeight + 'px';
}, [text]);

// Width: calculated from longest line character count
const calcMinWidth = (text) => {
  const longest = Math.max(...text.split('\n').map(l => l.length));
  return Math.min(520, Math.max(240, longest * 7.8 + 56));
};
```

**Dynamic `{{ variable }}` Handles**
```js
// Valid JS variable name detection
const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
```

- Detects valid JavaScript variable names only
- One unique handle per variable — no duplicates
- Handles update in real time as the user types
- Handles are removed when variables are deleted
- Variable pills show below the textarea for quick reference

---

### Part 4 — Backend Integration

**Frontend (`submit.js`)**
- Sends `{ nodes, edges }` via `POST /pipelines/parse`
- Loading state with animated spinner
- Empty pipeline guard before sending
- Error state with backend connection hint
- Success modal with node count, edge count, and DAG status

**Backend (`main.py`)**

DAG detection using **Kahn's Algorithm** (topological sort):

```python
def is_dag(nodes, edges):
    # Build adjacency list + in-degree map
    in_degree = {n.id: 0 for n in nodes}
    adj = {n.id: [] for n in nodes}

    for edge in edges:
        adj[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    # BFS from zero in-degree nodes
    queue = deque(nid for nid in in_degree if in_degree[nid] == 0)
    visited = 0
    while queue:
        node = queue.popleft()
        visited += 1
        for neighbour in adj[node]:
            in_degree[neighbour] -= 1
            if in_degree[neighbour] == 0:
                queue.append(neighbour)

    # If visited == total nodes, no cycle exists
    return visited == len(nodes)
```

Response format:
```json
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true
}
```

---

## Demo Scenarios

| Scenario | Expected Result |
|---|---|
| Empty canvas → Submit | Warning: "Add at least one node" |
| Input → LLM → Output | ✅ Valid DAG, 3 nodes, 2 edges |
| A → B → A (cycle) | ❌ Cycle Detected, Not a DAG |
| Text node with `{{name}} {{score}}` | 2 dynamic handles appear on left |

---

## Author

**Mohd Hassan**
Full Stack & GenAI Developer — Mumbai
GitHub: [@mohd-hassan17](https://github.com/mohd-hassan17)