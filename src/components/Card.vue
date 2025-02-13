<script lang="ts">
export default {
  props: {
    task: { type: Object }, //any better ways to define 'task'??
  }
}

import { ref, onMounted, computed, watch } from "vue"; 

const tasks = ref(JSON.parse(localStorage.getItem("tasks")) || []);
  let noOfTasksRemaining = ref(tasks.value.length); 

const deleteTask = (index: any) => { 
    //how to know which task to delete, use some id
    console.log("hi");
    tasks.value.splice(index, 1); 
    noOfTasksRemaining = ref(tasks.value.length);
    localStorage.setItem("tasks", JSON.stringify(tasks.value)); 
  }; 

  const deleteAllTasks = () => { 
    noOfTasksRemaining = ref(tasks.value.length);
    tasks.value = []; 
    localStorage.removeItem("tasks"); 
  }; 
</script>

<template>
    <div class="card item-card mt-2">
        <div class="card-content"> 
            <input v-model="task.isDone" type="checkbox" name="check" />
            <p class="fw-semibold">{{ task.description }}</p> 
            <button type="button" class="btn btn-primary" @click="addTask()"> 
              Edit 
            </button>
            <button type="button" class="btn btn-primary" @click="deleteTask()"> 
              Delete 
            </button>
        </div>
    </div>
</template>

<style>
.item-card { 
  height: 60px; 
  background-color: #aa6dec; 
  color: #fff;
} 
.card-content {
  display: flex;
}
</style>