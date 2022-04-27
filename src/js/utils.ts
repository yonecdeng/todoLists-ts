export function findParentNode(target: HTMLElement, className: string): HTMLElement {
  while (target = target.parentNode as HTMLElement) {
    if (target.className == className) {
      return target
    }
  }
}

export function createItem(tagName: string, className: string, todoItem: string): HTMLElement { //创造todoItem的dom元素
  const oItem = document.createElement(tagName)
  oItem.className = className
  oItem.innerHTML = todoItem
  return oItem
}