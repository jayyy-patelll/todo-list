<script setup lang="ts">
  import Card from "./components/Card.vue";
  import Dialogue from "./components/Dialogue.vue";
  import StatusBar from "./components/StatusBar.vue";

  import { reactive, onMounted, computed, watch, watchEffect } from "vue";
  import type {Task} from "./types/Task.ts";

  let tasks = reactive<Task[]>(JSON.parse(localStorage.getItem("tasks")!) || []);

  
  watch(tasks, ()=>{ 
    localStorage.setItem("tasks", JSON.stringify(tasks));
  })
  // watch( state, () => {} );

  const deleteAllTasks = () => { 
    tasks.splice(0,tasks.length); 
    localStorage.removeItem("tasks"); 
  };

  function changeTasks(newTasks: Task[]){
    tasks = newTasks
  }

  onMounted(() => { 
    if (localStorage.getItem("tasks")) { 
      tasks = JSON.parse(localStorage.getItem("tasks")!) || []; 
    } 
  }); 
</script>

<template>
  <div> 
    <div class="card mt-3"> 
      <div> 
        <h1 class="text-center">To-Do List</h1> &nbsp;
        <StatusBar :tasks="tasks" />
        &nbsp;

        <!-- Dynamically assign the value of a variable -->
        <Card :tasks="tasks" @changeTasks="changeTasks($event)" />
        <Dialogue :tasks="tasks" />


        <button type="button" @click="deleteAllTasks()"> 
          <v-sheet class="pa-1 ma-1" color="red"> Clear All </v-sheet>
        </button>

      </div> 
    </div> 
  </div> 
</template>

<style scoped> 
.message { 
  color: rgb(23, 160, 23); 
  font-weight: bold; 
}
</style>