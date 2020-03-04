import { NowRequest, NowResponse } from "@now/node";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async (req: NowRequest, res: NowResponse) => {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  });

  const page = await browser.newPage();
  await page.goto("https://example.com");
  const viewport = await page.viewport();
  await browser.close();
  res.json(viewport);
};
