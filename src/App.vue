<script setup lang="ts">
  // import Card from "./components/Card.vue"
  import { reactive, ref, onMounted, computed, watch, watchEffect } from "vue"; 
  import draggable from "vuedraggable";

  const dialog = ref(false);

  interface Task {
    id: number,
    title: string,
    description: string,
    isDone: boolean,
    priority: "High"|"Medium"|"Low"|"None",  //literal property
    dateOfCompletion?: string,  //optional property
    // tags: string[],
  }

  // better use an object const newTask: Task'
  // const newTask: Task = ref({id:0, title:"", description:"", isDone:false, priority:"", dateOfCompletion:""});  // 
  const newTaskTitle = ref("");
  const newTaskDescription = ref("");
  const newTaskPriority = ref();
  const newTaskDateOfCompletion = ref("");

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
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
    console.log(noOfPendingTasks.value);
  })
  // watch( 
  //   state.tasks, () => { },
  // );

  const addTask = () => { 
    if (!newTaskDescription.value) return; 
    state.tasks.push({ 
      id: Math.round(Math.random()*100),
      title: newTaskTitle.value,
      description: newTaskDescription.value, 
      isDone: false, 
      priority: newTaskPriority.value,
      dateOfCompletion: newTaskDateOfCompletion.value,
    });
    localStorage.setItem("tasks", JSON.stringify(state.tasks)); 
    newTaskDescription.value = "";
    newTaskPriority.value = "";
    newTaskDateOfCompletion.value = "";
  }; 

  const deleteTask = (index: number) => { 
    state.tasks.splice(index, 1); 
    localStorage.setItem("tasks", JSON.stringify(state.tasks)); 
  }; 

  const editTask = (task: Task) => {
    const editedTodoTitle = prompt('Edit the todo title:');
    const editedTodoDescription = prompt('Edit the todo description:');
    const editedTodoDate = prompt('Edit the todo date of completion:(YYYY-MM-DD)');
    if (editedTodoTitle && editedTodoDescription && editedTodoDate) {

      // Method-1:
      // tasks.find((task)=>{
      //   if(task.id===index) console.log("found");
      // })
      // Method-2:
      // const curr = tasks.find(index);
      // console.log(curr);

      const index = state.tasks.indexOf(task);
      state.tasks[index].title = editedTodoTitle.trim();
      state.tasks[index].description = editedTodoDescription.trim();
      state.tasks[index].dateOfCompletion = editedTodoDate.trim();
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
    <div class="card mt-3"> 
      <div> 
        <h1 class="text-center">To-Do List</h1> &nbsp;
        <div class="stats">
          <h3 class="pending-num">Pending: {{ noOfPendingTasks }}</h3> 
          <h3 class="completed-num">Completed: {{ noOfCompletedTasks }}</h3>
          <h3 class="total-num">Total: {{ noOfTotalTasks }}</h3>
        </div>
        &nbsp;

        <!-- <Card v-for="(task,index) in state.tasks" :key="index" /> -->

        <v-container class="bg-surface-variant" max-width="800">
          <v-row no-gutters style="font-size: x-large;">
            <v-col>Task</v-col>
            <v-col >Due Date</v-col>
            <v-col>Priority</v-col>
            <v-col>Tags</v-col>
            <v-col offset="1">Actions</v-col>
          </v-row>
          <draggable v-model="state.tasks" item-key="index">
            <template #item="{ element }">
              <v-row no-gutters>
                <v-col style="display: flex; font-size:large;">
                  <input v-model="element.isDone" type="checkbox" name="check" @click="checkTask(element.index)"/>
                  <p class="fw-semibold" style="padding-top: 8px; padding-left: 8px;">{{ element.title }}</p>
                </v-col>
                <v-col>
                  <p class="fw-semibold" style="padding-top: 8px; padding-left: 8px;">{{ element.dateOfCompletion }}</p>
                </v-col>
                <v-col>
                  <p class="fw-semibold" style="padding-top: 8px; padding-left: 8px;">{{ element.priority }}</p>
                </v-col>
                <v-col>
                  <p class="fw-semibold" style="padding-top: 8px; padding-left: 8px;">{{ element.priority }}</p>
                </v-col>
                <v-col offset="1">
                  <div style="display: flex;">
                    <button type="button" @click="editTask(element)"> 
                      <v-sheet class="pa-1 ma-1" color="blue"> Edit </v-sheet>
                    </button>
                    <button type="button" @click="deleteTask(element.index)"> 
                      <v-sheet class="pa-1 ma-1" color="red"> Delete </v-sheet>
                    </button>
                  </div>       
                </v-col>
              </v-row>
            </template>
          </draggable>
          
        </v-container>

        <v-dialog v-model="dialog" max-width="600">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              class="text-none font-weight-regular"
              prepend-icon="mdi-account"
              text="Add Task"
              variant="tonal"
              color="green"
              v-bind="activatorProps"
            ></v-btn>
          </template>

          <v-card prepend-icon="mdi-account" title="Add Task Details">
            <v-card-text>
              <v-row dense>
                <v-col cols="24">
                  <v-text-field v-model="newTaskTitle" label="Title*" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="24">
                  <v-text-field v-model="newTaskDescription" label="Description*" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="newTaskPriority"
                    :items="['None', 'High', 'Medium', 'Low']"
                    label="Priority"
                    auto-select-first
                  ></v-autocomplete>
                </v-col>
                <v-col cols="" md="4" sm="6">
                  <v-text-field
                    v-model="newTaskDateOfCompletion"
                    hint="Format: YYYY-MM-DD"
                    label="Date"
                  ></v-text-field>
                </v-col>
              </v-row>
              <small class="text-caption text-medium-emphasis">*indicates required field</small>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text="Close"
                variant="plain"
                @click="dialog = false"
              ></v-btn>

              <v-btn
                color="primary"
                text="Save"
                variant="tonal"
                @click="()=>{addTask(); dialog = false;}"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

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
.stats {
  display: flex;
  justify-content: center;
}
.pending-num{
  background-color: lightpink;
  font-weight: 200;
  padding: 4px 8px;
}
.completed-num{
  background-color: lightgreen;
  font-weight: 200;
  margin-left: 2em;
  margin-right: 2em;
  padding: 4px 8px;
}
.total-num{
  background-color: lightskyblue;
  font-weight: 200;
  padding: 4px 8px;
}
</style> 
