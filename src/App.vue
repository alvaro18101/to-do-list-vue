<!-- <script setup>

</script> -->

<script>
// import './assets/css/main.css'
// import './assets/css/mediaqueries.css'
// import './assets/css/fonts.css'
import { Pencil, Plus, Trash2, X } from '@lucide/vue'

const LISTS_KEY = 'lists'
const ACTIVE_LIST_KEY = 'activeListId'
const LEGACY_TASKS_KEY = 'tasks'

// crypto.getRandomValues funciona también fuera de HTTPS (p. ej. el dev server abierto por IP desde el celular),
// a diferencia de crypto.randomUUID
function randomId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

function generateId(usedIds) {
  let id
  do {
    id = randomId()
  } while (usedIds.has(id))
  usedIds.add(id)
  return id
}

function loadLists() {
  try {
    const saved = JSON.parse(localStorage.getItem(LISTS_KEY))
    if (Array.isArray(saved) && saved.length > 0) return saved
  } catch {
    // datos corruptos: se empieza de nuevo
  }

  // Migración: las tareas de la versión anterior pasan a una primera lista
  let legacyTasks = []
  try {
    legacyTasks = JSON.parse(localStorage.getItem(LEGACY_TASKS_KEY)) || []
  } catch {
    legacyTasks = []
  }
  const usedIds = new Set()
  return [{
    id: generateId(usedIds),
    name: 'Mis tareas',
    tasks: legacyTasks.map(task => ({
      id: generateId(usedIds),
      title: task.title,
      completed: Boolean(task.completed)
    }))
  }]
}

export default {
  components: { Pencil, Plus, Trash2, X },

  data() {
    const lists = loadLists()
    const savedActiveId = localStorage.getItem(ACTIVE_LIST_KEY)
    return {
      lists: lists,
      activeListId: lists.some(list => list.id == savedActiveId) ? savedActiveId : lists[0].id,
      newTaskTitle: '',
      editingId: null,
      editTitle: '',
      renamingListId: null,
      renameTitle: '',
      listToDelete: null,
    }
  },

  computed: {
    activeList() {
      return this.lists.find(list => list.id == this.activeListId)
    },

    tasks() {
      return this.activeList.tasks
    },

    completedCount() {
      return this.tasks.filter(task => task.completed).length
    },
  },

  watch: {
    // Único punto de guardado: cualquier cambio en listas o tareas se persiste solo
    lists: {
      handler(lists) {
        localStorage.setItem(LISTS_KEY, JSON.stringify(lists))
      },
      deep: true
    },

    activeListId(id) {
      localStorage.setItem(ACTIVE_LIST_KEY, id)
    },
  },

  created() {
    // Guarda el resultado de la migración (la clave 'tasks' se conserva como respaldo)
    localStorage.setItem(LISTS_KEY, JSON.stringify(this.lists))
    localStorage.setItem(ACTIVE_LIST_KEY, this.activeListId)
  },

  mounted() {
    window.addEventListener('keydown', this.onWindowKeydown)
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.onWindowKeydown)
  },

  methods: {
    usedIds() {
      return new Set(this.lists.flatMap(list => [list.id, ...list.tasks.map(task => task.id)]))
    },

    // ----- Tareas -----

    addTask() {
      const title = this.newTaskTitle.trim()
      if (title == '') return
      this.activeList.tasks.push({
        id: generateId(this.usedIds()),
        title: title,
        completed: false
      })
      this.newTaskTitle = ''
    },

    startEdit(task) {
      this.editingId = task.id
      this.editTitle = task.title
      this.$nextTick(() => {
        const editInput = document.querySelector('.edit-input')
        if (editInput) editInput.focus()
      })
    },

    saveEdit(task) {
      if (this.editingId != task.id) return
      if (this.editTitle.trim() != '') {
        task.title = this.editTitle.trim()
      }
      this.cancelEdit()
    },

    cancelEdit() {
      this.editingId = null
      this.editTitle = ''
    },

    deleteTask(taskId) {
      this.activeList.tasks = this.tasks.filter(task => task.id != taskId)
    },

    deleteAll() {
      this.activeList.tasks = []
    },

    deleteCompleted() {
      this.activeList.tasks = this.tasks.filter(task => !task.completed)
    },

    // ----- Listas (pestañas) -----

    selectList(listId) {
      this.activeListId = listId
    },

    addList() {
      const list = {
        id: generateId(this.usedIds()),
        name: 'Nueva lista',
        tasks: []
      }
      this.lists.push(list)
      this.activeListId = list.id
      this.startRename(list)
    },

    startRename(list) {
      this.renamingListId = list.id
      this.renameTitle = list.name
      this.$nextTick(() => {
        const renameInput = document.querySelector('.tab-rename-input')
        if (renameInput) {
          renameInput.focus()
          renameInput.select()
        }
      })
    },

    // El doble clic para renombrar es solo para dispositivos con mouse
    renameOnDoubleClick(list) {
      if (window.matchMedia('(hover: hover)').matches) this.startRename(list)
    },

    saveRename(list) {
      if (this.renamingListId != list.id) return
      if (this.renameTitle.trim() != '') {
        list.name = this.renameTitle.trim()
      }
      this.cancelRename()
    },

    cancelRename() {
      this.renamingListId = null
      this.renameTitle = ''
    },

    requestDeleteList(list) {
      if (this.lists.length <= 1) return
      if (list.tasks.length > 0) {
        this.listToDelete = list
        this.$nextTick(() => this.$refs.modalCancel?.focus())
      } else {
        this.deleteList(list)
      }
    },

    deleteList(list) {
      if (this.lists.length <= 1) return
      const index = this.lists.indexOf(list)
      this.lists = this.lists.filter(item => item.id != list.id)
      if (this.activeListId == list.id) {
        this.activeListId = this.lists[Math.min(index, this.lists.length - 1)].id
      }
      this.closeDeleteModal()
    },

    closeDeleteModal() {
      this.listToDelete = null
    },

    onWindowKeydown(event) {
      if (event.key == 'Escape' && this.listToDelete) this.closeDeleteModal()
    },
  }
}

