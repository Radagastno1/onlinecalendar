import { addEventListeners } from './todo.js';
import { showAddTodoForm } from './todo.js';
import { showListOfTodos } from './todo.js';
import { renderTodoList } from './todo.js';
import { presentDateAndTime } from './today.js';
import { updateClock } from './today.js';

document.addEventListener('DOMContentLoaded', main);

function main() {
  addEventListeners();
  showAddTodoForm();
  renderTodoList();
  showListOfTodos();
  presentDateAndTime();
  updateClock();
}
