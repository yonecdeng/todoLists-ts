import express, { Application } from 'express';
import bodyParse from 'body-parser';
import { fileOperation } from './utils';
import { ITodo } from './typings';
const app: Application = express();
app.use(bodyParse.json());//解析json格式的数据
app.use(bodyParse.urlencoded({ extended: true }));//在中间件（即 req.body）之后的请求对象上填充了一个包含解析数据的新主体对象。 该对象将包含键值对，其中值可以是字符串或数组（当extended为假时）或任何类型（当extended为真时)


/*处理跨域 */
app.use((req, res, next) => {
  //判断路径
  if (req.path !== '/' && !req.path.includes('.')) {
    res.set({
      'Access-Control-Allow-Credentials': true, //允许后端发送cookie
      'Access-Control-Allow-Origin': req.headers.origin || '*', //任意域名都可以访问,或者基于我请求头里面的域
      'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type', //设置请求头格式和类型
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',//允许支持的请求方式
      'Content-Type': 'application/json; charset=utf-8'//默认允许的文本格式json和编码格式
    })
  }
  req.method === 'OPTIONS' ? res.status(204).end() : next() //让options请求快速返回,并且options请求返回状态吗为204
})


/**接口 */
app.get('/todolist', (req, res) => {
  const todoList: string = fileOperation('todo.json') as string
  res.send(todoList)
})

app.post('/toggle', (req, res) => {
  const id = req.body.id * 1
  fileOperation('todo.json', (todoList: ITodo[]) => {
    return todoList.map(item => {
      if (item.id === id) {
        item.completed = !item.completed
      }
      return item
    })
  })
  res.send({
    msg: 'success',
    statusCode: '200'
  })

})

app.post('/remove', (req, res) => {
  const id = parseInt(req.body.id)
  fileOperation('todo.json', (todoList: ITodo[]) => {
    return todoList.filter(item => item.id != id)
  })
  res.send({
    msg: 'success',
    statusCode: '00'
  })
})
app.post('/add', (req, res) => {
  const todo: ITodo = req.body.todo
  fileOperation('todo.json', (todoList: ITodo[]) => {
    const isExist = todoList.some(item => item.content === todo.content)
    if (isExist) {
      res.send({
        msg: '该任务已存在',
        statusCode: '100'
      })
      return
    }
    return [...todoList, todo]
  })
  res.send({
    msg: 'success',
    statusCode: '00'
  })
})

/**监听8080端口 */
app.listen(8080, function () {
  console.log('server is running at 8080')
})