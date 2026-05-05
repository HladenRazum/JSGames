export class Engine {
  constructor() {
    // this.services = new Map()
    // this.lastTime = 0
    // this.running = false
  }

  // register(name, service) {
  //   this.services.set(name, service)
  //   return this // allows chaining
  // }

  // get(name) {
  //   const service = this.services.get(name)

  //   if (!service) {
  //     throw new Error(`Service ${name} not found. Did you register it?`)
  //   }

  //   return service
  // }

  // start() {
  //   this.running = true
  //   requestAnimationFrame((t) => this.loop(t))
  // }

  // loop(timestamp) {
  //   const dt = (timestamp - this.lastTime) / 1000 // seconds
  //   this.lastTime = timestamp
  //   this.get('world')?.systems.forEach((s) => s.update(dt))
  //   this.get('renderer').render(
  //     this.get('world').entities,
  //     this.get('world').camera,
  //   )

  //   if (this.running) {
  //     requestAnimationFrame((t) => this.loop(t))
  //   }
  // }

  // update() {
  //   this.systems.forEach((s) => s.update(dt))
  // }
}
