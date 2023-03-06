import { expect, test } from "@playwright/test";
// we can't create tests asynchronously, thus using the sync-fetch lib
import fs from "fs";
import fetch from "sync-fetch";

// URL where Ladle is served
const url = "http://host.docker.internal:40855";

// fetch Ladle's meta file
// https://ladle.dev/docs/meta
const { stories } = fetch(`${url}/meta.json`).json() as { stories: string[] };

// remove snapshots that no longer correspond to a story
const storyDir = `${__dirname}/visual.spec.ts-snapshots`;
fs.readdirSync(storyDir).forEach(file => {
  const storyName = file.replace(/-linux.png$/, "");
  const fetchedStoryKeys = Object.keys(stories);
  if (!fetchedStoryKeys.includes(storyName)) {
    console.log(`Removed dangling visual snapshot: ${storyName}.`);
    fs.rmSync(`${storyDir}/${storyName}-linux.png`);
  }
});

// iterate through stories
Object.keys(stories).forEach(storyKey => {
  // create a test for each story
  test(`${storyKey} - compare snapshots`, async ({ page }) => {
    // navigate to the story
    await page.goto(`${url}/?story=${storyKey}&mode=preview`);
    // stories are code-splitted, wait for them to be loaded
    await page.waitForSelector("[data-storyloaded]");
    // take a screenshot and compare it with the baseline
    await expect(page).toHaveScreenshot(`${storyKey}.png`);
  });
});
