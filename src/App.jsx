import { useState } from 'react'
import './App.css'
import DevUtils from './DevUtils';
import { reactDevTeam } from './team';
import ReactMarkdown from 'react-markdown';

function App() {
  // Setting up State
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [stats, setStats] = useState(null);

  // Connecting to the KaibanJS Store
  const useTeamStore = reactDevTeam.useStore();

  const {
    agents,
    tasks,
    teamWorkflowStatus
  } = useTeamStore(state => ({
    agents: state.agents,
    tasks: state.tasks,
    teamWorkflowStatus: state.teamWorkflowStatus
  }));

  const generateResult = async () => {
    setResult('');
    setStats(null);

    try {
      const output = await reactDevTeam.start({ topic });
      if (output.status === 'FINISHED') {
        setResult(output.result);

        const { costDetails, llmUsageStats, duration } = output.stats;
        setStats({
          duration: duration,
          totalTokenCount: llmUsageStats.inputTokens + llmUsageStats.outputTokens,
          totalCost: costDetails.totalCost
        });
      } else if (output.status === 'BLOCKED') {
        console.log(`Workflow is blocked, unable to complete`);
      }
    } catch (error) {
      console.error('Error generating blog post:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Website RAG Tool</h1>
      <div className="status">Status <span>{teamWorkflowStatus}</span></div>
      <div className="grid">
        <div className="column">
          <div className="options">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a React topic or question, e.g. 'What is React?'"
            />
            <button onClick={generateResult} disabled={topic === "" || teamWorkflowStatus === "RUNNING"}>
              Generate
            </button>
          </div>

          {/* Result */}
          <div className="result">
            {result ? (
              <ReactMarkdown>{result}</ReactMarkdown>
            ) : (
              <p className="result-info"><span>ℹ️</span><span>No results created yet</span><span>Please enter a React-related topic or question in the input box above and click 'Generate' to see the results here</span></p>
            )}
          </div>
        </div>

        {/* We'll add more UI elements in the next steps */}
        <div className="column">
          {/* Agents Here */}
          <h2 className="title">Agents</h2>
          <ul className="agent-list">
            {agents && agents.map((agent, index) => (
              <li key={index}>
                <img src={`https://ui-avatars.com/api/name=${encodeURIComponent(agent.name)}?background=3b82f6&color=fff`} alt={`${agent.name}'s avatar`} />
                <span>{agent.name}</span>
                <span>{agent.status}</span>
              </li>
            ))}
          </ul>

          {/* Tasks Here */}
          <h2 className="title">Tasks</h2>
          <ul className="task-list">
            {tasks && tasks.map((task, index) => (
              <li key={index}>
                <span>{task.title}</span>
                <span>{task.status}</span>
              </li>
            ))}
          </ul>

          {/* Stats Here */}
          <h2 className="title">Stats</h2>
          {stats ? (
            <div className="stats">
              <p>
                <span>Total Tokens: </span>
                <span>{stats.totalTokenCount}</span>
              </p>
              <p>
                <span>Total Cost: </span>
                <span>${stats.totalCost.toFixed(4)}</span>
              </p>
              <p>
                <span>Duration: </span>
                <span>{stats.duration} ms</span>
              </p>
            </div>
          ) : (
            <div className="stats"><p className="stats-info">ℹ️ No stats generated yet.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
