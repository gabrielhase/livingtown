# Livingtown

Livingtown is a real-time app that lets users view and create local events. Got a bar opening? Free chocolate ice cream somewhere? Let your local community know and add your insider tips to livingtown.

You are using the livingtown code for another project? That's awesome! Let me know.

## Technical Setup  

### Web

  1. Install node.js and npm (http://nodejs.org/)
  2. Install bower and grunt using `npm install -g bower` and `npm install -g grunt-cli`
  3. From the root of the project run `npm install` and `bower install`
  4. Run `grunt server` to start the development server at port 9000 (livereload)
  5. Run `grunt build` to build the files needed by XCode for production use
  6. Run `grunt server:dist` to start a local server that tests the minified and optimized dist version.

NOTE: Since there is no camera in the browser, the camera interface is mocked. Clicking the photo button will just upload the no-image placeholder and do nothing otherwise.

The web version of livingtown is hosted via github: http://gabrielhase.github.io/livingtown/

IE8 and below are not supported.

### XCode

  1. Install XCode and the Command Line Utilities
  2. Open the XCode project in platforms/ios
  3. Install the dependencies with `npm install` and `bower install` (see 3 above)
  3. Build the production dist folder by running `grunt build` from the root folder (see 5 above)
  4. Build the project to the simulator or your device if you have a valid provisioning profile

There is currently only an iOS port. Feel free to port the project to Android or another platform (I love pull requests).

Since the camera shutter takes some time to shut itself down (iOS quirk described on phonegap doc) the promise-based interface cordovaReady is not working there. For the moment the code doesn't wait for cordovaReady since the second screen can only be reached when cordova is ready anyway.

The simulator driving simulation works only if geolocation.watchPosition is called at least once. On the actual device this is not needed.

### Testing

I feel humbled to say that there are no tests yet...

## Libraries

Livingtown makes use of a whole bunch of libraries and services. A list of them can be found below:

  - Phonegap (cordova for ios with the camera plugin)
  - Angular.JS
  - Firebase (used through angularFire)
  - Leaflet (used through angular-leaflet-diretive)
  - JQuery
  - JQuery ScrollTo
  - Twitter Bootstrap
  - Moment.js

If all or any of these are unfamiliar you should probably get a high-level overview about each of them before coding on livingtown.

Libraries are usually installed and loaded via bower. The exception is external code that is modified for use in livingtown. These files go into the scripts/vendor folder.

## Structure

The setup of the project was done with yeoman (http://yeoman.io/) and follows guidelines for setting up Angular.JS projects. If unfamiliar check the yeoman angular seed at: https://github.com/yeoman/generator-angular

In order to let XCode compile the project the file platforms/ios/www is set as a symbolic link to the dist folder which contains the current build (after running `grunt build`)

## License
[MIT](http://gabriel.mit-license.org/).
