/**利用装饰器模式用来给每个TodoEvent里操作数据的方法添加http请求 */
import { ITodoData } from "./typings"


export function getTodoList(target: any, methodName: string, descriptor: PropertyDescriptor): void { //一般装饰器都是有这三个参数:target是类的实例(即构造函数.prototype),methodName是方法名,descriptor是方法的描述
  const _origin = descriptor.value //保存原方法init()
  descriptor.value = function (todoData: ITodoData[]) { //新方法参数跟原方法一样
    fetch('http://localhost:8080/todolist')//给原方法加上给后台发请求的功能
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json()//相当于JSON.parse(response.text()),而且会返回promise类型的后台的响应体
      })
      .then(data => { //测试一下this指向  //data就是后台返回的响应体
        _origin.call(this, data) //调用原方法
      })
      .catch(error => console.log(error))
  }
}

export function removeTodo(target: any, methodName: string, descriptor: PropertyDescriptor): void { //一般装饰器都是有这三个参数:target是类的实例(即构造函数.prototype),methodName是方法名,descriptor是方法的描述
  const _origin = descriptor.value //保存原方法removeTodo()
  descriptor.value = function (target: HTMLElement, id: number) { //新方法参数跟原方法一样
    fetch('http://localhost:8080/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    })//给原方法加上给后台发请求的功能
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        _origin.call(this, target, id) //调用原方法
      })
      .catch(error => console.log(error))
  }
}

export function toggleTodo(target: any, methodName: string, descriptor: PropertyDescriptor): void {
  const _origin = descriptor.value //保存原方法toggleCompleted()
  descriptor.value = function (target: HTMLElement, id: number) { //新方法参数跟原方法一样
    fetch('http://localhost:8080/toggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    })//给原方法加上给后台发请求的功能
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        _origin.call(this, target, id) //调用原方法
      })
      .catch(error => console.log(error))
  }
}

export function addTodo(target: any, methodName: string, descriptor: PropertyDescriptor): void {
  const _origin = descriptor.value //保存原方法addTodo()
  descriptor.value = function (todo: ITodoData) { //新方法参数跟原方法一样
    fetch('http://localhost:8080/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ todo })
    })//给原方法加上给后台发请求的功能
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response.json()//相当于JSON.parse(response.text()),而且会返回promise类型的后台的响应体
      })
      .then(data => { //data就是后台返回的响应体
        if (data.statusCode === '100') {
          alert('该项已存在')
          return
        }
        _origin.call(this, todo) //调用原方法
      })
      .catch(error => console.log(error))
  }
}