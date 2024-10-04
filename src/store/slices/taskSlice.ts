import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<string>) => {
      const newTask: Task = {
        id: Date.now(),
        title: action.payload,
        completed: false,
      };
      state.tasks.push(newTask);
    },
    completeTask: (state, action: PayloadAction<number>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    editTask: (state, action: PayloadAction<{ id: number; title: string }>) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) task.title = action.payload.title;
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
  },
});

export const { addTask, completeTask, editTask, deleteTask, loadTasks } = tasksSlice.actions;
export const selectTasks = (state: any) => state.tasks.tasks;

export default tasksSlice.reducer;
