import { NowRequest, NowResponse } from "@now/node";
import chrome, { defaultViewport } from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export default async (request: NowRequest, response: NowResponse) => {
  const url = request.query.url.toString();

  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless
  });

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0"
  });

  await page.evaluate(() => {
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
      .forEach(element => {
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

        if (
          !isFlexContainer(element) &&
          element.parentElement !== null &&
          !isFlexContainer(element.parentElement) &&
          !ancestors.some(isFlexContainer)
        ) {
          element.setAttribute("style", "border: 3px solid lightgreen");
        }
      });
  });

  const file = await page.screenshot({ fullPage: true, type: "jpeg" });
  response.statusCode = 200;
  response.setHeader("Content-Type", "image/jpeg");
  response.end(file);

  await browser.close();
};
