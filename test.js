var fs = require('fs');
var path = require('path');
var test = require('tap').test;
var rimraf = require('rimraf');
var universe = require('universe');
var yamlverse = require('./');

var testDir = '/tmp/yamlverse-test';

test('basic config reading', function(t) {
    fs.mkdirSync(testDir, 0700);
    universe.root = testDir;

    var cfgPath = path.resolve(universe.config, 'foo.yml');
    fs.writeFileSync(cfgPath, 'dev: { three: 3 }');

    yamlverse.tags = "dev";
    t.equal(yamlverse('foo').three, 3,
        'config data should match what was hand-written');
    t.equal(yamlverse('foo', { five: 5 }).five, 5,
        'defaults should apply for unspecified options');

    t.throws(function() {
        yamlverse('bar');
    }, { name: 'Error', message: "Config file 'bar' does not exist" },
        'should throw if config file does not exist');
    t.equal(yamlverse('bar', { three: 3 }).three, 3,
        'should not throw if defaults are specified');

    fs.writeFileSync(cfgPath, 'dev: { five: 5 }');
    t.equal(yamlverse('foo').five, undefined,
        'processed config should be cached');

    yamlverse.clearCache();
    t.equal(yamlverse('foo').five, 5,
        'config should be reread after clearing cache');

    yamlverse.tags = '';
    yamlverse.clearCache();
    t.equal(yamlverse('foo').five, undefined,
        'tags can be altered on the fly with a cache clear');

    rimraf(testDir, function(err) {
        if (err)
            throw err;
        else
            t.end();
    });
});
