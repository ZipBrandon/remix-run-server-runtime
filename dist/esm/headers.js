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
import { splitCookiesString } from 'set-cookie-parser';

function getDocumentHeaders(build, matches, routeLoaderResponses, actionResponse) {
  return matches.reduce((parentHeaders, match, index) => {
    let routeModule = build.routes[match.route.id].module;
    let routeLoaderResponse = routeLoaderResponses[match.route.id];
    let loaderHeaders = routeLoaderResponse ? routeLoaderResponse.headers : new Headers();
    let actionHeaders = actionResponse ? actionResponse.headers : new Headers();
    let headers = new Headers(routeModule.headers ? typeof routeModule.headers === "function" ? routeModule.headers({
      loaderHeaders,
      parentHeaders,
      actionHeaders
    }) : routeModule.headers : undefined); // Automatically preserve Set-Cookie headers that were set either by the
    // loader or by a parent route.

    prependCookies(actionHeaders, headers);
    prependCookies(loaderHeaders, headers);
    prependCookies(parentHeaders, headers);
    return headers;
  }, new Headers());
}

function prependCookies(parentHeaders, childHeaders) {
  let parentSetCookieString = parentHeaders.get("Set-Cookie");

  if (parentSetCookieString) {
    let cookies = splitCookiesString(parentSetCookieString);
    cookies.forEach(cookie => {
      childHeaders.append("Set-Cookie", cookie);
    });
  }
}

export { getDocumentHeaders };
