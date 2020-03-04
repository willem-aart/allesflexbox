import React, { useState, useEffect } from "react";
import { createGlobalStyle, css } from "styled-components";

type ApiResult = {
  isFlexContainer: boolean;
  isFlexChild: boolean;
  isDistantFlexChild: boolean;
  tag: string;
}[];

const GlobalStyle = createGlobalStyle`${css`
  body {
    font-family: "Comic Sans MS";
    background-color: #1f243e;
    color: #fff;
  }

  input {
    font-size: 1rem;
    padding: 1rem;
  }

  button {
    font-size: 1rem;
    padding: 1rem;
    background-color: orange;
  }

  dt {
    font-weight: bold;
  }

  dd {
    margin-bottom: 1rem;
  }
`}`;

export default () => {
  const [formUrl, setFormUrl] = useState<string>("");
  const [resultsUrl, setResultsUrl] = useState<string>();
  const [results, setResults] = useState<ApiResult>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setResults(undefined);

    if (resultsUrl === undefined) return;

    setIsLoading(true);
    fetch(`/api/allesflexbox?url=${resultsUrl}`)
      .then(res => res.json())
      .then(json => {
        setIsLoading(false);
        setResults(json);
      });
  }, [resultsUrl]);

  return (
    <>
      <GlobalStyle />

      <h1>yo yo yo, alles flexbox?</h1>

      <h2 style={{ fontWeight: "normal" }}>
        check <em>hoe flexbox</em> een site is:
      </h2>

      <form
        style={{ marginBottom: "3rem" }}
        onSubmit={e => {
          e.preventDefault();
          setResultsUrl(formUrl);
        }}
      >
        <input
          style={{ width: "60%" }}
          placeholder="URL"
          value={formUrl}
          onChange={e => {
            setFormUrl(e.target.value);
          }}
        />
        <button>alles flexbox?</button>
      </form>

      {isLoading && <p>aan 't laden ...</p>}

      {results && (
        <>
          <h2 style={{ fontWeight: "normal" }}>
            de resultaten voor {resultsUrl}:
          </h2>
          <dl>
            <dt>DOM-elementen</dt>
            <dd>{results.length} stuks</dd>

            <dt>flex containers</dt>
            <dd>
              {results.filter(element => element.isFlexContainer).length} stuks
              (
              {(
                (results.filter(element => element.isFlexContainer).length /
                  results.length) *
                100
              ).toFixed(2)}
              %)
            </dd>

            <dt>flex children</dt>
            <dd>
              {results.filter(element => element.isFlexChild).length} stuks (
              {(
                (results.filter(element => element.isFlexChild).length /
                  results.length) *
                100
              ).toFixed(2)}
              %)
            </dd>

            <dt>
              flex child <em>en</em> flex container{" "}
              <sup>de echte pareltjes ✨</sup>
            </dt>
            <dd>
              {
                results.filter(
                  element => element.isFlexChild && element.isFlexContainer
                ).length
              }{" "}
              stuks (
              {(
                (results.filter(
                  element => element.isFlexChild && element.isFlexContainer
                ).length /
                  results.length) *
                100
              ).toFixed(2)}
              %)
            </dd>

            <dt>indirecte flex children</dt>
            <dd>
              {results.filter(element => element.isDistantFlexChild).length}{" "}
              stuks (
              {(
                (results.filter(element => element.isDistantFlexChild).length /
                  results.length) *
                100
              ).toFixed(2)}
              %)
            </dd>

            <dt>
              <em>noch</em> flex child <em>noch</em> indirect flex child{" "}
              <em>noch</em> flex container <sup>boooo, optyfen gauw 🖕🏻</sup>
            </dt>
            <dd>
              {
                results.filter(
                  element =>
                    !element.isFlexChild &&
                    !element.isFlexContainer &&
                    !element.isDistantFlexChild
                ).length
              }{" "}
              stuks (
              {(
                (results.filter(
                  element =>
                    !element.isFlexChild &&
                    !element.isFlexContainer &&
                    !element.isDistantFlexChild
                ).length /
                  results.length) *
                100
              ).toFixed(2)}
              %)
            </dd>

            <dt>
              flex child <em>of</em> indirect flex child <em>of</em> flex
              container <sup>🥰</sup>
            </dt>
            <dd>
              {
                results.filter(
                  element =>
                    element.isFlexChild ||
                    element.isFlexContainer ||
                    element.isDistantFlexChild
                ).length
              }{" "}
              stuks (
              {(
                (results.filter(
                  element =>
                    element.isFlexChild ||
                    element.isFlexContainer ||
                    element.isDistantFlexChild
                ).length /
                  results.length) *
                100
              ).toFixed(2)}
              %)
            </dd>
          </dl>
        </>
      )}
    </>
  );
};
