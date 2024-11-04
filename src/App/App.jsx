import { useEffect, useRef, useState } from 'react';
import Footer from '../Footer/Footer';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import TaskList from '../TaskList/TaskList';
import { formatDistanceToNowStrict } from 'date-fns';
import './App.css';

const App = () => {
  const maxId = useRef(100);
  const [dataTasks, setDataTasks] = useState([]);
  const [filterName, setFilterName] = useState('all');
  const [editTaskDescription, setEditTaskDescription] = useState('');

  const updateTimer = () => {
    setInterval(() => {
      setDataTasks(prevDataTasks =>
        prevDataTasks.map(task => ({
          ...task,
          timeCreated: `created ${timeCreate(task.timer)}`,
        })),
      );
    }, 15000);
  };

  const createTodoItem = (description, min, sec, timer) => {
    return {
      id: maxId.current++,
      description,
      timeCreated: `created ${timeCreate(timer)}`,
      timer,
      status: 'active',
      editing: false,
      defaulDescription: description,
      min,
      sec,
      timerIsTrue: false,
      check: false,
    };
  };

  const timeCreate = timer => {
    return formatDistanceToNowStrict(new Date(timer), {
      addSuffix: true,
    });
  };

  const addItem = (description, min, sec) => {
    const newItem = createTodoItem(
      description,
      (min = min < 10 ? `0${min}` : min),
      (sec = sec < 10 ? `0${sec}` : sec),
      new Date() - 1,
    );
    const newArr = [newItem, ...dataTasks];
    setDataTasks(newArr);
  };

  const editTask = id => {
    const newData = dataTasks.map(task => {
      if (task.id === id) {
        return { ...task, editing: !task.editing }; // Переключаем режим редактирования
      }
      return { ...task, editing: false }; // Выключаем режим редактирования для остальных задач
    });
    setDataTasks(newData);

    const taskToEdit = dataTasks.find(el => el.id === id);
    if (taskToEdit) {
      setEditTaskDescription(taskToEdit.description); // Устанавливаем текущее описание для редактирования
    }
  };

  const editSubmit = (e, id) => {
    e.preventDefault();

    setDataTasks(prevDataTasks =>
      prevDataTasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            description: editTaskDescription,
            defaulDescription: editTaskDescription,
            editing: false,
          };
        } else {
          return task;
        }
      }),
    );
  };

  const cancelEdit = e => {
    const newArr = dataTasks.map(task => {
      if (task.editing) {
        return { ...task, editing: false };
      } else {
        return task;
      }
    });
    if (e.keyCode === 27) {
      setDataTasks(newArr);
    }
  };

  const changeLabel = e => {
    console.log(e.target.value);
    const value = e.target.value;
    setEditTaskDescription(value);
  };

  const changeStatus = id => {
    const updatedDataTasks = dataTasks.map(task => {
      if (task.id === id) {
        if (task.status === 'active') {
          return { ...task, status: 'completed', check: true, timerIsTrue: false };
        } else if (task.status === 'completed') {
          return { ...task, status: 'active', check: false, timerIsTrue: true };
        }
      }
      return task;
    });

    setDataTasks(updatedDataTasks);
  };

  const deleteTask = id => {
    const idx = dataTasks.findIndex(el => el.id === id);
    setDataTasks([...dataTasks.slice(0, idx), ...dataTasks.slice(idx + 1)]);
  };

  useEffect(() => {
    updateTimer();
  }, []);

  const changeTaskList = status => (status === 'all' ? dataTasks : dataTasks.filter(el => el.status === status));

  const changeFilter = filter => {
    setFilterName(filter);
  };

  const clearCompleateItems = () => {
    setDataTasks(dataTasks.filter(el => el.status !== 'completed'));
  };

  // Таймер для задач

  const startTimer = (id, min, sec, timerLast) => {
    const newDataTasks = dataTasks.map(task => {
      if (task.id == id) {
        return { ...task, timerIsTrue: true };
      }
      return task;
    });
    setDataTasks(newDataTasks);

    timerLast = setInterval(() => {
      setDataTasks(prevDataTasks => {
        return prevDataTasks.map(task => {
          if (task.id === id && task.timerIsTrue) {
            min = Number(min);
            sec = Number(sec);

            if (min === 0 && sec === 0) {
              clearInterval(timerLast);
              return { ...task, status: 'completed', check: true, timerIsTrue: false };
            } else if (min >= 1) {
              if (sec === 0) {
                min--;
                sec = 59;
              } else {
                sec--;
              }
            } else if (min === 0 && sec > 0) {
              if (sec === 0) {
                min--;
                sec = 59;
              } else {
                sec--;
              }
            }

            return { ...task, min: min < 10 ? `0${min}` : min, sec: sec < 10 ? `0${sec}` : sec };
          } else {
            return task;
          }
        });
      });
    }, 1000);
  };

  const stopTimer = id => {
    const task = dataTasks.find(task => task.id === id);
    if (task) {
      const newArr = dataTasks.map(task => {
        if (task.id === id) {
          clearInterval(task.timerLast);
          return { ...task, timerIsTrue: false, timerLast: null };
        }
        return task;
      });
      setDataTasks(newArr);
    }
  };

  const taskDone = dataTasks.filter(el => el.status === 'completed').length;
  const taskLeft = dataTasks.length - taskDone;

  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <NewTaskForm addItem={addItem} />
        </header>
        <section className="main">
          <TaskList
            dataTasks={changeTaskList(filterName)}
            toggleStatusTodo={changeStatus}
            onDeleted={deleteTask}
            onEdit={editTask}
            editTaskDescription={editTaskDescription}
            editSubmit={editSubmit}
            changeLabel={changeLabel}
            startTimer={startTimer}
            stopTimer={stopTimer}
            cancelEdit={cancelEdit}
          />
          <Footer itemsLeft={taskLeft} onChangeFilter={changeFilter} clearCompleateItems={clearCompleateItems} />
        </section>
      </section>
    </>
  );
};

export default App;
