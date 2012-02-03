var path = require('path');
var universe = require('universe');
var YAML = require('libyaml');
var ccconfig = require('c-c-config');


// Keep a cache for processed config files.
var cache = {};


// Read a config file.
module.exports = exports = function(basename, defaults) {
    var data = cache[basename];
    if (data == null) {
        var filename = universe.configPath(basename + '.yml');
        if (!path.existsSync(filename)) {
            filename = universe.configPath(basename + '.yaml');
            if (!path.existsSync(filename)) {
                filename = null;
            }
        }

        if (filename)
            data = YAML.readFileSync(filename);
        else
            data = false;

        cache[basename] = data;
    }

    if (!data) {
        if (defaults)
            return defaults;
        else
            throw new Error("Config file '" + basename + "' does not exist");
    }

    return ccconfig(tags, defaults || {}, data[0]);
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
