import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { ITodo } from './typings';
export function readFile(path: string): string {
  return readFileSync(resolve(__dirname, path), 'utf-8')
}

export function writeFile<T>(path: string, data: T): void {
  writeFileSync(resolve(__dirname, path), JSON.stringify(data))
}

export function fileOperation(path: string, fn?: (todoList: ITodo[]) => ITodo[]): string | void {
  let todoList: ITodo[] = JSON.parse(readFile(path) || '[]')
  if (!fn) {
    return JSON.stringify(todoList)
  }
  todoList = fn(todoList)
  writeFile<ITodo[]>(path, todoList)
}