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

const xplaneSend = (dataRef, value) => {
  xplane.setDataRef(dataRef, value);
};

const xplaneDebugDataRef = (updatedDataRef, updatedValue) => {
  console.log(`the dataref ${updatedDataRef} has value ${updatedValue}`);
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

  let value;
  switch (address) {
    case "/xplane/taxi_light":
      value = args[0].value;
      xplaneSend("sim/cockpit/electrical/taxi_light_on", value);
      break;
    case "/xplane/throttle":
      value = args[0].value;
      xplaneSend("sim/cockpit2/engine/actuators/throttle_ratio_all", value);
      break;
    case "/xplane/pitch":
      value = args[0].value;
      xplaneSend("sim/cockpit2/controls/yoke_pitch_ratio", value);
      break;
    case "/xplane/roll":
      value = args[0].value;
      xplaneSend("sim/cockpit2/controls/yoke_roll_ratio", value);
      break;
    case "/xplane/heading":
      value = args[0].value;
      xplaneSend("sim/cockpit2/controls/yoke_heading_ratio", value);
      break;
    case "/xplane/parking_brake":
      value = args[0].value;
      xplaneSend("sim/cockpit2/controls/parking_brake_ratio", value);
      break;
    case "/xplane/motor_brake":
      value = args[0].value;
      xplaneSend("sim/cockpit2/controls/motor_brake_ratio", value);
      break;
    case "/xplane/aileron_trim":
      value = args[0].value;
      xplaneSend("sim/cockpit2/controls/aileron_trim", value);
      break;
    case "/xplane/elevator_trim":
      value = args[0].value;
      xplaneSend("sim/cockpit2/controls/elevator_trim", value);
      break;
    case "/xplane/rudder_trim":
      value = args[0].value;
      xplaneSend("sim/cockpit2/controls/rudder_trim", value);
      break;
    case "/xplane/ignition_on":
      value = args[0].value;
      xplaneSend("sim/cockpit2/engine/actuators/ignition_on", value);
      break;
    case "/xplane/igniter_on":
      value = args[0].value;
      xplaneSend("sim/cockpit2/engine/actuators/igniter_on", value);
      break;
    case "/xplane/ignition_key":
      value = args[0].value;
      xplaneSend("sim/cockpit2/engine/actuators/ignition_key", value);
      break;
    case "/MasterSwitch":
      value = args[0].value;
      xplaneSend("sim/cockpit/electrical/battery_on", value);
      /*

  "sim/cockpit2/electrical/battery_on": xplaneDebugDataRef(),
  "sim/cockpit/electrical/battery_on": xplaneDebugDataRef(),

      */
      break;
  }
};

/* ArtNet magic */

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

/* Blackbox magic -- controls */
// https://developer.x-plane.com/datarefs

const subscriptions = {
  "sim/cockpit/electrical/taxi_light_on": xplaneTaxiLight(),
  "sim/cockpit2/engine/actuators/throttle_ratio_all": xplaneDebugDataRef(),
  "sim/cockpit2/controls/yoke_pitch_ratio": xplaneDebugDataRef(),
  "sim/cockpit2/controls/yoke_roll_ratio": xplaneDebugDataRef(),
  "sim/cockpit2/controls/yoke_heading_ratio": xplaneDebugDataRef(),
  "sim/cockpit2/controls/parking_brake_ratio": xplaneDebugDataRef(),
  "sim/cockpit2/controls/speedbrake_ratio": xplaneDebugDataRef(),
  "sim/cockpit2/controls/aileron_trim": xplaneDebugDataRef(),
  "sim/cockpit2/controls/elevator_trim": xplaneDebugDataRef(),
  "sim/cockpit2/controls/rudder_trim": xplaneDebugDataRef(),
  "sim/cockpit2/engine/actuators/ignition_key": xplaneDebugDataRef(),
  "sim/cockpit2/engine/actuators/ignition_on": xplaneDebugDataRef(),
  "sim/cockpit2/engine/actuators/igniter_on": xplaneDebugDataRef(),
  "sim/cockpit2/electrical/battery_on": xplaneDebugDataRef(),
  "sim/cockpit/electrical/battery_on": xplaneDebugDataRef(),
};

// Create xPlane Dataref subscriptions
https: for (let dataRef in subscriptions) {
  const callback = subscriptions[dataRef];
  xplaneSubscribe(dataRef, callback);
}

// Other
// xplaneSubscribe("/sim/cockpit/electrical/beacon_lights_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/landing_lights_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/nav_lights_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/strobe_lights_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/cockpit_lights_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/avionics_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit/electrical/battery_on", xplaneDebugDataRef());
// xplaneSubscribe("/sim/cockpit2/electrical/battery_on", xplaneDebugDataRef());


// let taxi_light_on = false;
// setInterval(() => {
//   xplaneSend("sim/cockpit/electrical/taxi_light_on", taxi_light_on);
//   taxi_light_on = !taxi_light_on;
// }, 1000);


// let throttle = 0;
// setInterval(() => {
//   xplaneSend("sim/cockpit2/engine/actuators/throttle_ratio_all", throttle);
//   throttle = throttle == 0 ? 1 : 0;
// }, 1000);

// let pitch = -1;
// setInterval(() => {
//   xplaneSend("sim/cockpit2/controls/yoke_pitch_ratio", pitch);
//   pitch = pitch == -1 ? 1 : 1;
// }, 1000);


