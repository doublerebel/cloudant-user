# cloudant-user

Helper module to use standard CouchDB _users db on a Cloudant db.

* [Purpose](#purpose)
* [Installation](#installation)
* [Usage](#usage)
  - [Enable standard CouchDB auth on a Cloudant DB](#enable-standard-couchdb-auth-on-a-cloudant-db)
    + [Example: Set your Cloudant user as CouchDB admin](#example-set-your-cloudant-user-as-couchdb-admin)
  - [Revert to Cloudant auth on a Cloudant DB](#revert-to-cloudant-auth-on-a-cloudant-db)
  - [Create a user with any set of roles](#create-a-user-with-any-set-of-roles)
    + [CoffeeScript](#coffeescript)
    + [JavaScript](#javascript)
* [Contributors](#contributors)
* [License](#license)

## Purpose
When _users db is enabled, Cloudant uses an old version of CouchDB auth which requires the salt and sha1-hashed password to be included with user creation.

https://cloudant.com/for-developers/faq/auth/

So, if you'd like to run your own npm registry with the solid hosting of Cloudant, this module is a huge help.  I use it to create user accounts for our private npm.

## Installation
```sh
git clone https://github.com/doublerebel/cloudant-user.git
```

## Usage:

### Enable standard CouchDB auth on a Cloudant DB
PUT `_security-docs/_security-couchdb.json` to youruser.cloudant.com/yourdbname/_security to enable standard CouchDB auth for that database.

```sh
curl -X PUT -d @_security-docs/_security-couchdb.json https://youruser.cloudant.com/yourdbname/_security
```

#### Example: Set your Cloudant user as CouchDB admin
When switching to CouchDB auth, it's useful to define the admin role as your existing Cloudant user.  The admin user will be able to create/read/update/delete all other users in this database.

We can also limit this database to users which have a role "npm".

`_security-docs/_security-cloudant.json`
```json
{
  "couchdb_auth_only": true,
  "admins": {
    "names": ["your-cloudant-username"],
    "roles": ["_admin"]
  },
  "members": {
    "names": [],
    "roles": ["npm"]
  }
}
```

### Revert to Cloudant auth on a Cloudant DB
PUT `_security-docs/_security-cloudant.json` to youruser.cloudant.com/yourdbname/_security to reset auth to Cloudant management for that database.

```sh
curl -X PUT -d @_security-docs/_security-cloudant.json https://youruser.cloudant.com/yourdbname/_security
```

### Create a user with any set of roles
Example scripts to add a user to Cloudant.  Create one of these scripts and run with `coffee scriptname.coffee` or `node scriptname.js`.

#### CoffeeScript
```coffee
CloudantUser = require "cloudant-user"

server =
  host: your-cloudant-user.cloudant.com
  port: 80
  secure: true

adminuser =
  name: "your-admin-username"
  pass: "your-admin-password"

newuser =
  name: "your-newuser-name"
  pass: "your-newuser-pass"
  roles: ["_reader","_writer"]

callback = (err, res) ->
    console.log err if err
    console.log res if res

cloudantUser = new CloudantUser server, adminuser
cloudantUser.create newuser.name, newuser.pass, newuser.roles..., callback
```

#### JavaScript
```js
var CloudantUser = require("cloudant-user");

var server = {
  host: your-cloudant-user.cloudant.com,
  port: 80,
  secure: true
};

var adminuser = {
  name: "your-admin-username",
  pass: "your-admin-password"
};

var newuser = {
  name: "your-newuser-name",
  pass: "your-newuser-pass",
  roles: ["_reader", "_writer"]
};

var callback = function(err, res) {
  if (err) console.log(err);
  if (res) return console.log(res);
};

var cloudantUser = new CloudantUser(server, adminuser);
cloudantUser.create(newuser.name,
                    newuser.pass,
                    newuser.roles[0],
                    newuser.roles[1],
                    callback);
```

### cloudantUser.npmCreate()
Create a user with email (required by npm)
```coffee
npmCreate(username, password, email, roles..., callback)
```

### cloudantUser.createWithMeta()
Create a user with arbitrary metadata
```coffee
metadata =
  shrike: true
  timewarp: false

createWithMeta(username, password, email, roles..., metadata, callback)
```

## Extra help

### Users need to change their own password
On Cloudant, a user without both roles "_reader" and "_writer" will be unable to change their password.  Therefore, all normal users should be created with these roles.

### Futon on Cloudant
Futon is available for any Cloudant database at https://cloudant.com/futon .  Login there with your Cloudant account username and password.

## Contributors

This module is originally based off of [a gist](https://gist.github.com/weilu/10445007) by [weilu](https://github.com/weilu).

## License
Copyright 2014-2016 doublerebel.  MIT licensed.
