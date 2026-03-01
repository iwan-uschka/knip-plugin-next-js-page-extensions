export const register = async () => {
  const metricsEnabled = true;
  const tracingEnabled = true;
  const metricsOrTracingEnabled = metricsEnabled || tracingEnabled;

  console.log({
    msg: `Metrics currently ${metricsEnabled ? "" : "not "}enabled (configurable via env var METRICS_ENABLED).`,
  });
  console.log({
    msg: `Tracing currently ${tracingEnabled ? "" : "not "}enabled (configurable via env var TRACING_ENABLED).`,
  });

  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (metricsOrTracingEnabled) {
      await import("./instrumentation.node");
    }
  }
};
