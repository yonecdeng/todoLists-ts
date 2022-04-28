/** 项目入口 */
import { ITodoData } from "./js/typings";
import TodoEvent from "./js/TodoEvent";
; ((doc) => {
  /**获取跟操作todoData相关的dom元素 */
  const oInput: HTMLInputElement = document.querySelector('input');
  const oButton: HTMLButtonElement = document.querySelector('button');
  const oTodoList: HTMLDivElement = document.querySelector('.todo-list');

  const todoData: ITodoData[] = []

  const todoEvent = new TodoEvent(todoData, oTodoList); //创建事件对象来操作todoData和todolist的dom
  const init = (): void => {//初始化app
    bindEvent() //调用绑定事件
  }
  function bindEvent(): void { //给dom元素绑定事件
    oButton.addEventListener('click', handleAddBtnClick, false);
    oTodoList.addEventListener('click', handleListClick, false); //事件委托(todolist下的input和button事件都委托给它)
  }

  function handleAddBtnClick(): void {
    const val: string = oInput.value.trim();
    if (val.length) {
      const ret = todoEvent.addTodo({
        id: Date.now(),
        content: val,
        completed: false,
      })
      if (ret && ret === 1001) {
        alert('列表项已存在')
      }
      oInput.value = ''
    }
  }

  function handleListClick(e: MouseEvent): void {//事件委托(todolist下的input和button事件都委托给它)
    const tar = e.target as HTMLElement//获取点击的dom元素并断言为HTMLElement
    const tagName = tar.tagName//上面要断言为HTMLElement才会有类型提示说tar下有tagName属性,不然ts会把tar当targetEvent类型,此类型ts是认为无tagName属性的

    if (tagName === 'INPUT' || tagName === 'BUTTON') { //如果点击的是input或者button
      const id = parseInt(tar.dataset.id)//获取id
      switch (tagName) {
        case 'BUTTON':
          todoEvent.removeTodo(tar, id)
          break;
        case 'INPUT':
          todoEvent.toggleComplete(tar, id)
          break;
        default:
          break;
      }
    }

  }

  init() //进来先初始化app
})(document)