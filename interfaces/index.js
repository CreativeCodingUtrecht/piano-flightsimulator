import xplane from "./xplane.js";
import artnet from "./artnet.js";
import osc from "./osc.js";

/* xPlane magic */

const xplaneSubscribe = (dataRef, callback, interval = 60) => {
  xplane.requestDataRef(
    //"sim/cockpit2/fuel/fuel_pump_on",
    dataRef,
    interval,
    callback
  );
};

const xplaneDebugDataRef = (updatedDataRef, updatedValue) => {
  console.log(`the dataref ${updatedDataRef} has value ${updatedValue}`);
};

const xplaneSend = (dataRef, value) => {
  xplane.setDataRef(dataRef, value);
};

/* OSC magic */

osc.on("message", (packet) => {
  handleMessage(packet);
});

osc.on("bundle", (bundle) => {
  for (let packet of bundle.packets) {
    handleMessage(packet);
  }
});

osc.on("error", (err) => {
  console.log("error", err);
});

const handleMessage = (packet) => {
  const { address, args } = packet;
  console.log(packet);

  switch (address) {
    case "/xplane/taxi_light":
      const value = args[0].value;
      xplaneSend("sim/cockpit/electrical/taxi_light_on", value);
      break;
  }
};

/*


 */

/* ArtNet magic */


/* Blackbox magic -- controls */

// Turn DMX on/off based on taxi light
const xplaneTaxiLight = () => (updatedDataRef, updatedValue) => {
  console.log(`the dataref ${updatedDataRef} has value ${updatedValue}`);

  const value = updatedValue * 255;
  const channel = 4; // white

  artnet.prepChannel(0, 255);
  artnet.prepChannel(7, 255);
  artnet.prepChannel(channel, value);
  artnet.transmit();
};

// Taxi lights
xplaneSubscribe("sim/cockpit/electrical/taxi_light_on", xplaneTaxiLight());

// Other 
// xplaneSubscribe("/sim/cockpit/electrical/beacon_lights_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/landing_lights_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/nav_lights_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/strobe_lights_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/cockpit_lights_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/avionics_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/battery_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit2/electrical/battery_on", xplaneDebugDataRef());


let taxi_light_on = false;
setInterval(() => {
  xplaneSend("sim/cockpit/electrical/taxi_light_on", taxi_light_on);
  taxi_light_on = !taxi_light_on;
}, 1000);
