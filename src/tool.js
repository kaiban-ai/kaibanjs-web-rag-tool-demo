import { Tool } from '@langchain/core/tools';
import 'cheerio';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

export class WebRAGTool extends Tool {
    constructor(fields) {
        super(fields);
        // Store the URL from which to fetch content
        this.url = fields.url;

        // Define the tool's name and description
        this.name = 'web_rag';
        this.description =
            'This tool implements Retrieval Augmented Generation (RAG) by dynamically fetching and processing web content from a specified URL to answer user queries. It leverages external web sources to provide enriched responses that go beyond static datasets, making it ideal for applications needing up-to-date information or context-specific data. To use this tool effectively, specify the target URL and query parameters, and it will retrieve relevant documents to generate concise, informed responses based on the latest content available online';

        // Define the schema for the input query using Zod for validation
        this.schema = z.object({
            query: z
                .string()
                .describe('The query for which to retrieve and generate answers.'),
        });
    }

    async _call(input) {
        try {
            // Step 1: Load Content from the Specified URL
            const loader = new CheerioWebBaseLoader(this.url);
            const docs = await loader.load();

            // Step 2: Split the Loaded Documents into Chunks
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });
            const splits = await textSplitter.splitDocuments(docs);

            // Step 3: Create a Vector Store from the Document Chunks
            const vectorStore = await MemoryVectorStore.fromDocuments(
                splits,
                new OpenAIEmbeddings({
                    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
                })
            );

            // Step 4: Initialize a Retriever
            const retriever = vectorStore.asRetriever();

            // Step 5: Define the Prompt Template for the Language Model
            const prompt = ChatPromptTemplate.fromTemplate(`
        You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
        Question: {question} 
        Context: {context} 
        Answer:`);

            // Step 6: Initialize the Language Model (LLM)
            const llm = new ChatOpenAI({
                model: 'gpt-4o-mini',
                apiKey: import.meta.env.VITE_OPENAI_API_KEY,
            });

            // Step 7: Create the RAG Chain
            const ragChain = await createStuffDocumentsChain({
                llm,
                prompt,
                outputParser: new StringOutputParser(),
            });

            // Step 8: Retrieve Relevant Documents Based on the User's Query
            const retrievedDocs = await retriever.invoke(input.query);

            // Step 9: Generate the Final Response
            const response = await ragChain.invoke({
                question: input.query,
                context: retrievedDocs,
            });

            // Step 10: Return the Generated Response
            return response;
        } catch (error) {
            // Log and rethrow any errors that occur during the process
            console.error('Error running the WebRAGTool:', error);
            throw error;
        }
    }
}
