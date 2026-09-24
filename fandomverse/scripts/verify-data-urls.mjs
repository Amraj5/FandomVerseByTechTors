/**
 * Verifies that every remote asset referenced in src/data actually resolves.
 *
 *   npm run verify:data
 *
 * Two failure modes this catches, both invisible in the running app until a
 * visitor hits them:
 *
 *   1. Dead URLs. A 404 image renders as an empty box; a wrong YouTube ID
 *      renders as "Video unavailable". Neither throws. A guessed video ID is
 *      the single easiest way to ship a broken module.
 *   2. Missing licence credit. The images in this project come from Wikimedia
 *      Commons under CC BY-SA, which *requires* attribution. An image with no
 *      credit is a licence breach, not a style nit — so it fails here too.
 *
 * Entries deliberately awaiting a URL are marked `"urlStatus": "needsUrl"`,
 * and characters with no licensed image are reported as PENDING rather than
 * failures, so the script stays useful while the dataset is still filling in.
 *
 * Requests run one at a time. Firing them in parallel gets HTTP 429 from
 * Wikimedia and outright connection failures from YouTube — which look
 * identical to dead links unless you know to check, so don't "optimise" this
 * back into Promise.all().
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "src", "data");

// Wikimedia blocks unidentified clients, so send a real User-Agent
const UA = "FandomVerse-data-check/1.0 (student project; contact: site owner)";
const TIMEOUT_MS = 20000;
const GAP_MS = 350; // breather between requests to the same host

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const load = (file) => JSON.parse(readFileSync(join(dataDir, file), "utf8"));

/** HEAD the URL; some hosts reject HEAD, so fall back to a ranged GET. */
async function checkImage(url) {
  const opts = { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(TIMEOUT_MS) };
  try {
    const head = await fetch(url, { ...opts, method: "HEAD" });
    if (head.ok) return { ok: true, status: head.status };
    if (head.status === 405 || head.status === 501) {
      const get = await fetch(url, { ...opts, headers: { ...opts.headers, Range: "bytes=0-0" } });
      return { ok: get.ok, status: get.status };
    }
    return { ok: false, status: head.status };
  } catch (err) {
    return { ok: false, status: "network", detail: err.message };
  }
}

/** oEmbed is authoritative: a real, embeddable video returns JSON; anything else 404s. */
async function checkYouTube(id) {
  const url =
    "https://www.youtube.com/oembed?url=" +
    encodeURIComponent(`https://www.youtube.com/watch?v=${id}`) +
    "&format=json";
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return { ok: false, status: res.status };
    const body = await res.json();
    return { ok: true, status: 200, detail: `${body.author_name} — ${body.title}` };
  } catch (err) {
    return { ok: false, status: "network", detail: err.message };
  }
}

/** Retry transient failures. A 404 is final; a 429 or a dropped connection is not. */
async function withRetry(fn, attempts = 3) {
  let last;
  for (let i = 0; i < attempts; i += 1) {
    last = await fn();
    if (last.ok) return last;
    const transient = last.status === "network" || last.status === "timeout" || last.status === 429 || last.status >= 500;
    if (!transient) return last;
    await sleep(900 * (i + 1));
  }
  return last;
}

// --- collect everything worth checking ------------------------------------
const jobs = [];

for (const c of load("characters.json")) {
  if (c.image) jobs.push({ kind: "image", label: `character "${c.name}"`, url: c.image, credit: c.imageCredit });
  else jobs.push({ kind: "pending", label: `character "${c.name}"`, note: "no licensed image — UI should render a monogram fallback" });
}

for (const e of load("events.json")) {
  if (e.image) jobs.push({ kind: "image", label: `event "${e.title}"`, url: e.image, credit: e.imageCredit });
  else jobs.push({ kind: "pending", label: `event "${e.title}"`, note: "no image" });
}

for (const v of load("videos.json")) {
  if (v.youtubeId) jobs.push({ kind: "youtube", label: `video "${v.title}"`, id: v.youtubeId });
  else if (v.urlStatus === "needsUrl") jobs.push({ kind: "pending", label: `video "${v.title}"`, note: "awaiting a YouTube ID" });
  else jobs.push({ kind: "fail", label: `video "${v.title}"`, note: 'no youtubeId and urlStatus is not "needsUrl"' });
}

// --- run them, one at a time ---------------------------------------------
const results = [];
for (const [i, job] of jobs.entries()) {
  if (job.kind === "pending") results.push({ job, verdict: "PENDING", detail: job.note });
  else if (job.kind === "fail") results.push({ job, verdict: "FAIL", detail: job.note });
  else if (job.kind === "image") {
    const r = await withRetry(() => checkImage(job.url));
    // A remote image carrying a CC licence must be credited
    if (r.ok && !job.credit) {
      results.push({ job, verdict: "FAIL", detail: "resolves, but imageCredit is empty — CC BY-SA requires attribution" });
    } else if (r.ok) {
      results.push({ job, verdict: "PASS", detail: `HTTP ${r.status}` });
    } else if (r.status === 429) {
      // Rate limiting says "slow down", not "this URL is gone". Calling it a
      // failure would send you hunting for a replacement that isn't needed.
      results.push({ job, verdict: "UNKNOWN", detail: "host is rate limiting — URL neither confirmed nor disproven, re-run in a minute" });
    } else {
      results.push({
        job,
        verdict: "FAIL",
        detail: r.status === "network" ? `network error: ${r.detail}` : `HTTP ${r.status}`,
      });
    }
  } else {
    const r = await withRetry(() => checkYouTube(job.id));
    results.push({
      job,
      verdict: r.ok ? "PASS" : "FAIL",
      // Distinguish "the ID is wrong" from "we couldn't reach YouTube at all"
      detail: r.ok
        ? r.detail
        : r.status === "network"
          ? `could not reach YouTube (${r.detail}) — this is NOT proof the ID is bad`
          : `HTTP ${r.status} — ID is not embeddable or does not exist`,
    });
  }
  if (i < jobs.length - 1) await sleep(GAP_MS);
}

const order = { FAIL: 0, UNKNOWN: 1, PASS: 2, PENDING: 3 };
results.sort((a, b) => order[a.verdict] - order[b.verdict]);

for (const r of results) {
  console.log(`${r.verdict.padEnd(7)}  ${r.job.label}${r.detail ? `\n           ${r.detail}` : ""}`);
}

const count = (v) => results.filter((r) => r.verdict === v).length;
console.log(
  `\n${count("PASS")} passed, ${count("FAIL")} failed, ${count("UNKNOWN")} inconclusive, ${count("PENDING")} pending (${results.length} checked)`,
);

if (count("FAIL") > 0) {
  console.log("\nFix the FAILs above before shipping — each one is a broken frame in the UI.");
  process.exitCode = 1;
}
