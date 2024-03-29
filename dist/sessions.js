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

var cookies = require('./cookies.js');
var warnings = require('./warnings.js');

/**
 * An object of name/value pairs to be used in the session.
 */

function flash(name) {
  return `__flash_${name}__`;
}

/**
 * Creates a new Session object.
 *
 * Note: This function is typically not invoked directly by application code.
 * Instead, use a `SessionStorage` object's `getSession` method.
 *
 * @see https://remix.run/api/remix#createsession
 */
const createSession = (initialData = {}, id = "") => {
  let map = new Map(Object.entries(initialData));
  return {
    get id() {
      return id;
    },

    get data() {
      return Object.fromEntries(map);
    },

    has(name) {
      return map.has(name) || map.has(flash(name));
    },

    get(name) {
      if (map.has(name)) return map.get(name);
      let flashName = flash(name);

      if (map.has(flashName)) {
        let value = map.get(flashName);
        map.delete(flashName);
        return value;
      }

      return undefined;
    },

    set(name, value) {
      map.set(name, value);
    },

    flash(name, value) {
      map.set(flash(name), value);
    },

    unset(name) {
      map.delete(name);
    }

  };
};

/**
 * Returns true if an object is a Remix session.
 *
 * @see https://remix.run/api/remix#issession
 */
const isSession = object => {
  return object != null && typeof object.id === "string" && typeof object.data !== "undefined" && typeof object.has === "function" && typeof object.get === "function" && typeof object.set === "function" && typeof object.flash === "function" && typeof object.unset === "function";
};
/**
 * SessionStorage stores session data between HTTP requests and knows how to
 * parse and create cookies.
 *
 * A SessionStorage creates Session objects using a `Cookie` header as input.
 * Then, later it generates the `Set-Cookie` header to be used in the response.
 */

/**
 * Creates a SessionStorage object using a SessionIdStorageStrategy.
 *
 * Note: This is a low-level API that should only be used if none of the
 * existing session storage options meet your requirements.
 *
 * @see https://remix.run/api/remix#createsessionstorage
 */
const createSessionStorageFactory = createCookie => ({
  cookie: cookieArg,
  createData,
  readData,
  updateData,
  deleteData
}) => {
  let cookie = cookies.isCookie(cookieArg) ? cookieArg : createCookie((cookieArg === null || cookieArg === void 0 ? void 0 : cookieArg.name) || "__session", cookieArg);
  warnOnceAboutSigningSessionCookie(cookie);
  return {
    async getSession(cookieHeader, options) {
      let id = cookieHeader && (await cookie.parse(cookieHeader, options));
      let data = id && (await readData(id));
      return createSession(data || {}, id || "");
    },

    async commitSession(session, options) {
      let {
        id,
        data
      } = session;

      if (id) {
        await updateData(id, data, cookie.expires);
      } else {
        id = await createData(data, cookie.expires);
      }

      return cookie.serialize(id, options);
    },

    async destroySession(session, options) {
      await deleteData(session.id);
      return cookie.serialize("", { ...options,
        expires: new Date(0)
      });
    }

  };
};
function warnOnceAboutSigningSessionCookie(cookie) {
  warnings.warnOnce(cookie.isSigned, `The "${cookie.name}" cookie is not signed, but session cookies should be ` + `signed to prevent tampering on the client before they are sent back to the ` + `server. See https://remix.run/api/remix#signing-cookies ` + `for more information.`);
}

exports.createSession = createSession;
exports.createSessionStorageFactory = createSessionStorageFactory;
exports.isSession = isSession;
exports.warnOnceAboutSigningSessionCookie = warnOnceAboutSigningSessionCookie;
