cradle = require "cradle"
crypto = require "crypto"


class CloudantUser
  constructor: (@server, @adminuser) ->
    unless @server?.host    then throw new Error "server.host required"
    unless @adminuser?.name then throw new Error "adminuser.name required"

    cradle.setup
      host: @server.host
      port: @server.port or 80
      cache: false
      timeout: 5000

    @connect()

  couchUser: (name) -> "org.couchdb.user:#{name}"

  connect: ->
    @conn = new (cradle.Connection)(
      secure: @server.secure? or true
      auth:
        username: @adminuser.name
        password: @adminuser.pass
    )
    @db = @conn.database "_users"

  create: (name, password, autocb) ->
    await @exists name, defer err, doc
    return (err or error: "user_exists") unless doc is false

    hashAndSalt = @generatePasswordHash password
    @db.save (@couchUser name),
      name: name
      password_sha: hashAndSalt[0]
      salt: hashAndSalt[1]
      password_scheme: "simple"
      type: "user"
    , autocb

  get: (name, callback) -> @db.get (@couchUser name), callback

  exists: (name, autocb) ->
    await @db.get name, defer err, doc
    if err?.error is "not_found"
      autocb err, false
    else if doc
      autocb null, doc
    else
      autocb err

  update: (name, props, autocb) ->
    return error: "properties for user required" unless props

    {password} = props
    if password
      delete props.password
      hashAndSalt = @generatePasswordHash password
      props.password_sha = hashAndSalt[0]
      props.salt = hashAndSalt[1]
      props.password_scheme = "simple"

    @db.merge (@couchUser name), props, autocb

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
