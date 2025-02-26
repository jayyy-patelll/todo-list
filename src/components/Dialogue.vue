<script setup lang="ts">
    import type { PropType } from "vue";
    import { ref, watch, watchEffect } from "vue";
    import {Task} from "../types/Task.ts";

    const props = defineProps({
        tasks: {
            type: Array as PropType<Task[]>,
            required: true
        }
    })

    const emit = defineEmits(['changeTasks']);

    const dialog = ref(false);
    const newTaskTitle = ref("");
    const newTaskDescription = ref("");
    const newTaskPriority = ref();
    const newTaskDateOfCompletion = ref("");

    const addTask = () => { 
        if (!newTaskTitle.value || !newTaskDescription.value) return;

        const newTask = new Task(newTaskTitle.value, newTaskDescription.value, false, newTaskPriority.value, newTaskDateOfCompletion.value);
        props.tasks.push(newTask);
        emit('changeTasks', props.tasks);

        newTaskTitle.value = "";
        newTaskDescription.value = "";
        newTaskPriority.value = "";
        newTaskDateOfCompletion.value = "";
    }; 
</script>

<template>
    <v-dialog v-model="dialog" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
        <v-btn
            text="Add Task"
            variant="tonal"
            color="green"
            v-bind="activatorProps"
        >
            <span style="margin: auto;">Add Task</span>
            <!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=add_task" />
            <span class="material-symbols-outlined">add_task</span> -->
        </v-btn>
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
                <!-- <v-date-input clearable label="Date input" v-model="newTaskDateOfCompletion"></v-date-input> -->
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
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 24
}
</style>