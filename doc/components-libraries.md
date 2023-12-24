# Components and Libraries

This file contains notes on how selected components and libraries are used so that the application uses a consistent set of patterns.

## Messages

Instead of dedicated _Alert_ managed by each component, a _Messages_ component has been added that displays messages and notifications in the top right
corner of the viewport at all times. Messages for this component and stored in a queue managed by the Redux store. They
can be added to the queue using the `publishMessage` action, which takes as an argument a `Message` object (see `model/Message.js`).
Messages are automatically discarded after a predefined timeout, so there is no need to manage their dismissal.

## Loaders and Async Actions

To allow display of a loading mask whenever an asynchronous action is performed, _promise tracking_ can be used. For this,
wrap an asynchronous dispatch in a call of `trackPromise` (make sure the dispatched action returns a Promise). The second
parameter of `trackPromise` is the name of the _area_ for which a corresponding `PromiseTrackingMask` is rendered during
the processing of the promise. Once the promise is resolved, the mask is automatically hidden. The mask can be configured
to cover the whole viewport or only the container in which it is displayed.
