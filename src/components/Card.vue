<script setup lang="ts">

  import draggable from "vuedraggable";
  import type { PropType } from "vue";
  import { watch } from "vue";
  import type {Task} from "../types/Task.ts";

  // Define the props type
  const props = defineProps({
    tasks: {
      type: Array as PropType<Task[]>,
      required: true,
    },
  });

  const emit = defineEmits(['changeTasks']);

  const deleteTask = (index: number) => { 
    const taskIndex = props.tasks.findIndex((t)=>{if(t.id == index) return t});
    props.tasks.splice(taskIndex, 1); 
    emit('changeTasks', props.tasks);
    localStorage.setItem("tasks", JSON.stringify(props.tasks)); 
  }; 

  const editTask = (task: Task) => {
    const editedTodoTitle = prompt('Edit the todo title:');
    const editedTodoDescription = prompt('Edit the todo description:');
    const editedTodoDate = prompt('Edit the todo date of completion:(YYYY-MM-DD)');

    if (editedTodoTitle && editedTodoDescription && editedTodoDate) {
      const index = props.tasks.indexOf(task);
      props.tasks[index].title = editedTodoTitle.trim();
      props.tasks[index].description = editedTodoDescription.trim();
      props.tasks[index].dateOfCompletion = editedTodoDate.trim();
      emit('changeTasks', props.tasks);
      localStorage.setItem("tasks", JSON.stringify(props.tasks)); 
    }
  }

  const checkTask = (id: number) => {
    const taskIndex = props.tasks.findIndex((t)=>{if(t.id == id) return t});
    if(taskIndex !== -1){
      props.tasks[taskIndex].isDone = !props.tasks[taskIndex].isDone;
      emit('changeTasks', props.tasks);
      localStorage.setItem("tasks", JSON.stringify(props.tasks));
    }
  }

  watch(props.tasks, () => {
    localStorage.setItem("tasks", JSON.stringify(props.tasks));
  });
</script>

<template>
  <v-container class="bg-surface-variant" max-width="800">
    <v-row no-gutters style="font-size: x-large;">
      <v-col>Task</v-col>
      <v-col>Due Date</v-col>
      <v-col>Priority</v-col>
      <v-col>Tags</v-col>
      <v-col>Actions</v-col>
    </v-row>
    <draggable v-model="props.tasks" item-key="id">
      <template #item="{ element }">
        <v-row no-gutters>
          <v-col style="display: flex; font-size:large;">
            <input v-model="element.isDone" type="checkbox" @click="checkTask(element.id)"/>  
            <p class="fw-semibold" style="padding-top: 8px; padding-left: 8px;">{{ element }}</p>
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
          <v-col>
            <div style="display: flex;">
              <button type="button" @click="editTask(element)"> 
                <v-sheet class="pa-1 ma-1" color="blue"> Edit </v-sheet>
              </button>
              <button type="button" @click="deleteTask(element.id)"> 
                <v-sheet class="pa-1 ma-1" color="red"> 
                  Delete 
                  <!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=delete" />
                  <span class="material-symbols-outlined">delete</span> -->
                </v-sheet>
              </button>
            </div>       
          </v-col>
        </v-row>
      </template>
    </draggable>
  </v-container>
</template>

<style>

</style>