import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTask,
  completeTask,
  deleteTask,
  editTask,
  loadTasks,
  selectTasks,
} from "../store/slices/taskSlice";
import {
  saveTasksToLocalStorage,
  loadTasksFromLocalStorage,
} from "../utils/localStorageHelpers";
import { selectUser } from "../store/slices/authSlice";

import {
  TextField,
  Button,
  Checkbox,
  IconButton,
  ListItemText,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Snackbar,
  CardActions,
  Tooltip,
  Grid,
  MenuItem,
  Select,
  Container,
  Alert,
  Chip,
} from "@mui/material";
import {
  Delete,
  Edit,
  AddTask,
  CheckCircleOutline,
  CircleOutlined,
} from "@mui/icons-material";
import Header from "./Header";

import styles from "./TaskManager.module.css"; // Import CSS module

const TaskManager: React.FC = () => {
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const tasks = useSelector(selectTasks);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const storedTasks = loadTasksFromLocalStorage(user);
      dispatch(loadTasks(storedTasks));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      saveTasksToLocalStorage(user, tasks);
    }
  }, [tasks, user]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditTask = (id: any) => {
    setEditTaskId(id);
    const task = tasks.find((task: any) => task.id === id);
    if (task) setEditTaskTitle(task.title);
  };

  const handleAddTask = () => {
    if (newTask) {
      dispatch(addTask(newTask));
      setNewTask("");
    } else {
      setSnackbarMessage("Task title cannot be empty");
      setSnackbarOpen(true);
    }
  };

  const handleSaveEditTask = (id: any) => {
    if (editTaskTitle) {
      dispatch(editTask({ id, title: editTaskTitle }));
      setEditTaskId(null);
      setEditTaskTitle("");
    } else {
      setSnackbarMessage("Task title cannot be empty");
      setSnackbarOpen(true);
    }
  };

  const filteredTasks = tasks.filter((task: any) => {
    if (filter === "completed") {
      return task.completed;
    }
    if (filter === "incomplete") {
      return !task.completed;
    }
    return true;
  });

  return (
    <>
      <Header />
      <Container className={styles.container}>
        <Paper elevation={3} className={styles.paper}>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            className={styles.heading}
          >
            ALL TASKS
          </Typography>

          <Box className={styles.taskInputWrapper}>
            <TextField
              label="New Task"
              variant="outlined"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              fullWidth
              className={styles.textField}
            />
            <Tooltip title="Add Task">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTask}
                className={styles.addButton}
                startIcon={<AddTask />}
              >
                Add
              </Button>
            </Tooltip>
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert onClose={handleSnackbarClose} severity="error">
              {snackbarMessage}
            </Alert>
          </Snackbar>

          <Box className={styles.selectWrapper}>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              variant="outlined"
              className={styles.select}
            >
              <MenuItem value="all">All Tasks</MenuItem>
              <MenuItem value="completed">Completed Tasks</MenuItem>
              <MenuItem value="incomplete">Incomplete Tasks</MenuItem>
            </Select>
          </Box>

          <Grid container spacing={2}>
            {filteredTasks.map((task: any) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Card
                  className={`${styles.card} ${
                    task.completed ? styles.cardCompleted : ""
                  }`}
                >
                  {task.completed && (
                    <div className={styles.completedIconOverlay}>
                      <CheckCircleOutline fontSize="small" />
                    </div>
                  )}
                  <CardContent className={styles.cardContent}>
                    <Checkbox
                      checked={task.completed}
                      onChange={() => dispatch(completeTask(task.id))}
                      color="primary"
                      icon={<CircleOutlined />}
                      checkedIcon={<CheckCircleOutline />}
                      className={styles.checkbox}
                    />
                    {editTaskId === task.id ? (
                      <TextField
                        variant="outlined"
                        value={editTaskTitle}
                        onChange={(e) => setEditTaskTitle(e.target.value)}
                        className={styles.textFieldEdit}
                      />
                    ) : (
                      <>
                        <ListItemText
                          primary={task.title}
                          primaryTypographyProps={{
                            variant: "h6",
                            className: task.completed ? styles.lineThrough : "",
                          }}
                        />
                        <Chip
                          label={task.completed ? "Completed" : "Incomplete"}
                          color={task.completed ? "success" : "default"}
                          variant="outlined"
                          className={styles.statusChip}
                        />
                      </>
                    )}
                  </CardContent>
                  <CardActions className={styles.cardActions}>
                    {editTaskId === task.id ? (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleSaveEditTask(task.id)}
                        className={styles.saveButton}
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <Tooltip title="Edit Task">
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditTask(task.id)}
                            className={styles.editIcon}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Task">
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => dispatch(deleteTask(task.id))}
                            className={styles.deleteIcon}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default TaskManager;
