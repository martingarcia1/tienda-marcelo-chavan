// Aplana el árbol de categorías en orden de lectura (madre, luego sus hijas),
// con la profundidad y la ruta completa para mostrar en el panel.
export function flattenCategoryTree(categories) {
  const byParent = {}
  for (const c of categories) {
    const key = c.parent_id ?? 'root'
    ;(byParent[key] ||= []).push(c)
  }
  for (const list of Object.values(byParent)) {
    list.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
  }

  const result = []
  function walk(parentKey, depth, pathNames) {
    for (const c of byParent[parentKey] || []) {
      const path = [...pathNames, c.name]
      result.push({ ...c, depth, path: path.join(' › ') })
      walk(c.id, depth + 1, path)
    }
  }
  walk('root', 0, [])
  return result
}

export function descendantIdsOf(categories, id) {
  const ids = [id]
  for (let i = 0; i < ids.length; i++) {
    for (const c of categories) if (c.parent_id === ids[i]) ids.push(c.id)
  }
  return ids
}
