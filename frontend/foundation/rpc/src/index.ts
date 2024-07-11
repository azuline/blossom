import { RPCErrors, RPCMethods, RPCs } from "@codegen/rpc";
import { BaseError } from "@foundation/errors";
import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { Getter } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { useCallback } from "react";
import {
  PossibleRPCErrors,
  RPCError,
} from "./error";

export { type PossibleRPCErrors, RPCError };

// Vitest only works with absolute URLs. But the browser supports relative URLs.
export const baseURL = typeof process !== "undefined" && process.env.VITEST !== undefined
  ? "http://localhost:40851"
  : "";

/**
 * rpc executes an RPC request to the backend handler of the provided RPC name with the
 * given arguments.
 *
 * The function signature of rpc is a little unorthodox. It returns either the response
 * data or a request error.
 *
 * The intention is to guard against the incorrect-by-default nature of JavaScript error handling.
 * This setup requires the caller to refine the type down to the response type (e.g. with `resp
 * instanceof RPCError`) in order to use the response data.
 */
export const rpc = async <T extends keyof RPCs>(
  name: T,
  args: RPCs[T]["in"],
): Promise<RPCs[T]["out"] | RPCError<T, PossibleRPCErrors<T>>> => {
  try {
    return await baseRPCExecutor(name, args);
  } catch (e) {
    return e as RPCError<T, PossibleRPCErrors<T>>;
  }
};

type UseRPC<T extends keyof RPCs> = ReturnType<
  typeof useQuery<
    RPCs[T]["out"],
    RPCError<T, PossibleRPCErrors<T>>,
    RPCs[T]["out"],
    [T, RPCs[T]["in"]]
  >
>;

type UseRPCOptions<T extends keyof RPCs> = UseQueryOptions<
  RPCs[T]["out"],
  RPCError<T, PossibleRPCErrors<T>>,
  RPCs[T]["out"],
  [T, RPCs[T]["in"]]
>;

/**
 * useRPC is a facade over TanStack Query with superior bindings and inference for the
 * RPC system.
 */
export const useRPC = <T extends keyof RPCs>(
  rpcName: T,
  args: RPCs[T]["in"],
  options?: UseRPCOptions<T>,
): UseRPC<T> => {
  return useQuery<
    RPCs[T]["out"],
    RPCError<T, PossibleRPCErrors<T>>,
    RPCs[T]["out"],
    [T, RPCs[T]["in"]]
  >({ queryKey: [rpcName, args], queryFn: ({ queryKey }) => baseRPCExecutor(queryKey[0], queryKey[1]), ...options });
};

type RPCAtom<T extends keyof RPCs> = ReturnType<
  typeof atomWithQuery<
    RPCs[T]["out"],
    RPCError<T, PossibleRPCErrors<T>>,
    RPCs[T]["out"],
    [T, RPCs[T]["in"]]
  >
>;

/**
 * rpcAtom allows for rpc calls to be made as a part of Jotai's state management.
 * The resulting atom is intended to be used with Suspense for error handling and
 * loading.
 */
export const rpcAtom = <T extends keyof RPCs>(
  rpcName: T,
  // This looks a little tricky, but what we're doing is making the getArgs argument
  // only available if the RPC has input data. If the RPC doesn't have input data, then
  // we only take one parameter, the RPC name.
  ...getArgs: RPCs[T]["in"] extends null ? [] : [(get: Getter) => RPCs[T]["in"]]
): RPCAtom<T> => {
  const atom = atomWithQuery<
    RPCs[T]["out"],
    RPCError<T, PossibleRPCErrors<T>>,
    RPCs[T]["out"],
    [T, RPCs[T]["in"]]
  >(get => ({
    queryKey: [rpcName, getArgs[0]?.(get) ?? null],
    queryFn: async ({ queryKey }) => {
      const res = await baseRPCExecutor(queryKey[0], queryKey[1]);
      return res;
    },
  }));
  return atom;
};

export const useRefetchRPC = <T extends keyof RPCs>(): (
  rpcName: T,
  args?: RPCs[T]["in"],
) => Promise<void> => {
  const queryClient = useQueryClient();

  return useCallback(async (rpcName, args): Promise<void> => {
    if (args === undefined) {
      // This is akin to a prefix match--invalidates all queries with a cache key that
      // start with rpcName.
      await queryClient.invalidateQueries({ queryKey: [rpcName] });
    } else {
      await queryClient.invalidateQueries({ queryKey: [rpcName, args] });
    }
  }, [queryClient]);
};

const baseRPCExecutor = async <
  T extends keyof RPCs,
  E extends PossibleRPCErrors<T> = PossibleRPCErrors<T>,
>(
  name: T,
  args: RPCs[T]["in"],
): Promise<RPCs[T]["out"]> => {
  const method = RPCMethods[name];

  let url = `${baseURL}/api/${name}`;
  let body: string | undefined;
  if (args != null) {
    if (method === "GET") {
      const params = new URLSearchParams();
      Object.entries(args).forEach(([k, v]) => v != null && params.append(k, v.toString()));
      url += `?${params.toString()}`;
    } else {
      body = JSON.stringify(args);
    }
  }

  let response;
  let text;
  try {
    response = await fetch(url, {
      method,
      cache: "no-store",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body,
    });
    text = await response.text();
  } catch (e) {
    if (e instanceof TypeError) {
      // The Promise returned from fetch() won't reject on HTTP error status even if the
      // response is an HTTP 404 or 500. Instead, as soon as the server responds with
      // headers, the Promise will resolve normally (with the ok property of the response
      // set to false if the response isn't in the range 200–299).
      // The request will only reject on network failure or if anything prevented the
      // request from completing.
      throw new RPCError<T, "NetworkError">(`Network error: ${e.message}`, {
        rpc: name,
        error: "NetworkError",
        cause: e,
        data: null,
      });
    }
    throw new BaseError("Unknown error from fetch", { cause: e as Error });
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new RPCError<T, "ClientJSONDecodeError">("Failed to decode JSON.", {
      rpc: name,
      error: "ClientJSONDecodeError",
      cause: e as Error,
      data: null,
    });
  }

  if (response.ok) {
    return data as RPCs[T]["out"];
  }

  if (response.status === 404) {
    throw new RPCError<T, "RPCNotFoundError">(`Unknown RPC ${name}`, {
      rpc: name,
      error: "RPCNotFoundError",
      data: null,
    });
  }
  if (response.status === 500) {
    throw new RPCError<T, "InternalServerError">(text, {
      rpc: name,
      error: "InternalServerError",
      data: null,
    });
  }

  const errorData = data as { error: E; data: RPCErrors[E] };

  if (response.status === 400 && errorData?.error !== undefined) {
    throw new RPCError<T, E>(errorData.error ?? `RPC Error in ${name}`, {
      rpc: name,
      error: errorData.error,
      data: errorData.data,
    });
  }

  // If we still haven't classified the error, throw an Uncaught RPC error.
  throw new RPCError<T, "UncaughtRPCError">(errorData?.error ?? "Uncaught RPC error", {
    rpc: name,
    error: "UncaughtRPCError",
    data: null,
  });
};
