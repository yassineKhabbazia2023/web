export function hasDragType(event: DragEvent, type: string){
  return event.dataTransfer?.types.includes(type) ?? false
}
