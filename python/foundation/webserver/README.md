# webserver

The `webserver` package sets up a Quart webserver and executes it with
Hypercorn.

For the most part, we isolate Quart and Hypercorn to this package, as we have
bespoke higher-level abstractions for request processing. See the [rpc
package](../rpc) for those abstractions.

We run Hypercorn configured with a single worker. This is because we intend for
the webserver to scale out horizontally. To add more workers, start another
instance of Hypercorn. In other words, we control the number of workers at the
orchestration layer, not the service layer.
