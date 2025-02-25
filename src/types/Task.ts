export interface Task {
    id: number;
    title: string;
    description: string;
    isDone: boolean;
    priority: "High" | "Medium" | "Low" | "None";
    dateOfCompletion?: string;
    // tags: string[];
}