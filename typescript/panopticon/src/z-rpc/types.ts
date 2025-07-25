/* Code generated by python/tools/codegen_rpc. DO NOT EDIT. */

import type { Dayjs } from "dayjs";

/**
 * All Errors
 */

export type RPCErrors = {
	InputValidationError: {
		message: string;
		fields: Record<string, unknown>;
	};
	ServerJSONDeserializeError: {
		message: string;
	};
	// These are errors that the frontend RPC executor can raise.
	ClientJSONDecodeError: null;
	InternalServerError: null;
	NetworkError: null;
	RPCNotFoundError: null;
	UncaughtRPCError: null;
};

/**
 * System Errors
 */

export type RPCSystemErrors =
	| "InputValidationError"
	| "ServerJSONDeserializeError"
	| "ClientJSONDecodeError"
	| "InternalServerError"
	| "NetworkError"
	| "RPCNotFoundError"
	| "UncaughtRPCError";

/**
 * Nested & Common
 */

/**
 * RPC I/O
 */

export type RPCs = {};

/**
 * RPC Methods
 */

export const RPCMethods: Record<keyof RPCs, "GET" | "POST"> = {};
