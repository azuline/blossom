import { RPCErrors, RPCs, RPCSystemErrors } from "@codegen/rpc";
import { BlossomError, ErrorOptions } from "@foundation/errors/base";

const TRANSIENT_ERRORS: readonly (keyof RPCErrors)[] = [
  "NetworkError",
  "InternalServerError",
] as const;

export type PossibleRPCErrors<T extends keyof RPCs> =
  | RPCSystemErrors
  | RPCs[T]["errors"];

export type RPCErrorOptions<T extends keyof RPCs, E extends PossibleRPCErrors<T>> = ErrorOptions & {
  rpc: T;
  error: E;
  data: RPCErrors[E];
};

export class RPCError<T extends keyof RPCs, E extends PossibleRPCErrors<T>> extends BlossomError {
  rpc: RPCErrorOptions<T, E>["rpc"];

  error: RPCErrorOptions<T, E>["error"];

  data: RPCErrorOptions<T, E>["data"];

  constructor(message: string, options: RPCErrorOptions<T, E>) {
    super(message, options);
    this.rpc = options.rpc;
    this.error = options.error;
    this.data = options.data;
    this.transient = this.error != null && TRANSIENT_ERRORS.includes(this.error);
  }
}
