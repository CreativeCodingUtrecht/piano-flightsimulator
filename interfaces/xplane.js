import createDebug from "debug";
import XPlaneLegacyClient from "@shiari/xplane-node-udp-client";

const debug = createDebug("io:xplane");
const xplane = new XPlaneLegacyClient({
    host: "172.28.0.17",
    debug: true,
});

export default xplane;

