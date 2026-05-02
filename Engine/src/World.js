class World {
  constructor() {
    this.nextId = 0
    this.components = new Map()
    this.systems = []
    this.camera = { x: 0, y: 0 }
  }

  // entity is just and ID
  createEntity() {
    return this.nextId++
  }

  destroyEntity(id) {
    this.components.forEach((store) => store.delete(id))
  }

  add(entity, name, data) {
    if (!this.components.has(name)) {
      this.components.set(name, new Map())
    }
    this.components.get(name).set(entity, data)
  }

  remove(entity, name) {
    this.components.get(name)?.delete(entity)
  }

  get(entity, name) {
    return this.components.get(name)?.get(entity)
  }

  query(...names) {
    // If no component names were provided, return empty result
    if (names.length === 0) {
      return []
    }

    // Step 1: Take the first component name
    const firstName = names[0]

    // Step 2: Get the map for that component
    const firstComponentMap = this.components.get(firstName)

    // If it doesn't exist, no entities can match
    if (!firstComponentMap) {
      return []
    }

    // Step 3: Get all entity IDs that have this first component
    const firstEntitiesIterator = firstComponentMap.keys()

    // Convert iterator → array
    const result = Array.from(firstEntitiesIterator)

    // Step 4: Loop through remaining component names
    for (let i = 1; i < names.length; i++) {
      const componentName = names[i]
      const componentMap = this.components.get(componentName)

      // If this component doesn't exist at all → no matches
      if (!componentMap) {
        return []
      }

      // Step 5: Filter the result array in-place
      for (let j = result.length - 1; j >= 0; j--) {
        const entityId = result[j]

        // If this entity does NOT have the component → remove it
        if (!componentMap.has(entityId)) {
          result.splice(j, 1)
        }
      }
    }

    // Step 6: Return remaining entities
    return result
  }

  addSystem(system) {
    this.systems.push(system)
    return this
  }
}
