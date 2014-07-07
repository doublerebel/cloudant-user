# cloudant-user

Helper module to use standard CouchDB _users db on a Cloudant db.

*Most of this would work on a normal CouchDB instance, but Cloudant requires the salt and sha1-hashed password to be included with user creation.*

Based off of [a gist](https://gist.github.com/weilu/10445007) by [weilu](https://github.com/weilu).

usage:

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

    callback = (err, res) ->
        console.log err if err
        console.log res if res

    cloudantUser = new CloudantUser server, adminuser
    cloudantUser.create newuser.name, newuser.pass, callback


Copyright 2014 doublerebel.  MIT licensed.
