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
const storyDir = `/usr/app/stories/visualtest/snapshots`;
fs.readdirSync(storyDir).forEach(file => {
  const storyName = file.replace(/--(light|dark)-linux.png$/, "");
  const fetchedStoryKeys = Object.keys(stories);
  if (!fetchedStoryKeys.includes(storyName)) {
    // eslint-disable-next-line no-console
    console.log(`Removed dangling visual snapshot: ${file}.`);
    fs.rmSync(`${storyDir}/${file}`);
  }
});

test.use({ viewport: { width: 1920, height: 1080 } });

// Options for the screenshot.
const scrotOpts = {
  // This is a parameter for the underlying pixelmatch library. Extremely sensitive
  // to visual changes.
  threshold: 0,
  // Take a picture of the full scrolling page; do not cut off at screen size.
  fullPage: true,
  // Github Actions is a lil slow...
  timeout: 10000,
};

Object.keys(stories).forEach(storyKey => {
  // Take a picture of both light and dark modes.
  test(`${storyKey} - light - compare snapshots`, async ({ page }) => {
    await page.goto(`${url}/?story=${storyKey}&mode=preview`);
    // Stories are code-splitted; wait for them to load.
    await page.waitForSelector("[data-storyloaded]");
    await expect(page).toHaveScreenshot(`${storyKey}--light.png`, scrotOpts);
  });
  test(`${storyKey} - dark - compare snapshots`, async ({ page }) => {
    await page.goto(`${url}/?story=${storyKey}&mode=preview&theme=dark`);
    // Stories are code-splitted; wait for them to load.
    await page.waitForSelector("[data-storyloaded]");
    await expect(page).toHaveScreenshot(`${storyKey}--dark.png`, scrotOpts);
  });
});
