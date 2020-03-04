import { NowRequest, NowResponse } from "@now/node";
import puppeteer from "puppeteer";

export default async (req: NowRequest, res: NowResponse) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://example.com");
  const viewport = await page.viewport();
  await browser.close();

  res.json(viewport);
};
