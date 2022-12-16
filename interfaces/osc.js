import osc  from "osc";

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  remoteAddress: "127.0.0.1",
  // remoteAddress: "172.20.10.15", // iPhone hotspot
  // remoteAddress: "172.20.3.255", // Broadcast Plat4mation Guest
  //   remoteAddress: "172.20.3.28", // Werner
  // remoteAddress: "10.0.1.255", // Nataraja
  // remoteAddress: "192.168.3.255", // Homeground
  //remotePort: 9500,
  localPort: 9500,
  broadcast: true,
  metadata: true,
});

udpPort.open();

udpPort.on("ready", () => {
  console.log("ready");
});

export default udpPort;
