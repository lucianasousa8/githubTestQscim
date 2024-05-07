const { KoaInstrumentation } = require("@opentelemetry/instrumentation-koa");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const { OTTracePropagator } = require("@opentelemetry/propagator-ot-trace");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { trace } = require("@opentelemetry/api");
const { tracingConfig } = require("./config");

function setupTracing(serviceName) {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  const headers = {};
  tracingConfig.headers?.forEach((item) => {
    headers[item.key] = item.value;
  });

  let exporter = new OTLPTraceExporter({
    url: tracingConfig.url,
    headers,
  });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  registerInstrumentations({
    instrumentations: [
      new KoaInstrumentation({
        requestHook: function (span, info) {
          span.setAttribute("http.method", info.context.request.method);
        },
      }),
      new HttpInstrumentation(),
    ],
    tracerProvider: provider,
  });

  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register({ propagator: new OTTracePropagator() });

  return trace.getTracer(serviceName);
}

module.exports = { setupTracing };
