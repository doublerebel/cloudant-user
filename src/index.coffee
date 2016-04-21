cradle = require "cradle"
crypto = require "crypto"
extend = (require "util")._extend


class CloudantUser
  defaultRoles: [
    "_default"
    "_reader"
    "_creator"
    "_writer"
  ]

  constructor: (@server) ->
    unless @server?.host then throw new Error "server.host required"
    unless @server.auth.username then throw new Error "server.auth.username required"
    @server.secure  ?= /https/.exec @server.host
    @server.port   or= if @server.secure then 443 else 80
    @server.cache    = false
    @server.timeout  = 5000

    @connect()

  couchUser: (name) -> "org.couchdb.user:#{name}"

  connect: ->
    @conn = new (cradle.Connection) @server
    @db = @conn.database "_users"

  create: (name, password, roles..., cb) ->
    @createWithMeta name, password, roles..., null, cb

  createWithMeta: (name, password, roles..., metadata = {}, cb) ->
    await @exists name, defer err, doc
    return (cb err or error: "user_exists") unless doc is false

    roles = @defaultRoles unless roles.length
    hashAndSalt = @generatePasswordHash password

    user =
      name: name
      password_sha: hashAndSalt[0]
      salt: hashAndSalt[1]
      password_scheme: "simple"
      type: "user"
      roles: roles

    extend user, metadata
    @db.save (@couchUser name), user, cb

  npmCreate: (name, password, email, roles..., cb) ->
    @createWithMeta name, password, roles..., {email}, cb

  get: (name, callback) -> @db.get (@couchUser name), callback

  exists: (name, cb) ->
    await @db.get (@couchUser name), defer err, doc
    if err?.error is "not_found"
      cb err, false
    else if doc
      cb null, doc
    else
      cb err

  update: (name, props, cb) ->
    cb error: "properties for user required" unless props

    {password} = props
    if password
      delete props.password
      hashAndSalt = @generatePasswordHash password
      props.password_sha = hashAndSalt[0]
      props.salt = hashAndSalt[1]
      props.password_scheme = "simple"

    @db.merge (@couchUser name), props, cb

  remove: (name, callback) -> @db.remove name, callback

  generatePasswordHash: (password) ->
    salt = (crypto.randomBytes 16).toString "hex"
    hash = crypto.createHash "sha1"
    hash.update password + salt
    [
      hash.digest "hex"
      salt
    ]


module.exports = CloudantUser
