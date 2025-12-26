# Prompt for Building a Career Roadmap Service

**Context:**
We are building a service that provides detailed, interactive career roadmaps to users based on suggested career paths. We aim to leverage existing open resources where possible but will build a custom solution if necessary.

**Your Objective:**
Build a "Career Roadmap Service" that takes a career path (e.g., "Full Stack Developer", "AI Engineer") as input and returns a structured roadmap with learning resources.

## 1. Data Source Strategy
You must first evaluate the **roadmap.sh** API.
- **Check Availability:** Investigate if `roadmap.sh` offers a free, public API that returns the *content* of their roadmaps (nodes, connections, topics) in a machine-readable format (JSON).
- **Integration:** If available and open, consume this API directly to source the roadmap data.
- **Fallback (Build Our Own):** If the API is restricted, paid-only, or strictly for their own platform's user data, you must **build a custom roadmap generation engine**.
    - This engine should use an LLM (Large Language Model) to generate a Directed Acyclic Graph (DAG) for a given career path.
    - **Schema:** Define a strictly typed JSON schema for roadmaps (e.g., `nodes`, `edges`, `metadata`).

## 2. Core Features (The "Must-Haves")
- **Detailed Roadmaps:** The roadmap must not just be a list; it should be a branching path showing dependencies (e.g., "Learn HTML" -> "Learn CSS").
- **Course Linking:** This is critical. For *every node/topic* in the roadmap, the service must provide links to relevant, high-quality courses or resources.
    - **Sources:** Udemy, Coursera, YouTube, FreeCodeCamp, etc.
    - **Implementation:** You might need to use a search API (e.g., YouTube Data API, Google Custom Search) or a curated database to map topics to URLs dynamically.
- **Interactive Visualization:** The frontend should display this as an interactive graph (recommended: `React Flow` or `D3.js`), allowing users to click nodes to see resources.

## 3. Technical Implementation Guidelines
- **Backend:** Python (FastAPI) or Node.js.
    - Create an endpoint `GET /roadmap/{career_path}`.
    - If using the Fallback strategy, cache generated roadmaps to reduce latency and AI costs.
- **Frontend:** Next.js (match the existing project stack).
    - Create a page that visualizes the JSON response.
- **AI Integration (If Fallback used):**
    - Use a prompt designed to output valid JSON graph data.
    - Example structure:
      ```json
      {
        "nodes": [
          { "id": "1", "label": "Python Basics", "resources": ["url1", "url2"] },
          { "id": "2", "label": "Data Structures", "resources": ["url3"] }
        ],
        "edges": [
          { "from": "1", "to": "2" }
        ]
      }
      ```

## Summary of Immediate Next Steps for You
1.  **Verify roadmap.sh API**: limit check to 10 minutes. Use `curl` or documentation research.
2.  **Decide Path**: Integration vs. Generation.
3.  **Prototype**: Build the backend endpoint and a simple frontend visualizer.
4.  **Enrich**: Add the "Course Linking" logic (search/mapping).

Start by investigating the API availability.
