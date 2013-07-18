'use strict'

require.config {
  paths:
    jquery: '../bower_components/jquery/jquery'
  packages: [
    {
      name: 'cs'
      location: '../bower_components/require-cs'
      main: 'cs'
    }
    {
      name: 'coffee-script'
      location: '../bower_components/coffee-script'
      main: 'index'
    }
  ]

}

require ['jquery', 'enjine/application', 'mario/loadingstate'],
    ($, Application, LoadingState) ->

      $(document).ready ->
        new Application().initialize 'canvas', new LoadingState(), 320, 240