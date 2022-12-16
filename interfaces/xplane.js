import createDebug from "debug";
import XPlaneLegacyClient from "@shiari/xplane-node-udp-client";

const debug = createDebug("io:xplane");
const xplane = new XPlaneLegacyClient({
  host: "192.168.188.20",
  debug: true,
});

export default xplane;

