/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as dailyLogs from "../dailyLogs.js";
import type * as friends from "../friends.js";
import type * as http from "../http.js";
import type * as meals from "../meals.js";
import type * as notes from "../notes.js";
import type * as userPreferences from "../userPreferences.js";
import type * as usernames from "../usernames.js";
import type * as water from "../water.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  dailyLogs: typeof dailyLogs;
  friends: typeof friends;
  http: typeof http;
  meals: typeof meals;
  notes: typeof notes;
  userPreferences: typeof userPreferences;
  usernames: typeof usernames;
  water: typeof water;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("../betterAuth/_generated/component.js").ComponentApi<"betterAuth">;
};
