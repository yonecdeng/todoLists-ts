# 项目地址

[Github地址](https://github.com/charleydeng/todoLists-ts/tree/master)
[Gitee地址](https://gitee.com/charleydeng/todoLists-ts)

# 项目说明

- 此项目为用typescript编写的todolists
- 项目内代码注释很详细
- git主分支下有两个feature分支,分别对应两大块功能的实现， master分支下的内容是整个项目的最终版。
- 该文档记录了整个项目的开发流程, 对应到分支的开发顺序为 feature-init  -->  feature-addBackend  , 如果读者想跟着项目从头做一遍，可以从github上clone整个项目下来，然后根据此顺序去看分支里的代码跟着去做。(关于对比两分支代码差异的方法在 [帮助资料](#geAq3))

# 项目架构

- 整个项目主要思想:  面向对象 + 类的继承 + 装饰器模式

- 技术栈: typescript + fetch +express

1. 最外层(app.ts): 浏览器的事件,存放todoData数据和todoList的Dom，把todoData传给TodoEvent让它去管理数据,把todoList的Dom传给TodoDom让TodoDom去管理Dom,这样就实现了TodoEvent等的复用, 哪怕最外层变了，只要传入todoData,todoDom就可以调用TodoEvent和TodoDom去管理。
1. 操作数据 (TodoEvent): addTodo、removeTodo、toggleComplete
1. 操作DOM (TodoDom): addItem、removeItem、changeComplete
1. 管理模版(TodoTemplate):todoView

- 整个架构就是从下往上进行继承,只暴露操作数据的方法给最外层去调用

- 这个架构的好处在于分离了模板、dom操作和数据操作,你要改动模版时去TodoTemplate那里改,改动dom操作时去TodoDom那里改,改动数据操作时去TodoEvent那里改



# 初始化项目

1. 新建目录,执行`npm i -y`,来生成package.json文件 (参数 -y 表示Generate it without having it ask any questions)
1. 再执行`yarn add vite -D` 添加vite库到依赖包
1. 在package.json文件中写入脚本`"dev":"vite"`

```javascript
  "scripts": {
    "dev": "vite",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```


4. 新建index.html文件 (url访问http://localhost:3001时就是访问这个index.html)
4. 可以新建一个vite.config.js文件去进行一些vite的配置,也可以不建
4. 命令行输入`yarn vite`就会运行程序

# Coding

## 功能包括添加&删除&切换是否完成

### 项目结构

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1223771/1651051564248-f59cba42-e1c6-4024-bbcf-ae7aac5c5959.png)

### 文件结构说明

- TodoTemplate就是给 TodoDom 用的
- TodoDom就是给TodoEvent用的
- app通过TodoEvent的方法去操作todoData和todoList的dom (app是整个项目的入口)

### 文件内容

> 此部分内容在分支feature-init

#### app.ts

```javascript
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
    oTodoList.addEventListener('click', handleListClick, false);
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

  function handleListClick(e: MouseEvent): void {
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
```

#### index.html

```javascript
<!DOCTYPE html>
  <html lang="en">
    <head>
    <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
</head>
<body>
          <div class="app"></div>
<div class="todo-input">
  <input type="text" placeholder="What needs to be done?">
    <button>增加</button>
</div>
<div class="todo-list">111</div>
<script type="module" src="./src/app.ts"></script><!--模块化引入app.ts-->
</body>
</html>
```

#### TodoDom.ts

```javascript
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
```

#### TodoEvent.ts

```javascript
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
```


#### TodoTemplate.ts

```javascript
/**每一项todo的模版 */
import { ITodoData } from "./typings";

class TodoTemplate {
  protected todoView({ id, content, completed }: ITodoData): string {
    return `
    <input type="checkbox" ${completed ? 'checked' : ''} data-id="${id}">
    <span style="text-decoration:${completed ? 'line-through' : ''}">${content}</span>
    <button data-id="${id}">删除</button>
    `
  }
}

export default TodoTemplate
```

#### typings.ts

```javascript
export interface ITodoData {
  id: number;
  content: string;
  completed: boolean;
}
```

#### utils.ts

```javascript
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
```


## 加入服务器

> 此部分内容见分支feature-addBackend

### 整体思路

init()的时候拿后台的todoData并存到前台, 删除、添加、更改状态的时候都是更改存在前台的todoData,然后发请求到后台把后台的也改了,并不是等后台改完后再把最新的todoData发回来给前台重新展示todoData(后台不返回最新的todoData)

### 编写后台接口

#### 安装依赖

命令行输入 `yarn add express @types/express ts-node-dev typescript -D`  

#### 在主目录下新建server目录

先在package.json中配置![image.png](https://cdn.nlark.com/yuque/0/2022/png/1223771/1651057370814-4d7a75b9-7663-4c94-9c2c-83bb5b7399a3.png)

再新建目录结构如下:
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1223771/1651133739429-3821136a-071a-4539-aa16-8e6a47434b5c.png#clientId=u7319b70f-0bbc-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=229&id=u73d264c8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=458&originWidth=410&originalType=binary&ratio=1&rotation=0&showTitle=false&size=31812&status=done&style=none&taskId=ua9f1fa3f-52e8-45ff-8271-79f0cf4691c&title=&width=205)

各文件内容见feature-addBackend分支

命令行输入 `yarn server` 即可运行后台



### 前台添加http请求

#### 设计理念

1. 通过装饰器模式给每个TodoEvent里操作数据的方法添加http请求
1. 调用fetch()来发http请求 

#### 配置tsconfig.json 使可以使用装饰器

1. 初始化tsconfig.json, 命令行输入 `tsc --init`
1. 将这两个的注释解开![image.png](https://cdn.nlark.com/yuque/0/2022/png/1223771/1651057186835-2d65059b-f5ba-4ff1-acbf-216eff3ccf47.png)
1. 将这个注释打开并改成false![image.png](https://cdn.nlark.com/yuque/0/2022/png/1223771/1651057269814-7e627e25-7730-4f39-b672-7564ee9560e6.png)

#### 新建文件TodoService编写发请求

项目目录结构如下:
![image.png](https://cdn.nlark.com/yuque/0/2022/png/1223771/1651142047463-eae32075-13c4-4a02-a0cf-9445c8bd8f91.png)
各文件内容见分支feature-addBackend

# 坑

## 如果在箭头函数上用装饰器会报错

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1223771/1651129796560-f790f65f-bde0-40c9-98f6-8d56aa2c0e59.png)
解决方法:  将箭头函数(函数表达式)改为声明函数![image.png](https://cdn.nlark.com/yuque/0/2022/png/1223771/1651129896852-727a5d3c-6e86-4d3c-af25-0bd15ebf7581.png)

## fetch获取后台响应体的方法

```javascript
//MDN上的方法
fetch('http://example.com/movies.json')
  .then(response => response.json())
  .then(data => console.log(data));
```

# 帮助资料

[git对比两个分支差异的方法](https://www.jianshu.com/p/bb97fabb475e) 
