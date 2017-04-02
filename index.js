const fs = require('fs');
const path = require('path');
const glob = require('glob');

function findXCodeProject(folder) {
    const projects = glob
        .sync('**/*.xcodeproj', {
            cwd: folder,
            ignore: ['**/@(Pods|node_modules)/**']
        }).filter(function (project) {
            return path.dirname(project) === 'ios'
                || !(/test|example|sample/i).test(project);
        }).sort(function (projectA) {
            return path.dirname(projectA) === 'ios' ? -1 : 1;
        });
    return projects.length === 0 ? null : projects[0];
}

function hasRNPMHooks(manifest) {
    return typeof manifest.rnpm !== 'undefined';
}

function containsAndroidProject(pathToDependency) {
    const flat = path.join(pathToDependency, 'android', 'build.gradle');
    const nested = path.join(pathToDependency, 'android', 'app', 'build.gradle');
    return fs.existsSync(flat) || fs.existsSync(nested);
}

function containsIOSProject(pathToDependency) {
    const iosProject = findXCodeProject(pathToDependency);
    return iosProject
        && fs.existsSync(path.join(pathToDependency, iosProject, 'project.pbxproj'));
}

function containsNativeCode(pathToDependency) {
    if (!fs.existsSync(path.join(pathToDependency, 'package.json'))) {
        throw new Error(
            'The path: "' + pathToDependency + '" contains no package.json file. '
            + 'Did you forget to install it?'
        );
    }
    const packageManifest = require(pathToDependency + '/package.json');

    return hasRNPMHooks(packageManifest)
        || containsAndroidProject(pathToDependency)
        || containsIOSProject(pathToDependency);
}

module.exports = containsNativeCode;
