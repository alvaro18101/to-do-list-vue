<script setup>

</script>

<template>
  <div id="aplication">
    <section class="task-title-container">
      <h1>Lista de Tareas</h1>
      <div class="task-input-container">
        <input type="text" name="" id="task-title" placeholder="Ingresa la tarea" @keyup.enter="addTask">
        <img class="addTask button"
          src="./assets/images/add.png" 
          alt="+"
          @click="addTask"
          draggable="false"
        >
      </div>
    </section>

    <section class="tasksList-container" v-if="tasks.length > 0">
      <div class="tasksList">
        <ul>
          <li v-for="(task, key) in tasks" :key = "key">
            <div class="task">
              <label class="task-name">
                <div class="checkbox-container">
                  <input type="checkbox" class="checkbox">
                </div>
                {{ task.title }}
              </label>
              <img class="deleteTask button"
                src="./assets/images/delete.png" 
                alt="+"
                @click="deleteTask(key)"
                draggable="false"
              >
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="no-tasks" v-else>
      <h2 class="no-tasks">No hay tareas por el momento</h2>
    </section>

  </div>

</template>

<script>
import './assets/css/main.css'
import './assets/css/mediaqueries.css'
import './assets/css/fonts.css'

export default {
  data() {
    const tasks = []
    return {
      tasks: [],
      newTask: {
        title: ''
      }
    }
  },

  methods: {
    addTask() {
      const taskInput = document.getElementById('task-title')
      const title = document.getElementById('task-title').value

      if (title.replaceAll(' ', '') != '') {
        this.newTask.title = title
        this.tasks.push(this.newTask)

        this.newTask = {
          title: ''
        }
        taskInput.value = ''
      }
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },

    deleteTask(taskIndex) {
      this.tasks.splice(taskIndex, 1)
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    }

  }

}

</script>

<style scoped>

</style>
