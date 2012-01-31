var path = require('path');
var universe = require('universe');
var YAML = require('libyaml');
var ccconfig = require('c-c-config');


// Keep a cache for processed config files.
var cache = {};


// Read a config file.
module.exports = exports = function(basename) {
    var cached;
    if (cached = cache[basename])
        return cached;

    var filename = path.resolve(universe.config, basename + '.yml');
    if (!path.existsSync(filename)) {
        filename = path.resolve(universe.config, basename + '.yaml');
        if (!path.existsSync(filename)) {
            var errMsg = "Config file '" + basename + "' does not exist";
            throw new Error(errMsg);
        }
    }

    var data = YAML.readFileSync(filename);
    var retval = cache[basename] = ccconfig(tags, data[0]);
    return retval;
};


// Tags setting.
var tags = [];
Object.defineProperty(exports, 'tags', {
    get: function() {
        return tags;
    },
    set: function(value) {
        if (value == null) {
            tags = [];
        }
        else if (value.length == null) {
            var re = /([\w-]+)/g;
            var input = String(value);
            tags = [];
            var match;
            while (match = re.exec(input))
                tags.push(match[1]);
        }
        else {
            tags = value;
        }
    }
});


// Clear the cache. Should be used when rereading the configuration or
// changing tags on the fly.
exports.clearCache = function() {
    cache = {};
};
