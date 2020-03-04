import { NowRequest, NowResponse } from "@now/node";
import * as chrome from "chrome-aws-lambda";
import * as puppeteer from "puppeteer-core";

export default async (request: NowRequest, response: NowResponse) => {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  });

  const page = await browser.newPage();
  await page.goto("https://www.example.com/", {
    waitUntil: "networkidle0"
  });

  const result = await page.evaluate(() => {
    const elements = document.getElementsByTagName("*");

    return [...elements]
      .filter(
        element =>
          ![
            "html",
            "head",
            "meta",
            "title",
            "link",
            "script",
            "style",
            "noscript"
          ].includes(element.tagName.toLowerCase())
      )
      .map(element => {
        const isFlexContainer = (element: Element) =>
          window.getComputedStyle(element).display === "flex" ||
          window.getComputedStyle(element).display === "inline-flex";

        const ancestors = (function getAncestors(
          element: Element,
          ancestors: Element[] = []
        ): Element[] {
          return element.parentElement === null ||
            element.parentElement.tagName.toLowerCase() === "html"
            ? ancestors
            : [element.parentElement, ...getAncestors(element.parentElement)];
        })(element);

        return {
          isFlexContainer: isFlexContainer(element),
          isFlexChild:
            element.parentElement !== null &&
            isFlexContainer(element.parentElement),
          isDistantFlexChild: ancestors.some(isFlexContainer),
          tag: element.tagName.toLowerCase()
        };
      });
  });

  await browser.close();

  response.json(result);
};
