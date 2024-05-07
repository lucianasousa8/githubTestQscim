const api = require("@opentelemetry/api");
const { tracingConfig } = require("./config");

function verifyTracing(tracer, ctx, name) {
  // blocking tracing if not enabled
  if (!tracingConfig.enabled) return;

  // blocking tracing if method not enabled
  if (!tracingConfig.methods.includes(ctx.request.method)) return;

  // blocking tracing if path not enabled
  if (
    !tracingConfig.paths.includes(ctx.request.path.toLowerCase().split("/")[1])
  )
    return;

  // creating an returning span
  return tracer.startSpan(name);
}

function endSpan(ctx, span, requestSpan) {
  if (![200, 201, 204].includes(ctx.response.status)) {
    span?.setStatus({
      code: api.SpanStatusCode.ERROR,
      message: `Error ${ctx.response.status} - ${ctx.response.body.detail}`,
    });
  } else {
    span?.setStatus({ code: api.SpanStatusCode.OK });
  }

  requestSpan?.end();
  span?.end();
}

module.exports = { verifyTracing, endSpan };
