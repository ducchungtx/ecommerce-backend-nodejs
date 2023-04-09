'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECOND = 5000;

// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Example maximums number of connections based on number of cores
    const maxConnections = numCores * 5;

    console.log(`Active connection:: ${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
      // notify.send -> send notify for the team
    }
  }, _SECOND); // monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
