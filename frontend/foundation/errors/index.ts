export type ErrorOptions = {
  cause?: Error;
  expected?: boolean;
  transient?: boolean;
};

/**
 * The base error class. All of our errors subclass from this. In this base error class,
 * we implement error chaining and store more metadata.
 */
export class BaseError extends Error {
  /**
   * If the error occurs during normal user interaction. For example, backend form
   * validation is expected to occasionally error. These errors should be caught and
   * handled in app.
   */
  expected: boolean;

  /**
   * If the error is due to a temporary problem on the client. For example, an error at
   * the network level. These errors are not actionable.
   */
  transient: boolean;

  /**
   * The error that caused of this error. This chains the caused error with the new
   * error.
   */
  cause: Error | undefined;

  constructor(message: string, options?: ErrorOptions) {
    super(message || "");

    this.transient = false;
    this.expected = false;
    this.cause = undefined;

    if (options !== undefined) {
      if (options.expected !== undefined) {
        this.expected = true;
      }
      if (options.transient !== undefined) {
        this.transient = true;
      }
      if (options.cause !== undefined) {
        this.cause = options.cause;
        // @ts-expect-error The cause error might not be a BaseError.
        if (this.cause.transient === true) {
          this.transient = true;
        }
      }
    }

    // captureStackTrace is not a standardized function; but it is present in some
    // implementations like V8 and Node.JS. If present, let's call it.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (Error.captureStackTrace != null) {
      Error.captureStackTrace(this, this.constructor);
    }

    if (this.stack != null && options?.cause?.stack != null) {
      this.stack = `${this.stack}\ncaused by:\n${options.cause.stack}`;
    }
  }
}
