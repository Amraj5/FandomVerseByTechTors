/**
 * Routing check for the chatbot knowledge base.
 *
 *   npm run test:chatbot
 *
 * Chatbot.jsx picks a reply in two passes: it scores every topic rule's
 * keywords and keeps the highest, then checks whether an intent rule
 * ("recommend", "suggest") also fired. That logic lives inside the component,
 * so this script mirrors it — if you change routing in Chatbot.jsx, change
 * match() here too.
 *
 * It exists because the routing is easy to break silently: an overlapping
 * keyword ("manga" sitting on the anime rule) sends visitors to the wrong hub,
 * and nothing visibly errors.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dataFile = join(here, "..", "src", "data", "chatbotRules.json");
const data = JSON.parse(readFileSync(dataFile, "utf8"));

// --- mirror of processQuery() in src/components/Chatbot.jsx ---------------
const escapeRegex = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const scoreRule = (rule, q) =>
  rule.keywords.reduce((s, kw) => {
    const pattern = new RegExp(`\\b${escapeRegex(kw)}\\b`, "i");
    return pattern.test(q) ? s + kw.length : s;
  }, 0);

function match(q) {
  let bestTopic = null;
  let bestScore = 0;
  let intentRule = null;

  for (const rule of data.rules) {
    const score = scoreRule(rule, q);

    // Intent rules never win the topic on their own
    if (rule.intent) {
      if (score > 0 && !intentRule) intentRule = rule;
      continue;
    }

    if (score > bestScore) {
      bestScore = score;
      bestTopic = rule;
    }
  }

  if (bestTopic) {
    const usePick = Boolean(intentRule && bestTopic.featured);
    return usePick ? bestTopic.featured.linkUrl : bestTopic.linkUrl;
  }
  if (intentRule) return intentRule.linkUrl;
  return "(default)";
}
// --------------------------------------------------------------------------

// [query a visitor might type, linkUrl we expect back]
// null means "the rule deliberately has no link"
const cases = [
  ["manga", "/category/manga"],
  ["jjk", "/category/manga"],
  ["gojo", "/category/manga"],
  ["jujutsu kaisen", "/category/manga"],
  ["anime", "/category/anime"],
  ["demon slayer", "/category/anime"],
  ["best anime", "/category/anime"],
  ["elden ring", "/category/gaming"],
  ["movies", "/category/movies"],
  ["tv shows", "/category/tv-shows"],
  ["k-pop", "/category/k-pop"],
  ["comics", "/category/comics"],
  ["graphic novel", "/category/comics"],
  ["trending", "/"],
  ["how do i bookmark", null],
  ["do i need an account", null],
  ["merch", "/cart"],
  ["help", "/"],
  ["search", "/search"],
  ["character profiles", "/characters"],

  // "recommend a <topic>" must recommend FOR that topic. Before intent rules
  // were separated out, all of these returned the same generic pick.
  ["recommend a game", "/category/gaming"],
  ["recommend an anime", "/category/anime"],
  ["recommend a movie", "/category/movies"],
  ["recommend a manga", "/category/manga"],
  ["recommend a tv show", "/category/tv-shows"],
  ["suggest some k-pop", "/category/k-pop"],
  ["recommend a comic", "/category/comics"],
  // No topic named, so these fall back to the generic recommendation
  ["recommend me something", "/"],
  ["suggest something", "/"],
  ["what should i watch", "/"],

  // These must NOT match a category — guards against keyword bleed
  ["anime movie", "/category/anime"],
  ["showcase", "(default)"],
  ["what is this site", "(default)"],
];

let failed = 0;
for (const [query, expected] of cases) {
  const actual = match(query);
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  "${query}" -> ${actual}` +
      (ok ? "" : `   (expected ${expected})`),
  );
}

console.log(`\n${cases.length - failed}/${cases.length} passed`);
if (failed > 0) process.exitCode = 1;
