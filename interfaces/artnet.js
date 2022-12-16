import createDebug from "debug";
import dmxlib from "dmxnet";

const debug = createDebug("io:artnet");

const dmxnet = new dmxlib.dmxnet({
    verbose: 0,
    log: { level: "info" },
});

const universe0 = dmxnet.newSender({
    ip: "127.0.0.1", // "192.168.3.148"
    subnet: 0,
    universe: 0,
    net: 0,
});

universe0.reset();

export default universe0;
