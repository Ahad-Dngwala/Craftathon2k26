// test_classify.js

import { FormData, File } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import fetch from "node-fetch";

const TEXT_CASES = [
  ["Normal message",                           "Hey can we meet at the park tomorrow at 3pm?"],
  ["Message with URLs",                        "Check this out https://suspicious-link.com and also www.another.com — meet me alone."],
  ["Threatening message",                      "If you tell anyone about this I will make sure you regret it."],
  ["Empty after URL removal (needs_review)",   "https://example.com"],
  ["Grooming-style message",                   "You are so mature for your age. Let us keep this between us, okay? Don't tell your parents."],
];

// Swap this path for any image in your test_images/ folder
const TEST_IMAGE_PATH = "../ai_service/test_images/1.jpeg";

async function runTest(label, text, imagePath = null) {
  const form = new FormData();
  form.set("text", text);

  if (imagePath) {
    const file = await fileFromPath(imagePath);
    form.set("image", file);
  }

  const res = await fetch("http://localhost:8000/classify", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    console.log(`--- ${label} ---`);
    console.log(`ERROR ${res.status}: ${JSON.stringify(err.detail)}`);
    console.log();
    return;
  }

  const data = await res.json();
  const nlp = data.signals?.nlp ?? {};

  console.log(`--- ${label}${imagePath ? " [+image]" : ""} ---`);
  console.log(`Input        : ${JSON.stringify(text)}`);
  console.log(`Cleaned text : ${JSON.stringify(data.cleaned_text)}`);
  console.log(`Extracted URLs: ${JSON.stringify(data.extracted_urls)}`);
  console.log(`Top label    : ${nlp.top_label ?? "n/a"}`);
  console.log(`Confidence   : ${nlp.confidence ?? "n/a"}`);
  console.log(`NLP risk     : ${nlp.risk_score ?? "n/a"}`);
  console.log(`Final risk   : ${data.final_risk_score}`);
  console.log(`All labels   :`);
  if (nlp.all_labels) {
    for (const [k, v] of Object.entries(nlp.all_labels)) {
      console.log(`  ${k.padEnd(25)}: ${v}`);
    }
  }
  console.log();
}

async function main() {
  console.log("Hitting http://localhost:8000/classify with test cases...\n");

  // Text-only cases
  for (const [label, text] of TEXT_CASES) {
    await runTest(label, text);
  }

  // Text + image case
  await runTest("Grooming-style message", TEXT_CASES[4][1], TEST_IMAGE_PATH);
}

main().catch(console.error);