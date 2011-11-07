var fs = require('fs');
var path = require('path');
var test = require('tap').test;
var rimraf = require('rimraf');
var universe = require('universe');
var yamlverse = require('./');

var testDir = '/tmp/yamlverse-test';

test('basic config reading', function(t) {
    fs.mkdir(testDir, 0700, function(err) {
        if (err && err.code !== 'EEXIST')
            t.error(err, 'create test suite working directory');
        universe.root = testDir;

        var cfgPath = path.resolve(universe.config, 'foo.yml');
        fs.writeFile(cfgPath, 'dev: { three: 3 }', function(err) {
            t.error(err, 'create test config file');

            yamlverse.tags = "dev";
            t.equal(yamlverse('foo').three, 3,
                'config data should match what was hand-written');

            fs.writeFile(cfgPath, 'dev: { five: 5 }', function(err) {
                t.error(err, 'rewrite test config file');
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
                    t.error(err, 'cleanup of test suite working directory');
                    t.end();
                });
            });
        });
    });
});
