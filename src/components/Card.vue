<script setup lang="ts">
  // import draggable from "vuedraggable";
  import type { PropType } from "vue";
  import { ref, watch } from "vue";
  import {Task} from "../types/Task.ts";
  import {topics} from "../data/topics.ts";

  const dialog = ref(false);

  // Define the props type
  const props = defineProps({
    tasks: {
      type: Array as PropType<Task[]>,
      required: true,
    },
  });

  const emit = defineEmits(['changeTasks']);

  const editTask = (task: Task) => {
    const editedTodoTitle = prompt('Edit the todo title:');
    const editedTodoDescription = prompt('Edit the todo description:');
    const editedTodoDate = prompt('Edit the todo date of completion:(YYYY-MM-DD)');

    if (editedTodoTitle && editedTodoDescription && editedTodoDate) {
      const index = props.tasks.indexOf(task);
      // const newEditedTask = new Task(editedTodoTitle, editedTodoDescription, props.tasks[index].isDone, props.tasks[index].priority, editedTodoDate, props.tasks[index].id)
      // props.tasks[index].editTask(newEditedTask);
      props.tasks[index].title = editedTodoTitle;
      props.tasks[index].description = editedTodoDescription;
      props.tasks[index].dateOfCompletion = editedTodoDate;
      localStorage.setItem("tasks", JSON.stringify(props.tasks)); 
    }
  }

  const deleteTask = (index: number) => {
    const taskIndex = props.tasks.findIndex((t)=>{if(t.id == index) return t});
    props.tasks.splice(taskIndex, 1); 
    localStorage.setItem("tasks", JSON.stringify(props.tasks)); 
  }

  const checkTask = (id: number) => {
    const taskIndex = props.tasks.findIndex((t)=>{if(t.id == id) return t});
    if(taskIndex !== -1){
      // props.tasks[taskIndex].checkTask();
      props.tasks[taskIndex].isDone = !props.tasks[taskIndex].isDone;
      localStorage.setItem("tasks", JSON.stringify(props.tasks));
    }
  }

  const changeTag = (topic: string, id: number) => {
    console.log(topic, id);
    const taskIndex = props.tasks.findIndex((t)=>{if(t.id == id) return t});

    if(props.tasks[taskIndex].tags.includes(topic)){
      // props.tasks[index].removeTag(topic);
      console.log("remove", topic, "from", JSON.stringify(props.tasks[taskIndex]));
      const tagIndex = props.tasks[taskIndex].tags.indexOf(topic);
      props.tasks[taskIndex].tags.splice(tagIndex, 1);
    }else{
      // props.tasks[index].addTag(topic);
      console.log("added", topic, "to", JSON.stringify(props.tasks[taskIndex]));
      props.tasks[taskIndex].tags.push(topic);
    }
  }

  watch(props.tasks, () => {
    emit('changeTasks', props.tasks);
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
    
    <v-row no-gutters v-for="(element, index) in props.tasks" :key="index">
      <v-col style="display: flex; font-size:large;">
        <input v-model="element.isDone" type="checkbox" @click="checkTask(element.id)"/>  
        <p class="fw-semibold" style="padding-top: 8px; padding-left: 8px;">{{ element.title }}</p>
      </v-col>
      <v-col>
        <p class="fw-semibold" style="padding-top: 8px; padding-left: 8px;">{{ element.dateOfCompletion }}</p>
      </v-col>
      <v-col>
        <p class="fw-semibold" style="padding-top: 8px; padding-left: 8px;">{{ element.priority }}</p>
      </v-col>
      <v-col>
        <v-chip-group class="ml-3" column>
          <v-chip
            v-for="topic in element.tags"
            :key="topic"
            :text="topic"
            :value="topic"
          ></v-chip>
        </v-chip-group>
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
          <v-btn @click="dialog = true">
            Tags
          </v-btn>

          <v-dialog
            v-model="dialog"
            max-width="400"
          >
            <v-card
              prepend-icon="mdi-update"
              title="Select Tags"
            >
            <v-responsive class="overflow-y-auto" max-height="280">
              <v-chip-group class="ml-3" column>
                <v-chip
                  v-for="topic in topics"
                  :key="topic"
                  :text="topic"
                  @click="changeTag(topic, element.id)"
                  :value="topic"
                ></v-chip>
              </v-chip-group>
            </v-responsive>
              <template v-slot:actions>
                <v-btn
                  class="ms-auto"
                  text="Ok"
                  @click="dialog = false"
                ></v-btn>
              </template>
            </v-card>
          </v-dialog>
        </div>       
      </v-col>
    </v-row>

  </v-container>
</template>

<style>

</style>