/**操作Dom
 * @param {HTMLElement} todoWrapper (todoList的dom)
 */
import TodoTemplate from "./TodoTemplate";
import { ITodoData } from "./typings";
import { createItem, findParentNode } from "./utils";

class TodoDom extends TodoTemplate {

  private todoWrapper: HTMLElement;//存放dom
  constructor(todoWrapper: HTMLElement) {
    super()
    this.todoWrapper = todoWrapper
  }

  protected initList(todoData: ITodoData[]): void {
    if (todoData.length === 0) return
    const oFrag: DocumentFragment = document.createDocumentFragment()
    todoData.forEach(item => {
      const oItem = createItem('div', 'todo-item', this.todoView(item))
      oFrag.appendChild(oItem)//先存到fragment里,不要直接塞到dom里,不然每个循环都重排重绘一遍,会很耗性能
    })
    this.todoWrapper.appendChild(oFrag)//把这整个片段塞进todoWrapper里
  }

  protected addItem(todo: ITodoData): void { //因为此方法只给子类使用,所以用protected
    const oItem = createItem('div', 'todo-item', this.todoView(todo))
    this.todoWrapper.appendChild(oItem)
  }

  protected removeItem(target: HTMLElement): void {
    const oParentNode: HTMLElement = findParentNode(target, 'todo-item')
    oParentNode.remove()
  }

  protected changeComplete(target: HTMLElement, completed: boolean): void {
    const oParentNode: HTMLElement = findParentNode(target, 'todo-item')
    const oContent: HTMLElement = oParentNode.querySelector('span')
    oContent.style.textDecoration = completed ? 'line-through' : ''
  }
}

export default TodoDom