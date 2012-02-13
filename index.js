var path = require('path');
var universe = require('universe');
var YAML = require('libyaml');
var ccconfig = require('c-c-config');


exports.version = require('./package.json').version;
const CONFIG_VERSION = 1;


// YAMLverse configuration applies process wide. Here, we try to find existing
// configuration. (And bail if the config version differs.)
var config;
if (config = process._yamlverse) {
    if (config.version !== CONFIG_VERSION)
        throw new Error("Incompatible versions of yamlverse are loaded");
}
else {
    config = process._yamlverse = {
        version: CONFIG_VERSION,
        tags: []
    };
}


// Read a config file.
module.exports = exports = function(basename, defaults) {
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

    if (!data) {
        if (defaults)
            return defaults;
        else
            throw new Error("Config file '" + basename + "' does not exist");
    }

    return ccconfig(config.tags, defaults || {}, data[0]);
};


// Tags setting.
Object.defineProperty(exports, 'tags', {
    get: function() {
        return config.tags;
    },
    set: function(value) {
        if (value == null) {
            config.tags = [];
        }
        else if (value.length == null) {
            var re = /([\w-]+)/g;
            var input = String(value);
            var tags = config.tags = [];
            var match;
            while (match = re.exec(input))
                tags.push(match[1]);
        }
        else {
            config.tags = value;
        }
    }
});
