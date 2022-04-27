/**
 * 操作todolist里的数据 并调用Dom方法
 * @param {ITodoData[]} todoData(todolist的数据)
 * @param {HTMLElement} todoWrapper(todolist的dom)
 * */

import TodoDom from "./TodoDom"
import { ITodoData } from "./typings"

export default class TodoEvent extends TodoDom {
  private todoData: ITodoData[]
  constructor(todoData: ITodoData[], todoWrapper: HTMLElement) {
    super(todoWrapper)
    this.todoData = todoData
    this.init() //初始化todolist
  }

  public addTodo = (todo: ITodoData): undefined | number => {
    const _todo: null | ITodoData = this.todoData.find(item => item.content == todo.content)
    if (!_todo) { //如果没有重复的内容则加进列表里
      this.todoData.push(todo) //操作数据
      this.addItem(todo) //操作dom
      return
    }
    return 1001 //如果有重复的内容则返回1001
  }

  private init() {
    this.initList(this.todoData)
  }

  public removeTodo = (target: HTMLElement, id: number): void => {
    this.todoData = this.todoData.filter(item => item.id !== id)//操作数据
    this.removeItem(target) // 操作dom

  }

  public toggleComplete = (target: HTMLElement, id: number): void => {
    this.todoData.map(item => {
      if (item.id === id) {
        item.completed = !item.completed //操作数据
        this.changeComplete(target, item.completed)// 操作dom
      }
      return item
    })
  }

}