<script setup lang="ts">

    import type { PropType } from "vue";
    import { computed } from "vue";
    import type {Task} from "../types/Task.ts";

    // Define the props type
    const props = defineProps({
        tasks: {
            type: Array as PropType<Task[]>,
            required: true,
        },
    });

    let noOfPendingTasks = computed({
        get() {
        return props.tasks.filter((task) => !task.isDone).length;
        },
        set(newVal: Number) {
        noOfPendingTasks.value = newVal;
        }
    });
    let noOfCompletedTasks = computed(() => props.tasks.filter((task) => task.isDone).length);
    let noOfTotalTasks = computed(() => props.tasks.length);

</script>

<template>
    <div class="stats">
        <h3 class="pending-num">Pending: {{ noOfPendingTasks }}</h3> 
        <h3 class="completed-num">Completed: {{ noOfCompletedTasks }}</h3>
        <h3 class="total-num">Total: {{ noOfTotalTasks }}</h3>
    </div>
</template>

<style lang="css" scoped>
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