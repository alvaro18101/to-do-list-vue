<!-- <script setup>

</script> -->

<script>
// import './assets/css/main.css'
// import './assets/css/mediaqueries.css'
// import './assets/css/fonts.css'

export default {
  data() {
    const idCounter = 1;
    return {
      idCounter: 1,
      tasks: [],
      newTask: {
        id: 1,
        title: '',
        completed: false
      },
      tasks: JSON.parse(localStorage.getItem('tasks')) || []
    }
  },

  methods: {
    addTask() {
      const taskInput = document.getElementById('task-title')
      const title = document.getElementById('task-title').value
      if (this.tasks.length == 0) {
        this.idCounter = 1
      }


      if (title.replaceAll(' ', '') != '') {
        this.newTask.id = this.idCounter
        this.newTask.title = title
        this.newTask.completed = false
        this.tasks.push(this.newTask)
        this.idCounter += 1

        this.newTask = {
          id: this.idCounter,
          title: '',
          completed: false
        }
        taskInput.value = ''
      }
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },

    deleteTask(taskIndex) {
      this.tasks = this.tasks.filter(task => task.id != taskIndex)
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },

    deleteAll() {
      this.tasks = []
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
      this.idCounter = 1
    },

    checkCompleted(taskId) {
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }

  }
}

</script>

<template>
  <div id="aplication">
    <section class="task-title-container">
      <h1>Lista de Tareas</h1>
      <div class="task-input-container">
        <input type="text" name="" id="task-title" placeholder="Ingresa la tarea" @keyup.enter="addTask">
        <div class="button-addTask-container" @click="adddeleteAllTask">
          <img class="addTask"
            src="./assets/images/add_white.png" 
            alt="+"
            @click="addTask"
            draggable="false"
          >
        </div>
      </div>
    </section>

    <section class="tasks-list-container" v-if="tasks.length > 0">
      <div class="tasks-list">
        <ul>
          <li v-for="task in tasks" :key = "task.id">
            <div class="task">
              <label class="task-name">
                <div class="checkbox-container">
                  <input type="checkbox" class="checkbox" v-model="task.completed" @change="checkCompleted">
                </div>
                {{ task.title }}
              </label>
              <img class="deleteTask button"
                src="./assets/images/delete.png" 
                alt="x"
                @click="deleteTask(task.id)"
                draggable="false"
              >
            </div>
          </li>
        </ul>
      </div>
      <div class="delete-buttons-container">
        <div class="deleteAll" @click="deleteAll">
            <img 
            src="./assets/images/delete_white.png" 
            alt="X" 
            class="button"
            draggable="false"
          >
            Borrar todas las tareas
        </div>
      </div>
    </section>

    <section class="no-tasks" v-else>
      <h2 class="no-tasks">No hay tareas por el momento</h2>
    </section>

  </div>

</template>

<style scoped>

</style>
