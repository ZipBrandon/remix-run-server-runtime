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
import { matchRoutes } from 'react-router-dom';

// TODO: export/import from react-router-dom
function matchServerRoutes(routes, pathname) {
  let matches = matchRoutes(routes, pathname);
  if (!matches) return null;
  return matches.map(match => ({
    params: match.params,
    pathname: match.pathname,
    route: match.route
  }));
}

export { matchServerRoutes };
