import { Component } from '@angular/core';
import { Todo } from '../models/todo.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  public mode: string = 'list';
  public todos: Todo[] = [];
  public title: string = 'Lista de Tarefas';
  public form: FormGroup;
  public editedTask: string = '';
  public editingTodoId: number | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: [
        '',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(40),
          Validators.required,
        ]),
      ],
    });

    this.load()
  }

  add() {
    const title = this.form.controls['title'].value;
    const id = this.todos.length + 1;

    this.todos.push(new Todo(id, title, false));
    this.save();
    this.clear();
  }

  clear() {
    this.form.reset();
  }

  remove(todo: Todo) {
    const index = this.todos.indexOf(todo);

    if (index !== -1) {
      this.todos.splice(index, 1);
    }
    this.save();
  }

  markAsDone(todo: Todo) {
    todo.done = true;
    this.save();
  }

  markAsUndone(todo: Todo) {
    todo.done = false;
    this.save();
  }

  save() {
    const data = JSON.stringify(this.todos);
    localStorage.setItem('todos', data);
    this.mode = 'list';
  }

  load() {
    const data = localStorage.getItem('todos') ?? '[]';

    try {
      this.todos = JSON.parse(data);
    } catch (error) {
      console.error('Erro ao fazer parsing do JSON:', error);
    }
  }


  edit(todo: Todo) {
    this.form.setValue({
        title: todo.task
    });
    this.mode = 'edit';
}

update() {
    const title = this.form.controls['title'].value;
    const selectedTodoIndex = this.todos.findIndex(todo => todo.task === title);
    if (selectedTodoIndex !== -1) {
        this.todos[selectedTodoIndex].task = title;
        this.save();
        this.clear();
        this.mode = 'list';
    }
}

startEdit(todoId: number) {
  this.editedTask = this.todos.find(todo => todo.id === todoId)?.task || '';
  this.editingTodoId = todoId;
}

finishEdit(todoId: number) {
  const editedTodo = this.todos.find(todo => todo.id === todoId);
  if (editedTodo && this.editedTask.trim() !== '') {
      editedTodo.task = this.editedTask.trim();
      this.save();
  }
  this.cancelEdit();
}

cancelEdit() {
  this.editedTask = '';
  this.editingTodoId = null;
}

  changeMode(mode:string) {
    this.mode = mode;
  }
}
