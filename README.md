# Research and Content Generation Project with WebRAGTool

This project implements a **Retrieval Augmented Generation** (RAG) system using the [kaibanjs](https://www.kaibanjs.com/) library and natural language processing tools. The goal is to create teams of agents that collaborate on research and content generation tasks, leveraging up-to-date information from the web.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-project.git
   cd your-project
   ```

2. **Install dependencies:**

   Ensure you have `node` and `npm` installed on your system.

   ```bash
   npm install
   ```

## Configuration

Before running the project, you need to configure the necessary environment variables:

1. **Environment Variables:**

   Create a `.env` file in the root directory of the project and add your OpenAI API key:

   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

## Project Structure

- `tool.js`: Implementation of `WebRAGTool`, a tool for dynamically retrieving and processing web content.
- `team.js`: Definition of the Financial Analysis Team.

## Dependencies

- **Node.js** and **npm**
- **kaibanjs**: Main library for creating agents and teams.
- **langchain**: Used for natural language processing and chain creation.
- **OpenAI API**: For utilizing advanced language models.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).