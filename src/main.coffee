'use strict'

require.config {
  paths:
    jquery: 'vendor/jquery/jquery'
}

require ['require', 'jquery', 'enjine/application', 'mario/loadingstate'],
  (require) ->
    $ = require 'jquery'
    Application = require 'enjine/application'
    LoadingState = require 'mario/loadingstate'


    $(document).ready ->
      new Application().initialize 'canvas', new LoadingState(), 320, 240