#! /usr/bin/env node
const path = require('path');
const containsNativeCode = require('./index');

const projectRoot = path.resolve(__dirname, '..', '..');
const dependencyName = process.argv[2];

const pathToDependency = path.isAbsolute(dependencyName)
    ? dependencyName
    : path.resolve(projectRoot, 'node_modules', dependencyName);

const result = containsNativeCode(pathToDependency);

process.exit(result === true ? 0 : 1);
