require('dotenv').config({ path: './.env.local' });
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

    const category = skillCategories[Math.floor(Math.random() * skillCategories.length)];

    // 2. Fetch TARGETED memory (Only same category + very recent)
    const { data: sameCategory } = await supabase
      .from('posts').select('title').eq('category', category).limit(40);
    const { data: globalRecent } = await supabase
      .from('posts').select('title').order('created_at', { ascending: false }).limit(20);

    const contextTitles = [...new Set([
      ...(sameCategory?.map(p => p.title) || []),
      ...(globalRecent?.map(p => p.title) || [])
    ])].join(" | ");

    // 2. THE "FORBIDDEN LIST" PROMPT
    const topicPrompt = `
      You are the "Master Curriculum Architect" for a prestigious, multi-disciplinary academy. 
      Your goal is to identify a highly specific, factual, and intellectually stimulating skill.

      --- CURRENT DEPARTMENT ---
      Category: ${category}

      --- PREVIOUSLY ARCHIVED SKILLS (DO NOT REPEAT) ---
      [${contextTitles}]

      --- MANDATORY CONSTRAINTS ---
      1. NO KEYWORD OVERLAP: The new skill name must not share any significant nouns or verbs with the archived skills.
      2. BE LITERAL & FACTUAL: No poetic or vague titles (e.g., avoid "Whispers of the Stars").
      3. BE SPECIFIC: Instead of "Gardening," choose "Cultivating Medicinal Fungi in Temperate Climates."
      4. AVOID THE GENERIC: Stay away from "Introduction to...", "Mastering...", or "The Basics of...". 
      5. ARCHIVAL DEPTH: Look for skills involving traditional crafts, specific scientific methods, obscure historical arts, or niche technical mastery.

      --- OUTPUT ---
      Return ONLY the name of the skill as a concise, high-level title. No punctuation or introductory text.
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
