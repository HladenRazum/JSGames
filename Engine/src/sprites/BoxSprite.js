class BoxSprite {
  constructor(width, height, color) {
    this.width = width
    this.height = height
    this.color = color
  }

  draw(ctx, x, y) {
    ctx.fillStyle = this.color
    ctx.fillRect(x, y, this.width, this.height)
  }
}
