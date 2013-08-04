## Running

Refer to the github README on how to setup the project:
https://github.com/gabrielhase/livingtown

## Functionality

The app works both in the browser and on an IPhone trough phonegap.

Upon starting the app, the user is presented a map with all events that were entered for the current local town as well as his own position marked. The app uses the Google Maps API to request the town for the current location and shows only events for this town. This design is on purpose since the app is meant to be hyper-local.

The events are also shown in a message stream below the map. The user can click a marker on the map to scroll to the respective message in the stream or click a message in the stream to center the map around the respective marker.

Updating of the events is done in real-time through the firebase web-service. This means that if another user enters a new event in the same town you don't need to refresh, but this event will just "magically" appear.

The button in the top-right of the map re-locates the user. The user location does not update automatically, but only when hitting the re-locate button. This is due to the fact that potentially a lot of calls go out, e.g. when the user crosses town borders. There are occasional timeouts in the geolocation calls for which there is an error screen that lets a user try again. Geolocation works considerably better in the native (phonegap) app than in the browser, probably because it is using the native devices geolocation API. It is mandatory to turn on localization services in the browser as well as on the phone.

One thing that might happen, especially when running the app in highway mode on the simulator, is that the messages might disapear. This is not an error, but intended behavior: you crossed a town border and the town you are in now simply has no messages.

The app is optimized for an IPhone in portrait mode and the phonegapp app runs only in this mode. On the browser one can of course switch the sides and the app will work, but I didn't put much work into responsive design.

The user can add an event by hitting the "Add" button at the top. He can take a picture (optionally) and enter a message (mandatory) for the event. I decided not to limit the message to 140 chars since I remembered that I don't like this particular feature all too often with Twitter.

I implemented everything from the proposal except for the user authentication. I think at this point it is a bit early for authentication since I want to use the app merely as a prototype to find possible partners. For this I guess it is fine without having users.
The screen to have a user check if the same message exists already is not necessary anymore since I added a new feature with which the user can locate itself on the map on the main screen.
Instead of JQuery mobile I used Twitter Bootstrap 3 RC1 as a UI framework. It came out this week, so I just had to try it :)

## Code

The code I wrote for this app is mostly in livingtown/app/scripts. There is documentation in the code files itself and help on how to set up the project for local development or XCode can be found on the github README.