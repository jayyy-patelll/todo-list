export interface TaskInterface {
    id: number;
    title: string;
    description: string;
    isDone: boolean;
    priority: "High" | "Medium" | "Low" | "None";
    dateOfCompletion: string;
    tags: string[];

    editTask(task: Task): void;
    checkTask(): void;
    addTag(tag: string): void;
    removeTag(tag: string): void;
}

export class Task implements TaskInterface {
    public id: number;
    public title: string;
    public description: string;
    public isDone: boolean;
    public priority: "High" | "Medium" | "Low" | "None";
    public dateOfCompletion: string;
    public tags: string[];

    private static index: number = 0;

    constructor(
        title: string,
        description: string,
        isDone: boolean,
        priority: "High" | "Medium" | "Low" | "None",
        dateOfCompletion: string,
        id?: number,
        tags?: string[]
    ) {
        this.id = Math.round(Math.random()*100);
        this.title = title;
        this.description = description;
        this.isDone = isDone;
        this.priority = priority;
        this.dateOfCompletion = dateOfCompletion;
        this.tags = tags || [];
    }

    public editTask(task: Task) {
        this.title = task.title;
        this.description = task.description;
        this.isDone = task.isDone;
        this.priority = task.priority;
        this.dateOfCompletion = task.dateOfCompletion;
        this.tags = task.tags;
    }

    public checkTask():void { 
        this.isDone = !this.isDone;
        console.log("hua");
    }

    public addTag(tag: string):void {
        this.tags.push(tag);
        console.log("2", this.tags);
    }

    public removeTag(tag: string):void {
        this.tags = this.tags.filter((t) => t !== tag);
        console.log("1", this.tags);
    }

    public static getTask(): typeof Task {
        return this;
    }
}