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

var responses = require('./responses.js');

/**
 * An object of unknown type for route loaders and actions provided by the
 * server's `getLoadContext()` function.
 */

async function callRouteAction({
  loadContext,
  match,
  request
}) {
  let action = match.route.module.action;

  if (!action) {
    let response = new Response(null, {
      status: 405
    });
    response.headers.set("X-Remix-Catch", "yes");
    return response;
  }

  let result;

  try {
    result = await action({
      request: stripDataParam(stripIndexParam(request)),
      context: loadContext,
      params: match.params
    });
  } catch (error) {
    if (!responses.isResponse(error)) {
      throw error;
    }

    if (!responses.isRedirectResponse(error)) {
      error.headers.set("X-Remix-Catch", "yes");
    }

    result = error;
  }

  if (result === undefined) {
    throw new Error(`You defined an action for route "${match.route.id}" but didn't return ` + `anything from your \`action\` function. Please return a value or \`null\`.`);
  }

  return responses.isResponse(result) ? result : responses.json(result);
}
async function callRouteLoader({
  loadContext,
  match,
  request
}) {
  let loader = match.route.module.loader;

  if (!loader) {
    throw new Error(`You made a ${request.method} request to ${request.url} but did not provide ` + `a default component or \`loader\` for route "${match.route.id}", ` + `so there is no way to handle the request.`);
  }

  let result;

  try {
    result = await loader({
      request: stripDataParam(stripIndexParam(request)),
      context: loadContext,
      params: match.params
    });
  } catch (error) {
    if (!responses.isResponse(error)) {
      throw error;
    }

    if (!responses.isRedirectResponse(error)) {
      error.headers.set("X-Remix-Catch", "yes");
    }

    result = error;
  }

  if (result === undefined) {
    throw new Error(`You defined a loader for route "${match.route.id}" but didn't return ` + `anything from your \`loader\` function. Please return a value or \`null\`.`);
  }

  return responses.isResponse(result) ? result : responses.json(result);
}

function stripIndexParam(request) {
  let url = new URL(request.url);
  let indexValues = url.searchParams.getAll("index");
  url.searchParams.delete("index");
  let indexValuesToKeep = [];

  for (let indexValue of indexValues) {
    if (indexValue) {
      indexValuesToKeep.push(indexValue);
    }
  }

  for (let toKeep of indexValuesToKeep) {
    url.searchParams.append("index", toKeep);
  }

  return new Request(url.href, request);
}

function stripDataParam(request) {
  let url = new URL(request.url);
  url.searchParams.delete("_data");
  return new Request(url.href, request);
}

function extractData(response) {
  let contentType = response.headers.get("Content-Type");

  if (contentType && /\bapplication\/json\b/.test(contentType)) {
    return response.json();
  } // What other data types do we need to handle here? What other kinds of
  // responses are people going to be returning from their loaders?
  // - application/x-www-form-urlencoded ?
  // - multipart/form-data ?
  // - binary (audio/video) ?


  return response.text();
}

exports.callRouteAction = callRouteAction;
exports.callRouteLoader = callRouteLoader;
exports.extractData = extractData;
