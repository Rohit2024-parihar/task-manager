export const saveTasksToLocalStorage = (username: string, tasks: any[]) => {
    localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
  };
  
  export const loadTasksFromLocalStorage = (username: string): any[] => {
    const tasks = localStorage.getItem(`tasks_${username}`);
    return tasks ? JSON.parse(tasks) : [];
  };
  