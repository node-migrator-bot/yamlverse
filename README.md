**YAMLverse** brings together [Universe], [YAML.node] and [c-c-config] to make
application configuration a snap. [![Build Status](https://secure.travis-ci.org/Two-Screen/yamlverse.png)](http://travis-ci.org/Two-Screen/yamlverse)

Usage is simple:

    var yamlverse = require('yamlverse');

    // Set some tags. Do this as early as possible.
    yamlverse.tags = "development";

    // Load a configuration file.
    var dbConfig = yamlverse('database');
    // Do something with dbConfig.

YAMLverse will look for files in the project's `config` directory. Files should
have the `.yml` or `.yaml` extension. Tags are in the same format as expected
by `c-c-config`.

YAMLverse caches read configuration files. To reload configuration:

    yamlverse.clearCache();

    // Reload the configuration file.
    dbConfig = yamlverse('database');
    // Reset state or check for changes in dbConfig.

 [Universe]: http://github.com/Two-Screen/universe
 [YAML.node]: http://github.com/stephank/yaml.node
 [c-c-config]: http://github.com/Two-Screen/c-c-config
