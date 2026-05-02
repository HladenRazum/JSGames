class Renderer {
  constructor(width, height) {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = width
    this.canvas.height = height
    document.body.appendChild(this.canvas)
  }

  render(entities, camera) {
    const { ctx } = this
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.save()

    ctx.translate(-camera.x, -camera.y)

    // Draw all entities with a sprite
    entities?.forEach((e) => {
      if (e.sprite) {
        e.sprite.draw(ctx, e.x, e.y)
      }
    })

    ctx.restore()
  }
}
