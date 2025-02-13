<script setup lang="ts">
  // import Card from "./components/Card.vue"
  import { reactive, ref, onMounted, computed, watch, watchEffect } from "vue"; 

  interface Task {
    id: number,
    description: string,
    isDone: boolean,
  }

  const newTaskDescription = ref(""); 
  let tasks: Task[] = JSON.parse(localStorage.getItem("tasks")!) || [];  //! == non-null assertion operator
  const state = reactive({
    tasks: tasks,
  }) 

  let noOfPendingTasks = ref(0);
  let noOfCompletedTasks = ref(0);
  let noOfTotalTasks = ref(0);
  const countPendingTasks = () => {
    let cnt=0;
    for(let it=0; it<state.tasks.length; it++){
      if(state.tasks[it].isDone==false) cnt++;
    }
    return cnt;
    //return state.tasks.filter(task => !task.isDone).length;
  }

  watchEffect(()=>{ 
    noOfTotalTasks = ref(state.tasks.length);
    noOfPendingTasks = ref(countPendingTasks());
    noOfCompletedTasks = ref(noOfTotalTasks.value - noOfPendingTasks.value);
    console.log(noOfPendingTasks.value);
  })
  watch( 
    state.tasks, () => { },
  );

  const addTask = () => { 
    if (!newTaskDescription.value) return; 
    state.tasks.push({ 
      id: Math.round(Math.random()*100),
      description: newTaskDescription.value, 
      isDone: false, 
    });
    localStorage.setItem("tasks", JSON.stringify(state.tasks)); 
    newTaskDescription.value = ""; 
  }; 

  const deleteTask = (index: number) => { 
    state.tasks.splice(index, 1); 
    localStorage.setItem("tasks", JSON.stringify(state.tasks)); 
  }; 

  const editTask = (index: number) => {
    const editedTodo = prompt('Edit the todo:');
    if (editedTodo !== null && editedTodo.trim() !== '') {

      // Method-1:
      // tasks.find((task)=>{
      //   if(task.id===index) console.log("found");
      // })
      // Method-2:
      // const curr = tasks.find(index);
      // console.log(curr);

      state.tasks[index].description = editedTodo;
      localStorage.setItem("tasks", JSON.stringify(state.tasks)); 
    }
  }

  const checkTask = (index: number) => {
      //earlier, i was copying from localStorage as temp then splice() to edit that position
      state.tasks[index].isDone = !state.tasks[index].isDone;
      localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }

  const deleteAllTasks = () => { 
    state.tasks.splice(0,state.tasks.length); 
    localStorage.removeItem("tasks"); 
  };

  onMounted(() => { 
    if (localStorage.getItem("tasks")) { 
      state.tasks = JSON.parse(localStorage.getItem("tasks")!) || []; 
    } 
  }); 
</script>

<template>
  <div> 
    <div class="card mt-3 col-6"> 
      <div> 
        <h1 class="text-center">To-Do List</h1> &nbsp; &nbsp;
        <h3 class="text-center">Number of pending tasks = {{ noOfPendingTasks }}</h3>
        <h3 class="text-center">Number of completed tasks = {{ noOfCompletedTasks }}</h3>
        <h3 class="text-center">Number of total tasks = {{ noOfTotalTasks }}</h3>

        <!-- <Card v-for="(task,index) in state.tasks" :key="index" /> -->

        <v-container class="bg-surface-variant" width="500">
          <v-row no-gutters v-for="(task, index) in state.tasks" :key="index" justify="end">
            <v-col cols="4" style="display: flex; font-size: x-large;">
              <input v-model="task.isDone" type="checkbox" name="check" @click="checkTask(index)"/>
              <p class="fw-semibold" style="padding-left: 8px;">{{ task.description }}</p> 
            </v-col>
            <v-col offset="4">
              <button type="button" @click="editTask(index)"> 
                <v-sheet class="pa-1 ma-1" color="blue"> Edit </v-sheet>
              </button>
            </v-col>
            <v-col>
              <button type="button" @click="deleteTask(index)"> 
                <v-sheet class="pa-1 ma-1" color="red"> Delete </v-sheet>
              </button>
            </v-col>
          </v-row>
        </v-container>

        <div class="d-flex flex-column flex-sm-row justify-content-between mt-3 mt-sm-5 adder"> 
          <div class="col-sm-9"> 
            <input 
              type="text" 
              class="form-control" 
              placeholder="Add a new task..." 
              v-model="newTaskDescription" 
              @keyup.enter="addTask()" 
              :disabled="state.tasks.length > 6" 
            /> 
          </div> 
            <div class="mt-3 mt-sm-0"> 
            <button type="button" class="btn-primary" @click="addTask()" v-if="state.tasks.length <= 6"> 
              Add 
            </button> 
            <p v-else class="message">Add after completing some tasks from the list!</p> 
          </div>
        </div>

        <button type="button" @click="deleteAllTasks()"> 
          <v-sheet class="pa-1 ma-1" color="red"> Clear All </v-sheet>
        </button>

        <!-- Rest of the content --> 
      </div> 
    </div> 
  </div> 
</template>

<style scoped> 
.message { 
  color: rgb(23, 160, 23); 
  font-weight: bold; 
} 
.btn-primary {
  color: white;
  background-color: green;
  padding: 4px;
}
.adder {
  position: absolute;
  left: 35%;
}
</style> 
