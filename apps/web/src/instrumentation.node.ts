import { metrics, trace } from "@opentelemetry/api";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { HostMetrics } from "@opentelemetry/host-metrics";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { RuntimeNodeInstrumentation } from "@opentelemetry/instrumentation-runtime-node";
import {
  Resource,
  detectResourcesSync,
  envDetector,
  hostDetector,
  processDetector,
} from "@opentelemetry/resources";
import { MeterProvider } from "@opentelemetry/sdk-metrics";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  NodeTracerProvider,
} from "@opentelemetry/sdk-trace-node";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

const metricsEnabled = true;
const tracingEnabled = true;
const prometheusPort = 9464;

let meterProvider: MeterProvider | undefined = undefined;
let hostMetrics: HostMetrics | undefined = undefined;
let tracerProvider: NodeTracerProvider | undefined = undefined;

const detectedResources = detectResourcesSync({
  detectors: [envDetector, processDetector, hostDetector],
});

const customResources = new Resource({
  [ATTR_SERVICE_NAME]: process.env.npm_package_name,
  [ATTR_SERVICE_VERSION]: process.env.npm_package_version,
});

const resources = detectedResources.merge(customResources);

if (metricsEnabled) {
  const exporter = new PrometheusExporter({
    port: prometheusPort,
  });

  meterProvider = new MeterProvider({
    readers: [exporter],
    resource: resources,
  });

  metrics.setGlobalMeterProvider(meterProvider);

  hostMetrics = new HostMetrics({
    name: `next-app-metrics`,
    meterProvider,
  });
}

if (tracingEnabled) {
  tracerProvider = new NodeTracerProvider({
    resource: customResources,
    spanProcessors: [new BatchSpanProcessor(new ConsoleSpanExporter())],
  });
  tracerProvider.register();
  trace.setGlobalTracerProvider(tracerProvider);
}

const registerInstrumentationParam: {
  instrumentations: Array<HttpInstrumentation | RuntimeNodeInstrumentation>;
} = {
  instrumentations: [new HttpInstrumentation()],
};

if (meterProvider) {
  registerInstrumentationParam.instrumentations.push(
    new RuntimeNodeInstrumentation(),
  );
  registerInstrumentationParam["meterProvider"] = meterProvider;
}

if (tracerProvider) {
  registerInstrumentationParam["tracerProvider"] = tracerProvider;
}

registerInstrumentations(registerInstrumentationParam);

if (hostMetrics) {
  console.log(`Providing metrics on port ${prometheusPort}`);
  hostMetrics.start();
}
