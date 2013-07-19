{exec} = require 'child_process'
fs = require 'fs'

task 'build:debug', 'Build a debug version of the project', ->
  console.log 'Building project in debug mode...'
  switch process.platform
    when 'win32'
      fs.mkdirSync 'bin' if not fs.existsSync 'bin'
      fs.mkdirSync 'bin/debug' if not fs.existsSync 'bin/debug'
      console.log ''
      console.log 'Compiling Coffeescript files...'
      exec 'coffee -o bin\\debug\\scripts -cm src\\', ->
        console.log 'Finished compiling'

        console.log ''
        console.log 'Copying Javascript files...'
        exec 'FOR /D /R %A IN (src\\*) ' +
          ' DO XCOPY "%A\\*.js" "bin\\debug\\scripts\\%~NA" /Y /I', ->
          console.log 'Finished copying'

          console.log ''
          console.log 'Copying resources...'
          exec 'XCOPY "res\\*" "bin\\debug\\" /S /Y /I', ->
            console.log 'Finished copying'

            console.log ''
            console.log 'Copy vendor files...'
            exec 'XCOPY "lib\\*" "bin\\debug\\scripts\\vendor\\" /S /Y /I', ->
              console.log 'Finished copying'
    else
      console.log 'Platform not supported by this Cakefile!'

task 'clean', 'Remove all compiled files', ->
  console.log 'Cleaning up generated files...'
  switch process.platform
    when 'win32'
      console.log ''
      console.log 'Deleting bin\\...'
      exec 'RD /S /Q "bin"', ->
        console.log 'Finished deleting'