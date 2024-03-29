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
// NOTE: make sure to change the Route in remix-react if you change this
// NOTE: make sure to change the EntryRoute in remix-react if you change this
function createRoutes(manifest, parentId) {
  return Object.entries(manifest).filter(([, route]) => route.parentId === parentId).map(([id, route]) => ({ ...route,
    children: createRoutes(manifest, id)
  }));
}

export { createRoutes };
