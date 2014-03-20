// preinstall script for updating globally installed peerDependencies

var globalInstall = process.env.npm_config_global == 'true';

if (!globalInstall) {
  console.log('Skipping peerDependency preinstall for non-global install');
  return;
}

var path = require('path');
var npmPath = path.resolve(path.dirname(process.env.npm_execpath), '..');
var npm = require(npmPath);

var debug_enabled = process.env.DEBUG || process.env.npm_config_debug;
var debug = debug_enabled ? console.error : function noop() {};
var info = console.log;
var error = console.error;

npm.load({ loglevel: 'silent' }, installPeerDependencies);

function installPeerDependencies(err, npm) {
  if (err) {
    error('Error loading npm, skipping peerDependencies preinstall');
    debug(err);
    return;
  }

  var peerDeps = require('./package.json').peerDependencies;
  var targets = [];

  for (name in peerDeps) {
    targets.push(name + '@' + peerDeps[name]);
  }

  info('Attempting to pre-install peerDependencies:\n  %s\n',
    targets.join('\n  '));

  npm.commands.install(targets, function(err, res) {
    if (err) {
      error('Error while pre-installing peerDependencies');
    } else {
      info('Updated globals:', targets);
    }
    debug(err, res);
  });
}