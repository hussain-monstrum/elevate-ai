import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export async function POST(req: Request) {
  const { message } = await req.json();

  const model = new ChatOpenAI({
    temperature: 0.7,
    openAIApiKey: process.env.OPEN_AI_API_KEY,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    new SystemMessage("You are a helpful AI assistant that provides concise and accurate answers."),
    new HumanMessage("{input}"),
  ]);
  const chain = prompt.pipe(model)


  async function runChain(){
    const result = await chain.invoke({ input: message });
    return result.content;
}
const res = await runChain();
return Response.json({ result: res });
}

