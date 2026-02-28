require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const skillCategories = [
  "Creative & Artistic",

  "Technology & Digital Mastery",

  "Science & Discovery",

  "Hands-on Craft & Trade",

  "Nature & Self-Reliance",

  "Health & Human Performance",

  "Business, Law & Society",
  

  "Household & Life Skills"
];

// scripts/generate-post.js

async function generateSkillTree() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const { data: allPosts } = await supabase
      .from('posts')
      .select('title');
    
    const existingTitles = allPosts?.map(p => p.title).join(", ") || "None";

    // 2. THE "FORBIDDEN LIST" PROMPT
    const topicPrompt = `
      You are a curator for a world-class library. 
      Target Category: ${category}.
      
      CRITICAL RULE: You must NOT write about anything even remotely similar to these existing titles:
      [${existingTitles}]
      
      Task: Find a niche, factual skill that has ZERO keyword overlap with the list above. 
      Think of obscure, highly specific, or unique skills.
      Return ONLY the name of the new skill.
    `;
    
    
    
    const topicRes = await model.generateContent(topicPrompt);
    const skillName = topicRes.response.text().trim();

    console.log(`Generating Roadmap for: ${skillName}`);

    // 3. Generate the Roadmap
    const prompt = `
      You are a Senior Curriculum Architect. Create a literal, factual, and easy-to-understand learning roadmap for: "${skillName}".
      EDITORIAL GUIDELINES:
        - Concept: It must be a distinct branch of knowledge.
        - Vocabulary: Use specific terminology unique to this craft.
        - Perspective: If a similar topic exists, approach this from a completely different angle (e.g., if you wrote about 'Woodworking', write this about 'Restoring 18th Century French Marquetry').
      Output strictly in JSON format:
      {
        "title": "${skillName}",
        "description": "A 2-sentence objective overview of what this skill is.",
        "difficulty": "Beginner | Intermediate | Advanced",
        "time_estimate": "e.g., 2 weeks, 5 hours, 3 months",
        "tags": ["tag1", "tag2"],
        "steps": [
          { "step": 1, "task": "Name of task", "details": "Factual explanation of how to do it." },
          { "step": 2, "task": "Name of next task", "details": "Detailed instructions." }
        ]
      }
      Requirements:
      - At least 5 steps.
      - Tone: Factual, helpful, and literal. No poetic fluff.
    `;

    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text().replace(/```json/g, "").replace(/```/g, ""));

    // 4. Save to Supabase
    const { error } = await supabase.from('posts').insert([{
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      time_estimate: data.time_estimate,
      tags: data.tags,
      steps: data.steps,
      category: category,
      content: "" // We keep this for compatibility but use 'steps' column instead
    }]);

    if (error) throw error;
    console.log("Roadmap Saved Successfully!");

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

generateSkillTree();
