/**
 * 操作todolist里的数据 并调用Dom方法
 * @param {ITodoData[]} todoData(todolist的数据)
 * @param {HTMLElement} todoWrapper(todolist的dom)
 * */

import TodoDom from "./TodoDom"
import { getTodoList, removeTodo, toggleTodo, addTodo } from "./TodoService"
import { ITodoData } from "./typings"

export default class TodoEvent extends TodoDom {
  private todoData: ITodoData[]
  constructor(todoData: ITodoData[], todoWrapper: HTMLElement) {
    super(todoWrapper)
    this.init(todoData) //初始化todolist  
  }

  @getTodoList //装饰器--给它加装一个向后台发请求和处理后台响应体的功能
  private init(todoData: ITodoData[]) {
    this.todoData = todoData
    this.initList(this.todoData) //initList是操作dom的方法,定义在父类TodoDom里
  }

  @addTodo //装饰器--给它加装一个向后台发请求和处理后台响应体的功能
  public addTodo(todo: ITodoData): undefined | number {
    const _todo: null | ITodoData = this.todoData.find(item => item.content == todo.content)
    if (!_todo) { //如果没有重复的内容则加进列表里
      this.todoData.push(todo) //操作数据
      this.addItem(todo) //操作dom
      return
    }
    return 1001 //如果有重复的内容则返回1001
  }

  @removeTodo//装饰器--给它加装一个向后台发请求和处理后台响应体的功能
  public removeTodo(targe: HTMLElement, id: number): void {
    this.todoData = this.todoData.filter(item => item.id !== id)//操作数据
    this.removeItem(targe) // 操作dom
  }

  @toggleTodo//装饰器--给它加装一个向后台发请求和处理后台响应体的功能
  public toggleComplete(target: HTMLElement, id: number): void {
    this.todoData.map(item => {
      if (item.id === id) {
        item.completed = !item.completed //操作数据
        this.changeComplete(target, item.completed)// 操作dom
      }
      return item
    })
  }

}