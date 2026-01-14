<h1>POS Dashboard</h1>

<p>
  Point of Sale dashboard built with Vite, React, and Tailwind CSS. This project
  focuses on a clean, data-forward UI for daily operations, sales insights, and
  operational visibility.
</p>

<h2>Overview</h2>
<ul>
  <li>Responsive layout optimized for desktop and tablet use.</li>
  <li>Reusable UI components with consistent spacing and typography.</li>
  <li>Charts and summaries for quick sales insights.</li>
  <li>Configurable theme tokens for colors and typography.</li>
</ul>

<h2>Tech Stack</h2>
<ul>
  <li>Vite</li>
  <li>React</li>
  <li>Tailwind CSS</li>
  <li>React Router</li>
  <li>Recharts</li>
</ul>

<h2>Project Structure</h2>
<pre><code>/
├─ src/
│  ├─ components/    # Reusable UI building blocks
│  ├─ pages/         # Route-level screens
│  ├─ index.css      # Tailwind layers and theme utilities
│  └─ main.jsx       # App bootstrap
├─ index.html
├─ tailwind.config.js
├─ vite.config.js
└─ package.json
</code></pre>

<h2>Getting Started</h2>
<ol>
  <li>Install dependencies:</li>
</ol>
<pre><code>npm install
</code></pre>
<ol start="2">
  <li>Start the dev server:</li>
</ol>
<pre><code>npm run dev
</code></pre>

<h2>Build</h2>
<ol>
  <li>Create a production build:</li>
</ol>
<pre><code>npm run build
</code></pre>
<ol start="2">
  <li>Preview the production build:</li>
</ol>
<pre><code>npm run preview
</code></pre>

<h2>Styling Notes</h2>
<ul>
  <li>Custom colors and fonts live in <code>tailwind.config.js</code>.</li>
  <li>
    Global styles and component-level utilities are defined in
    <code>src/index.css</code>.
  </li>
</ul>

<h2>Gitflow</h2>
<p>We use a Gitflow-style workflow:</p>
<ul>
  <li><code>main</code>: production-ready releases only</li>
  <li><code>develop</code>: integration branch for ongoing work</li>
  <li>
    <code>feature/*</code>: new features branched from <code>develop</code>,
    merged back via PR
  </li>
  <li>
    <code>release/*</code>: stabilization branch for a release, merged to
    <code>main</code> and <code>develop</code>
  </li>
  <li>
    <code>hotfix/*</code>: urgent fixes branched from <code>main</code>, merged
    back to <code>main</code> and <code>develop</code>
  </li>
</ul>
<p>Branch rules:</p>
<ul>
  <li>Keep branches focused and short-lived.</li>
  <li>Use PRs for review and CI checks.</li>
  <li>Squash or rebase to keep history clean.</li>
</ul>

<h2>Team Members</h2>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>ID</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Member One</td>
      <td>ID-001</td>
    </tr>
    <tr>
      <td>Member Two</td>
      <td>ID-002</td>
    </tr>
    <tr>
      <td>Member Three</td>
      <td>ID-003</td>
    </tr>
  </tbody>
</table>
