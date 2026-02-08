require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Broad categories to keep the blog diverse
const categories = ["Politics", "Arts", "Science", "Jobs", "Economy", "Technology", "Family", "Global Issues", "Philosophy"];

async function generate() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 1. FETCH RECENT HISTORY
    // We get the last 20 titles so Gemini knows what NOT to write about.
    const { data: recentPosts } = await supabase
      .from('posts')
      .select('title')
      .order('created_at', { ascending: false })
      .limit(20);

    const pastTitles = recentPosts?.map(p => p.title).join(", ") || "None yet";
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    console.log(`Step 1: Brainstorming a unique angle for ${randomCategory}...`);

    // 2. BRAINSTORM A UNIQUE TOPIC
    const brainstormPrompt = `
      You are an expert editorial director. We are writing a blog about ${randomCategory}.
      Here are the titles of the posts we have already published: [${pastTitles}].
      
      Your task: Invent a very specific, unique, and insightful "niche topic" within ${randomCategory} that is DIFFERENT from the ones above. 
      Avoid generic "Future of..." or "Basics of..." topics. Find a "weird" angle, a forgotten history, or a counter-intuitive theory.
      
      Return ONLY a single sentence that will be the specific topic/prompt for the next writer.
    `;

    const topicResult = await model.generateContent(brainstormPrompt);
    const nicheTopic = topicResult.response.text().trim();

    console.log(`Step 2: Writing the article about: "${nicheTopic}"...`);

    // 3. WRITE THE ACTUAL ARTICLE
    const writePrompt = `
      You are a world-class essayist. Write a deeply insightful blog post about this specific topic: "${nicheTopic}".
      
      Requirements:
      - Use a "Cottagecore/Rainy Day" intellectual tone (thoughtful, cozy, but brilliant).
      - Do not use cliches. 
      - Format the output strictly as a JSON object: {"title": "...", "content": "..."}
      FORMATTING INSTRUCTIONS:
        - Use Markdown for the content.
        - IMPORTANT: You MUST use exactly two newline characters (\\n\\n) between every paragraph to ensure clear spacing.
        - Use ## for subheadings if the post is long.
        - Ensure the title is poetic and catchy.
    `;

    const articleResult = await model.generateContent(writePrompt);
    const text = articleResult.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const article = JSON.parse(text);

    // 4. SAVE TO CLOUD
    const { error } = await supabase.from('posts').insert([
      { title: article.title, content: article.content, category: randomCategory }
    ]);

    if (error) throw error;
    console.log("Success! New unique post added:", article.title);

  } catch (e) {
    console.error("Error in generation:", e);
    process.exit(1);
  }
}

generate();