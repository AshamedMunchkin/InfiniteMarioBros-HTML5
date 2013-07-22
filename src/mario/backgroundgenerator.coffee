'use strict'

define (require) ->
  Level = require 'mario/level'
  LevelType = require 'mario/leveltype'

  class
    constructor: (@width, @height, @distant, @type) ->

    setValues: (width, height, distant, type) ->
      @width = width
      @height = height
      @distant = distant
      @type = type

    createLevel: ->
      level = new Level @width, @height
      switch @type
        when LevelType.overground then @generateOverground level
        when LevelType.undergound then @generateUnderground level
        when LevelType.cast then @generateCastle level
      level

    generateOverground: (level) ->
      range = if @distant then 4 else 6
      offs = if @distant then 2 else 1
      h = Math.floor(Math.random() * range) + offs

      for x in [0...@width]
        oh = h
        while oh is h
          h = Math.floor(Math.random() * range) + offs
        for y in [0...@height]
          h0 = if oh < h then oh else h
          h1 = if oh < h then h else oh
          switch
            when y < h0
              if @distant
                level.setBlock x, y, 4 + (if y < 2 then y else 2) * 8
              else
                level.setBlock x, y, 5
            when y is h0 or y is h1
              level.setBlock x, y, (if h0 is h then 0 else 1) +
                (if @distant then 2 else 0) + (if y is h1 then 16 else 0)
            else
              level.setBlock x, y,
                (if y > h1 and h0 isnt oh or y <= h1 and h0 is oh then 1 else 0) +
                (if @distant then 2 else 0) + 8

    generateUnderground: (level) ->
      if @distant
        tt = 0
        for x in [0...@width]
          if Math.random() < 0.75 then tt = if tt is 0 then 1 else 0

          for y in [0...@height]
            t = tt
            yy = y - 2

            if yy < 0 or yy > 4
              yy = 2
              t = 0
            level.setBlock x, y, 4 + t + (3 + yy) * 8
      else
        for x in [0...@width]
          for y in [0...@height]
            t = x % 2
            yy = y - 1
            if yy < 0 or yy > 7
              t = 0
              yy = 7
            if t is 0 and 1 < yy < 5
              t = -1
              yy = 0

            level.setBlock x, y, 6 + t + yy * 8

    generateCastle: (level) ->
      if @distant
        for x in [0...@width]
          for y in [0...@height]
            t = x % 2
            yy = y - 1

            switch
              when 2 < yy < 5
                yy = 2
              when 5 <= yy
                yy -= 2

            switch
              when yy < 0
                t = 0
                yy = 5
              when yy > 4
                t = 1
                yy = 5
              when t < 1 and yy is 3
                t = 0
                yy = 3
              when t < 1 and yy > 0 and yy < 3
                t = 0
                yy = 2

            level.setBlock x, y, 1 + t + (yy + 4) * 8
      else
        for x in [0...@width]
          for y in [0...@height]
            t = x % 3
            yy = y - 1

            switch
              when 2 < yy < 5
                yy = 2
              when 5 <= yy
                yy -= 2

            switch
              when yy < 0
                t = 1
                yy = 5
              when yy > 4
                t = 2
                yy = 5
              when t < 2 and yy is 4
                t = 2
                yy = 4
              when t < 2 and yy < 4
                t = 4
                yy = -3

            level.setBlock x, y, 1 + t + (yy + 3) * 8