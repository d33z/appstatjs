AS = {
  fnLogs: {},
  nonameCount: 0,
  
  // Calls fn, logs start and end times
  call: function (_this, name) {
    if (!(typeof name === 'string')) {
      console && console.log("AS.call() expects to get a function name");
      return;
    }

    var logs = this.fnLogs;

    // Create log if needed
    !logs[name] && (logs[name] = {startTimes: [], endTimes: []});

    // Log start time
    name && (logs[name].startTimes.push(this.now()));

    // Grab function
    var nameChain = name.split(".");
    var fn = _this[nameChain[0]];
    for (var i = 1; i < nameChain.length; i++)
      fn = fn[nameChain[i]];

    // Call the function
    var args = Array.prototype.slice.call(arguments, 2);
    fn.apply(_this, args);

    // Log end time
    name && (logs[name].endTimes.push(this.now()));
  }, 

  // Current clocktime in ms
  now: function () {
    return (new Date()).getTime();
  },

  // Number of calls ever made
  getNumCalls: function (fn) {
    var name = typeof fn === 'function' ? fn.name : fn;
    var log = this.fnLogs[name];
    return log.startTimes.length;
  },

  // Time in ms from first call to most recent
  getLifetime: function (fn) {
    var name = typeof fn === 'function' ? fn.name : fn;
    var len = this.getNumCalls(name);
    var log = this.fnLogs[name];
    return log.startTimes[len-1] - log.startTimes[0];
  },

  // Average Calls/Second (cps)
  getMeanCPS: function (fn) {
    var name = typeof fn === 'function' ? fn.name : fn;
    var log = this.fnLogs[name];
    return 1000 * this.getNumCalls(name) / this.getLifetime(name);
  }
};

