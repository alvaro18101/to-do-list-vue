<script setup>

</script>

<template>
  <div id="aplication">
    <section class="tasks">
      <h1>Lista de Tareas</h1>
      <div class="taskTitle-container">
        <input type="text" name="" id="taskTitle" placeholder="Ingresa la tarea" @keyup.enter="addTask">
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
                @click="deleteTask"
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

export default {
  data() {
    return {
      tasks: [],
      newTask: {
        title: ''
      }
    }
  },

  methods: {
    addTask() {
      const taskInput = document.getElementById('taskTitle')
      const title = document.getElementById('taskTitle').value

      if (title != '') {
        this.newTask.title = title
        this.tasks.push(this.newTask)

        this.newTask = {
          title: ''
        }
        taskInput.value = ''
      }
      else {
        alert('Tarea vacía')
      }
      localStorage.setItem('tasks', JSON.stringify(this.tasks))
    },

    deleteTask() {
    }

  }

}

</script>

<style scoped>

</style>
