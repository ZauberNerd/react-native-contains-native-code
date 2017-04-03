# react-native-contains-native-code
A small module to test whether a given react-native dependency contains native or JS-only code.

* Checks if the dependency contains an xcode or gradle project ✓
* Checks if the dependency contains RNPM hooks ✓
* CLI ✓
* API ✓

# ToC
* [Why](#why)
* [Usage](#usage)
    * [CLI](#cli)
    * [API](#api)
* [How does it work?](#how-does-it-work)
* [An example integration](#an-example-integration)

# Why
This utility was built in order to support "web-like release agility" for react-native projects.

This means, in detail, that paired with a tool like [Microsoft code-push](https://github.com/Microsoft/react-native-code-push) and a little bit of extra scripting,
deployments can be made continuously and be released either as JS-only changes via code-push or with native changes through the iOS App Store / Google Play Store.

# Usage
## CLI
The binary can be used with either absolute or paths:
```shell
$ contains-native-code /home/myname/work/myproject/node_modules/a-react-native-dependency
```
or with the name of a dependency:
```shell
$ contains-native-code another-react-native-dependency
```
In the latter case it will look in the same `node_modules` folder where it has been installed for a dependeny with the given name.

The binary itself will be installed to `node_modules/.bin` and is available on the npm path.

## API
This package exports a single function that can be called with a path to the dependency in question:
```javascript
var containsNativeCode = require('react-native-contains-native-code');
console.log(containsNativeCode('/path/to/a/react-native-dependency'));
```
Or, with ES6 syntax:
```javascript
import containsNativeCode from 'react-native-contains-native-code';
console.log(containsNativeCode('/path/to/a/react-native-dependency'));
```

# How does it work?
The script reads the `package.json` manifest of the given dependency and checks:
* whether the key `rnpm` is present
* wheter the given dependency contains a `*.xcodeproj` file
* whether the given dependency contains an `android/build.gradle` or `android/app/build.gradle` file

This is a similar behaviour to how `react-native link` works internally.

# An example integration
In order to use this script in a automated release process the deployment script needs to do the following tasks:
1. check if commits have been made inside the projects `android/` or `ios/` folder
2. create a list of added/removed/changed dependencies from the package.json
3. run this script for every dependency that has been found through step 1
    * if it turns out that no native changes were made between the last version and current `HEAD` do a code-push release
    * otherwise build the native code and push to the app/play store

To be able to execute these steps the source code of the application needs to be versioned via a version control system (for example git).

It is recommended to not directly push to production but to employ a "staging" environment and use manual or automated integration tests to verify the release because this method might not be bullet proof.
