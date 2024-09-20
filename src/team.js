import { Agent, Task, Team } from 'kaibanjs';

import { WebRAGTool } from './tool';

const webRAGTool = new WebRAGTool({
    url: 'https://www.cnbc.com/finance/',
});

// Define the Financial Analyst Agent
const analystAgent = new Agent({
    name: 'Finley',
    role: 'Financial Analyst',
    goal: 'Research and summarize the latest financial news on a given topic',
    background: 'Expert in financial data analysis and market research',
    tools: [webRAGTool], // Include the WebRAGTool in the agent's tools
});

// Define the Market Strategist Agent
const strategistAgent = new Agent({
    name: 'Stella',
    role: 'Market Strategist',
    goal: 'Develop actionable insights and strategies based on provided information',
    background: 'Skilled in creating market strategies and investment recommendations',
    tools: [],
});

// Define Tasks
const researchTask = new Task({
    title: 'Financial News Research',
    description: 'Research the latest financial news on the topic: {topic}',
    expectedOutput: 'A summary of the latest financial news and key points on the given topic',
    agent: analystAgent,
});

const strategyTask = new Task({
    title: 'Market Strategy Development',
    description: 'Develop a market strategy for {topic} based on the provided research',
    expectedOutput: 'A detailed market strategy with actionable insights in Markdown format',
    agent: strategistAgent,
});

// Create the Team
const financeTeam = new Team({
    name: 'AI Financial Analysis Team',
    agents: [analystAgent, strategistAgent],
    tasks: [researchTask, strategyTask],
    env: { OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY }
});

export { financeTeam };