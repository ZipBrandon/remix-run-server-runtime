/**
 * @remix-run/server-runtime v1.6.8
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// must be a type since this is a subtype of response
// interfaces must conform to the types they extend

/**
 * This is a shortcut for creating `application/json` responses. Converts `data`
 * to JSON and sets the `Content-Type` header.
 *
 * @see https://remix.run/api/remix#json
 */
const json = (data, init = {}) => {
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  let headers = new Headers(responseInit.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }

  return new Response(JSON.stringify(data), { ...responseInit,
    headers
  });
};

/**
 * A redirect response. Sets the status code and the `Location` header.
 * Defaults to "302 Found".
 *
 * @see https://remix.run/api/remix#redirect
 */
const redirect = (url, init = 302) => {
  let responseInit = init;

  if (typeof responseInit === "number") {
    responseInit = {
      status: responseInit
    };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }

  let headers = new Headers(responseInit.headers);
  headers.set("Location", url);
  return new Response(null, { ...responseInit,
    headers
  });
};
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
const redirectStatusCodes = new Set([301, 302, 303, 307, 308]);
function isRedirectResponse(response) {
  return redirectStatusCodes.has(response.status);
}
function isCatchResponse(response) {
  return response.headers.get("X-Remix-Catch") != null;
}

exports.isCatchResponse = isCatchResponse;
exports.isRedirectResponse = isRedirectResponse;
exports.isResponse = isResponse;
exports.json = json;
exports.redirect = redirect;
