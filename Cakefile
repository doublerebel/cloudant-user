{print} = require 'util'
{spawn} = require 'child_process'

task 'build', 'Build lib/ from src/', ->
  coffee = spawn 'iced', ['--runtime', 'inline', '-c', '-o', 'lib', 'src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0


task 'watch', 'Watch src/ for changes', ->
  coffee = spawn 'iced', ['-w', '--runtime', 'inline', '-c', '-o', 'lib', 'src']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()