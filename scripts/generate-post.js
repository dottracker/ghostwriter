require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const topics = ["Future Tech", "Global Economy", "Philosophy", "Arts", "Science", "Mental Health", "History"];

async function generate() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    console.log(`Asking Gemini to write about: ${topic}...`);
    
    const prompt = `Write a unique, insightful blog post about ${topic}. 
    Return ONLY a JSON object with keys: "title" (string) and "content" (string, in Markdown). 
    Do not use markdown code blocks like \`\`\`json in the output.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const article = JSON.parse(text);

    const { error } = await supabase.from('posts').insert([
      { title: article.title, content: article.content, category: topic }
    ]);

    if (error) console.error("DB Error:", error);
    else console.log("Success! Saved:", article.title);

  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

generate();
