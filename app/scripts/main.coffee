require.config {
  paths:
    jquery: '../bower_components/jquery/jquery'
}

require ['app', 'jquery'], (app, $) ->
  'use strict'
  # use app here
  console.log app
  console.log 'Running jQuery %s', $().jquery