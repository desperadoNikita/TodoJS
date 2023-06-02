

import Notiflix from './notiflix';


const refs = {
  todoDiv: document.querySelector('#todos'),
  addButton: document.querySelector('#add'),
  input: document.querySelector('#create-input'),
};

async function getTodos() {
  const data = await fetch('http://localhost:7775/posts');
  const todos = await data.json();

  todos.forEach(todo => createHTML(todo));
}

window.addEventListener('DOMContentLoaded', getTodos());

function createHTML({ completed, id, title }) {
  const markup = `<div class="form-check"  id="${id}">
  <label class="form-check-label">
    <input id="${id}" type="checkbox" class="form-check-input" ${
    completed === true ? 'checked' : null
    // completed && "checked"
  }/>
   ${title}
  </label>
  <button
    id="${id}"
    type="button"
    class="btn-close"
    aria-label="Close"
    style="font-size: 10px"
  ></button>
</div>`;
  refs.todoDiv.insertAdjacentHTML('beforeend', markup);
}

refs.addButton.addEventListener('click', addTodo);

async function addTodo() {
  const todoValue = refs.input.value.trim();

  if (!todoValue) {
    Notiflix.Notify.info('Запиши данні у інпут');
    return;
  }

  const postObj = {
    title: todoValue,
    completed: false,
  };

  refs.input.value = '';

  const data = await fetch('http://localhost:7775/posts', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(postObj),
  });

  const todo = await data.json();

  createHTML(todo);
}

refs.todoDiv.addEventListener('click', onDelete);

async function onDelete(e) {
  if (e.target.nodeName !== 'BUTTON') return;
  const deletedId = e.target.getAttribute('id');
  const data = await fetch(`http://localhost:7775/posts/${deletedId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    },
  });

  const res = await data.json();

  if (res) {
    document.getElementById(`${deletedId}`).remove();
  }
}

refs.todoDiv.addEventListener('change', onUpdate);

async function onUpdate(e) {
  const updatedId = e.target.getAttribute('id');

  const completed = document.querySelector(`input[id=${updatedId}]`).checked;

  const data = await fetch(`http://localhost:7775/posts/${updatedId}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  });

  const res = await data.json();
}