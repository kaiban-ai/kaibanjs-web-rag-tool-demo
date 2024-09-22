import { Agent, Task, Team } from 'kaibanjs';

import { WebRAGTool } from './WebRAGTool';

const webRAGTool = new WebRAGTool({
    url: 'https://react.dev/',
});

// Define the Documentation Analyst Agent
const docAnalystAgent = new Agent({
    name: 'Riley',
    role: 'Documentation Analyst',
    goal: 'Analyze and summarize key sections of React documentation',
    background: 'Expert in software development and technical documentation',
    tools: [webRAGTool], // Include the WebRAGTool in the agent's tools
});

// Define the Developer Advocate Agent
const devAdvocateAgent = new Agent({
    name: 'Jordan',
    role: 'Developer Advocate',
    goal: 'Provide detailed examples and best practices based on the summarized documentation',
    background: 'Skilled in advocating and teaching React technologies',
    tools: [],
});

// Define Tasks
const analysisTask = new Task({
    title: 'Documentation Analysis',
    description: 'Analyze the React documentation sections related to {topic}',
    expectedOutput: 'A summary of key features and updates in the React documentation on the given topic',
    agent: docAnalystAgent,
});

const exampleTask = new Task({
    title: 'Example Development',
    description: 'Provide a detailed explanation of the analyzed documentation',
    expectedOutput: 'A detailed guide with examples and best practices in Markdown format',
    agent: devAdvocateAgent,
});

// Create the Team
const reactDevTeam = new Team({
    name: 'AI React Development Team',
    agents: [docAnalystAgent, devAdvocateAgent],
    tasks: [analysisTask, exampleTask],
    env: { OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY }
});

export { reactDevTeam };