</script>

<template>
  <div id="aplication">
    <section class="task-title-container">
      <h1>Lista de Tareas</h1>
      <div class="task-input-container">
        <input type="text" name="" id="task-title" placeholder="Ingresa la tarea" v-model="newTaskTitle" @keyup.enter="addTask">
        <div class="button-addTask-container" @click="addTask">
          <img class="addTask"
            src="./assets/images/add_white.png"
            alt="+"
            draggable="false"
          >
        </div>
      </div>
    </section>

    <section class="lists-section">
      <nav class="tabs-container" aria-label="Listas de tareas">
        <div class="tabs" role="tablist">
          <div
            v-for="list in lists"
            :key="list.id"
            class="tab"
            :class="{ active: list.id == activeListId }"
            role="tab"
            tabindex="0"
            :aria-selected="list.id == activeListId"
            @click="selectList(list.id)"
            @keyup.enter="selectList(list.id)"
            @dblclick="renameOnDoubleClick(list)"
          >
            <input
              v-if="renamingListId == list.id"
              v-model="renameTitle"
              type="text"
              class="tab-rename-input"
              :size="Math.max(renameTitle.length, 6)"
              @click.stop
              @dblclick.stop
              @keyup.enter.stop="saveRename(list)"
              @keyup.esc="cancelRename"
              @blur="saveRename(list)"
            >
            <span v-else class="tab-name">{{ list.name }}</span>

            <template v-if="list.id == activeListId && renamingListId != list.id">
              <button class="icon-button" type="button" aria-label="Renombrar lista" @click.stop="startRename(list)">
                <Pencil />
              </button>
              <button
                v-if="lists.length > 1"
                class="icon-button"
                type="button"
                aria-label="Borrar lista"
                @click.stop="requestDeleteList(list)"
              >
                <X />
              </button>
            </template>
          </div>
        </div>
        <button class="icon-button tab-add" type="button" aria-label="Nueva lista" @click="addList">
          <Plus />
        </button>
      </nav>

      <div class="tasks-list-container" v-if="tasks.length > 0">
        <div class="tasks-list">
          <ul>
            <li v-for="task in tasks" :key="task.id">
              <div class="task">
                <label class="task-name">
                  <div class="checkbox-container">
                    <input type="checkbox" class="checkbox" v-model="task.completed">
                  </div>
                  <input
                    v-if="editingId == task.id"
                    v-model="editTitle"
                    type="text"
                    class="edit-input"
                    @keyup.enter="saveEdit(task)"
                    @keyup.esc="cancelEdit"
                    @blur="saveEdit(task)"
                  >
                  <span v-else>{{ task.title }}</span>
                </label>
                <div class="task-actions">
                  <button class="icon-button" type="button" aria-label="Editar tarea" @click="startEdit(task)">
                    <Pencil />
                  </button>
                  <button class="icon-button" type="button" aria-label="Borrar tarea" @click="deleteTask(task.id)">
                    <Trash2 />
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="delete-buttons-container">
          <div class="deleteCompleted" @click="deleteCompleted">
              <img
              src="./assets/images/delete_white.png"
              alt="X"
              class="button"
              draggable="false"
            >
              Borrar tareas completadas ({{ completedCount }}/{{ tasks.length }})
          </div>
          <div class="deleteAll" @click="deleteAll">
              <img
              src="./assets/images/delete_white.png"
              alt="X"
              class="button"
              draggable="false"
            >
              Borrar todas las tareas ({{ tasks.length }})
          </div>
        </div>
      </div>

      <div class="no-tasks" v-else>
        <h2 class="no-tasks">No hay tareas por el momento</h2>
      </div>
    </section>

    <div v-if="listToDelete" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">¿Borrar "{{ listToDelete.name }}"?</h2>
        <p>
          Esta lista tiene {{ listToDelete.tasks.length }}
          {{ listToDelete.tasks.length == 1 ? 'tarea' : 'tareas' }}, que también se borrarán.
        </p>
        <div class="modal-buttons">
          <button ref="modalCancel" class="modal-cancel" type="button" @click="closeDeleteModal">Cancelar</button>
          <button class="modal-confirm" type="button" @click="deleteList(listToDelete)">Borrar</button>
        </div>
      </div>
    </div>

  </div>

</template>

<style scoped>

</style>
