const engine = new Engine()

engine
  .register('renderer', new Renderer(800, 600))
  .register('world', new World())

engine.start()
