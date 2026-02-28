require('dotenv').config({ path: './.env.local' });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Words to ignore during the overlap check
const stopWords = new Set(["a", "an", "the", "how", "to", "in", "on", "of", "for", "with", "and", "or", "is", "are", "basics", "essentials", "guide", "introduction", "mastering", "learning"]);

function getCoreKeywords(title) {
  return title.toLowerCase()
    .replace(/[^\w\s]/g, "") // remove symbols
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

async function cleanup() {
  console.log("Starting Library Audit...");
  const { data: posts } = await supabase.from('posts').select('id, title, created_at').order('created_at', { ascending: false });

  if (!posts) return;

  const toDelete = [];
  const seenKeywordSets = [];

  for (const post of posts) {
    const currentKeywords = getCoreKeywords(post.title);
    let isParaphrase = false;

    for (const seen of seenKeywordSets) {
      // Check how many words overlap
      const overlap = currentKeywords.filter(word => seen.has(word));
      
      // If more than 50% of the words are the same, it's a paraphrase
      const overlapPercentage = overlap.length / Math.max(currentKeywords.length, 1);
      
      if (overlapPercentage >= 0.5) {
        isParaphrase = true;
        break;
      }
    }

    if (isParaphrase) {
      toDelete.push(post.id);
      console.log(`🚩 Flagged as paraphrase: "${post.title}"`);
    } else {
      seenKeywordSets.push(new Set(currentKeywords));
    }
  }

  if (toDelete.length > 0) {
    console.log(`Deleting ${toDelete.length} paraphrased posts...`);
    const { error } = await supabase.from('posts').delete().in('id', toDelete);
    if (error) console.error("Error deleting:", error);
    else console.log("Cleanup complete!");
  } else {
    console.log("No paraphrased posts found.");
  }
}

cleanup();