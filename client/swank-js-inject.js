/*
 * Add this script to your html file to connect to swank-js
 */

if (!window.exports)
  window.exports = {}; // FIXME: this may break something

if (!window.swank_server)
  window.swank_server = getSwankServerAddress();

function getSwankServerAddress () {
    var scripts = document.getElementsByTagName("script");
    var swankUrls = Array.prototype.map.call(scripts, function(script) {
        return script.src;
    }).filter(function (href) {
        return /swank-js/.test(href);
    });

    if (swankUrls) {
        var swank_url = swankUrls[0];
        return swank_url.substr(0, swank_url.indexOf("swank-js"));
    }
    //use current page address when not found swank-js script
    return document.location.protocol + "//" + document.location.host + "/";
}

function load(url, requirement) {
  if (requirement) {
    var fulfilled = requirement.call(window);
    if (!fulfilled) {
      window.setTimeout(function() { load(url, requirement); }, 100);
      return;
    }
  }
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', swank_server + url);
  document.head = document.head || document.getElementsByTagName('head')[0];
  document.head.appendChild(script);
}

function loadTests() {
  var query = document.location.toString().split("?")[1];
  return query && query.match(/swank-js-tests/);
}

load("swank-js/json2.js");
load("socket.io/socket.io.js");
load("swank-js/stacktrace.js");
load("swank-js/swank-js.js", function () { return !!window.io; });
load("swank-js/completion.js");
// TBD: test in IE
load("swank-js/load.js", function () { return !!window.SwankJS && !!window.Completion && document.body; });

if (loadTests()) {
  load("swank-js/browser-tests.js", function() { return window.SwankJS && window.Completion; });
}
