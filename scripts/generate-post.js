require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const skillCategories = [
  // Creative & Artistic
  "Textile & Fiber Arts", "Visual Design & Illustration", "Narrative & Creative Writing", 
  "Music Theory & Performance", "Cinematography & Lighting", "Sculpture & Pottery",
  "Architectural Sketching", "Calligraphy & Typography",

  // Technology & Digital Mastery
  "Artificial Intelligence & Prompting", "Cybersecurity & Privacy", "Software Architecture", 
  "Data Science & Visualization", "Hardware Engineering & Robotics", "Game Design Mechanics", 
  "Digital Marketing Strategy", "Cloud Infrastructure", "Blockchain & Decentralized Systems",

  // Science & Discovery
  "Astrophysics & Space Observation", "Microbiology & Genetics", "Environmental Science", 
  "Physics & Quantum Logic", "Botany & Plant Biology", "Marine Biology", 
  "Geology & Mineralogy", "Theoretical Mathematics",

  // Hands-on Craft & Trade
  "Fine Woodworking", "Traditional Blacksmithing", "Modern Electronics Repair", 
  "Automotive Engineering", "Leatherworking", "Clockmaking & Horology", 
  "Glassblowing", "Interior Design & Spatial Planning",

  // Nature & Self-Reliance
  "Permaculture & Sustainable Farming", "Wilderness Survival & Tracking", "Navigation & Cartography", 
  "Herbalism & Apothecary", "Beekeeping & Entomology", "Meteorology & Weather Reading", 
  "Off-Grid Energy Systems", "Disaster Preparedness",

  // Health & Human Performance
  "Sports Science & Biomechanics", "Nutrition & Culinary Chemistry", "Mental Resilience & Psychology", 
  "First Aid & Wilderness Medicine", "Yoga & Mobility Science", "Neuroscience Basics", 
  "Public Health & Epidemiology",

  // Business, Law & Society
  "Financial Literacy & Investing", "Microeconomics & Global Trade", "Legal Reasoning & Law", 
  "Project Management", "Entrepreneurial Strategy", "Public Speaking & Rhetoric", 
  "Philosophy & Ethics", "Sociological Research", "Linguistics & Language Structure",

  // Household & Life Skills
  "Culinary Arts & Pastry", "Modern Home Economics", "Clothing Repair & Tailoring", 
  "Furniture Restoration", "Personal Organization Systems", "Urban Gardening", 
  "Plumbing & Electrical Basics", "Bicycle Maintenance"
];

async function generateSkillTree() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    // 1. Fetch history to avoid repeats
    const { data: recent } = await supabase.from('posts').select('title').limit(20);
    const pastTitles = recent?.map(p => p.title).join(", ") || "None";
    const category = skillCategories[Math.floor(Math.random() * skillCategories.length)];

    // 2. Brainstorm a specific niche skill
    const topicPrompt = `Select a very specific, factual, and useful skill to learn within the category of ${category}. 
    It must be something specific (e.g., 'Identifying Edible Mushrooms' instead of 'Nature'). 
    Avoid these previous skills: [${pastTitles}]. Return only the name of the skill.`;
    
    const topicRes = await model.generateContent(topicPrompt);
    const skillName = topicRes.response.text().trim();

    console.log(`Generating Roadmap for: ${skillName}`);

    // 3. Generate the Roadmap
    const prompt = `
      You are a Senior Curriculum Architect. Create a literal, factual, and easy-to-understand learning roadmap for: "${skillName}".
      
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