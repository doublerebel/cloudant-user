# cloudant-user

Helper module to use standard CouchDB _users db on a Cloudant db.

## Installation
POST `_security-docs/_security-custom.json` to youruser.cloudant.com/yourdbname/_security to enable standard CouchDB auth for that database.

POST `_security-docs/_security-default.json` to youruser.cloudant.com/yourdbname/_security to reset auth to Cloudant management for that database.

*Most of this would work on a normal CouchDB instance, but Cloudant requires the salt and sha1-hashed password to be included with user creation.*

## Usage:

```coffee
CloudantUser = require "cloudant-user"

server =
  host: your-cloudant-user.cloudant.com
  port: 80
  secure: true

adminuser =
  name: your-admin-username
  pass: your-admin-password

newuser =
  name: your-newuser-name
  pass: your-newuser-pass
  roles: ["_reader","_writer"]

callback = (err, res) ->
    console.log err if err
    console.log res if res

cloudantUser = new CloudantUser server, adminuser
cloudantUser.create newuser.name, newuser.pass, newuser.roles..., callback
```

This module is based off of [a gist](https://gist.github.com/weilu/10445007) by [weilu](https://github.com/weilu).

Copyright 2014 doublerebel.  MIT licensed.
