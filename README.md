# smart404
Make your error pages smart! Redirect users who made a typo automatically!

# Usage:
```js
const smart404 = require("smart404");
app.use(smart404(app, {
  distance: .8, //80% or more similar to an actual route.
  methods: ["GET"], //Methods to redirect
  status: 302, //Status to send
  ignoreRoutes: [], //Ignore these routes
}));//Must go BEFORE any other routes
```
