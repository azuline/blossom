# rpc

The `rpc` package exposes frontend RPC executors for interacting with backend
state.

## Executors

The `rpc` package exposes three types of executors. These represent three
different ways to interact with server RPCs.

1. Imperative: These are similar to `fetch`, suitable to be used in callbacks
   for mutations.
   ```
   const onClick = () => {
     const resp = await rpc("Login", req);
   };
   ```
2. Jotai: These allow for the creation of Jotai atoms from RPC data. These are
   suitable for fetching server state, especially server state that depends on
   other Jotai atoms.
   ```
   const pageLoadAtom = rpcAtom("GetBunnies", { color: "rocky-road" });
   const pageLoadAtom2 = rpcAtom("GetBunnies", (get) => ({ color: get(bunnyColorAtom) }));
   ```
3. Hook: These allow for fetching server state via a react hook, suitable for
   cases where Jotai cannot be used.
   ```
   const useCustomHook = () => {
     const { data, status } = useRPC("GetBunnies", { color: "rocky-road" });
   };
   ```

Under the hood, both Jotai and Hook executors use Tanstack Query.

## RPC Types

The `@codegen/rpc` package contains code generated types for the RPC endpoints.
This package consumes those types to create type-safe RPC executors.

Each RPC executor takes in an RPC Name and its arguments. The type of the
arguments is determined by the name of the RPC that's passed in.

## Error Handling

Since RPCs operate over the network boundary, RPC failures are an
inevitability.

All RPC errors are an instance of the `RPCError` error class. The `RPCError`
class' data indicates the RPC that it originated from as well as the specific
error that was raised.

The code generated types for RPC executors restrict the possible errors to
those declared by the backend for that specific RPC.

The exact method with which an error is returned depends on the executor:

1. Imperative: The return value of `rpc` is either the response data or an
   error. Both must be handled in order for TypeScript to pass.
   ```
   const onClick = () => {
     const resp = await rpc("Login", req);
     if (resp instanceof RPCError) {
       ...
     }
   };
   ```
2. Jotai: Any errors that occur in these atoms will be thrown to the nearest
   error boundary. The user messaging and potential retry should be handled at
   the error boundary.
3. Hook: The return value of the hook contains a possible `error` field as a
   key. This field should be pulled, checked, and handled. Prefer to handle
   expected error cases via special return values and UIs. For unexpected
   cases, throw the error to the nearest error boundary.
   ```
   const useCustomHook = () => {
     const { data, status, error } = useRPC("GetBunnies", { color: "rocky-road" });
     if (error !== undefined) {
       if (error.error === "BunnyOverflow") {
         return { bunnies: Infinity };
       }
       // Unexpected error; throw it to error boundary.
       throw error;
     }
   };
   ```
