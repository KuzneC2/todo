import { useEffect, useState, useRef, useCallback } from 'react';
import Footer from '../Footer/Footer';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import TaskList from '../TaskList/TaskList';
import { formatDistanceToNowStrict } from 'date-fns';
import './App.css';

const App = () => {
  const [dataTasks, setDataTasks] = useState([]);
  const [filteredDataTasks, setFilteredDataTasks] = useState([]);
  const [filterName, setFilterName] = useState('all');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const maxId = useRef(100);
  //изначальное отображение списка и запуск счетчика времени
  useEffect(() => {
    setFilteredDataTasks(dataTasks);
    updateTimer();
  }, []);
  //обновление времени когда создали задачу
  const updateTimer = () => {
    setInterval(() => {
      setDataTasks(prevDataTask =>
        prevDataTask.map(task => ({
          ...task,
          timeCreated: `created ${timeCreate(task.timer)}`,
        })),
      );
      setFilteredDataTasks(prevFilteredDataTasks =>
        prevFilteredDataTasks.map(task => ({
          ...task,
          timeCreated: `created ${timeCreate(task.timer)}`,
        })),
      );
    }, 15000);
  };
  //создание задачи
  const createTodoItem = useCallback((description, min, sec, timer) => {
    return {
      id: maxId.current++,
      description,
      timeCreated: `created ${timeCreate(timer)}`,
      timer,
      status: 'active',
      defaulDescription: description,
      min,
      sec,
      timerIsTrue: true,
      check: false,
    };
  }, []);

  //время создания
  const timeCreate = timer => {
    return formatDistanceToNowStrict(new Date(timer), {
      addSuffix: true,
    });
  };
  //создание новой задачи
  const addItem = useCallback(
    (description, min, sec) => {
      const newItem = createTodoItem(description, min, sec, new Date() - 1);
      const newArr = [newItem, ...dataTasks];
      const newFilterArr = [newItem, ...filteredDataTasks];
      if (filterName !== 'completed') {
        setDataTasks(newArr);
        setFilteredDataTasks(newFilterArr);
      } else {
        setDataTasks(newArr);
      }
    },
    [createTodoItem, dataTasks, filteredDataTasks, filterName],
  );
  //редактирование задачи
  const editTask = id => {
    const newDescription = dataTasks.find(el => el.id === id);
    setFilteredDataTasks(
      filteredDataTasks.map(task => {
        if (task.id === id) {
          return { ...task, status: 'editing' };
        }
        if (task.status === 'editing') {
          const prevStatus = dataTasks.find(el => el.id === task.id);
          return { ...task, status: prevStatus.status };
        } else {
          return task;
        }
      }),
    );
    setEditTaskDescription(newDescription.description);
  };
  //подтверждение редактирования задачи
  const editSubmit = (e, id) => {
    e.preventDefault();
    const updateDataObject = dataTasks.find(el => el.id === id);
    setDataTasks(prevDataTasks =>
      prevDataTasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            description: editTaskDescription,
            defaulDescription: editTaskDescription,
          };
        } else {
          return task;
        }
      }),
    );
    setFilteredDataTasks(prevFilteredDataTasks =>
      prevFilteredDataTasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            description: editTaskDescription,
            status: updateDataObject.status,
            defaulDescription: editTaskDescription,
          };
        } else {
          return task;
        }
      }),
    );
  };
  // изменение в поле редактирования задачи
  const changeLabel = e => {
    setEditTaskDescription(e.target.value);
  };

  //изменение статуса задачи
  const changeStatus = id => {
    const updatedDataTasks = dataTasks.map(task => {
      if (task.id == id && task.status == 'completed') {
        startTimer(task.id, Number(task.min), Number(task.sec), null);
      }
      if (task.id === id) {
        if (task.status === 'active') {
          return { ...task, status: 'completed', check: true, timerIsTrue: false };
        } else if (task.status === 'completed') {
          return { ...task, status: 'active', check: false, timerIsTrue: true };
        }
      }
      return task;
    });
    const newfilteredDataTasks = updatedDataTasks.filter(task => {
      if (filterName === 'active') {
        return task.status === 'active';
      } else if (filterName === 'completed') {
        return task.status === 'completed';
      } else {
        return true;
      }
    });

    setDataTasks(updatedDataTasks);
    setFilteredDataTasks(newfilteredDataTasks);
  };
  // изменение фильтрации по статусу
  const changeTaskList = status => {
    const newfilteredDataTasks = status === 'all' ? dataTasks : dataTasks.filter(el => el.status === status);
    setFilteredDataTasks(newfilteredDataTasks);
    setFilterName(status);
  };
  //изменение фильтрации
  const changeListAll = () => changeTaskList('all');
  const changeListActive = () => changeTaskList('active');
  const changeListComplete = () => changeTaskList('completed');
  //удаление задачи
  const deleteTask = id => {
    const idx = dataTasks.findIndex(el => el.id === id);
    const idxFilt = filteredDataTasks.findIndex(el => el.id === id);

    setDataTasks([...dataTasks.slice(0, idx), ...dataTasks.slice(idx + 1)]);
    setFilteredDataTasks([...filteredDataTasks.slice(0, idxFilt), ...filteredDataTasks.slice(idxFilt + 1)]);
  };
  //удаление выполненных задач
  const clearCompleateItems = () => {
    setDataTasks(dataTasks.filter(el => el.status !== 'completed'));
    setFilteredDataTasks(filteredDataTasks.filter(el => el.status !== 'completed'));
  };

  const taskDone = dataTasks.filter(el => el.status === 'completed').length;
  const taskLeft = dataTasks.length - taskDone;
  //запуск таймера
  const startTimer = (id, min, sec, timerLast) => {
    console.log('start');
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
              changeStatus(id);
              clearInterval(timerLast);
              return task;
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

      setFilteredDataTasks(prevFilteredDataTasks => {
        return prevFilteredDataTasks.map(task => {
          if (task.id === id && task.timerIsTrue) {
            min = Number(min);
            sec = Number(sec);

            if (min === 0 && sec === 0) {
              changeStatus(id);
              clearInterval(timerLast);
              return task;
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
  // останвка таймера
  const stopTimer = id => {
    console.log('stop');
    const task = dataTasks.find(task => task.id === id);
    if (task) {
      const newArr = dataTasks.map(task => {
        if (task.id === id) {
          clearInterval(task.timerLast);
          return { ...task, timerIsTrue: false, timerLast: null };
        }
        return task;
      });
      const newArrFilter = filteredDataTasks.map(task => {
        if (task.id === id) {
          return { ...task, timerIsTrue: false };
        }
        return task;
      });
      setDataTasks(newArr);
      setFilteredDataTasks(newArrFilter);
    }
  };

  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <NewTaskForm addItem={addItem} />
        </header>
        <section className="main">
          <TaskList
            filteredDataTasks={filteredDataTasks}
            toggleStatusTodo={changeStatus}
            onDeleted={deleteTask}
            onEdit={editTask}
            editSubmit={editSubmit}
            changeLabel={changeLabel}
            startTimer={startTimer}
            stopTimer={stopTimer}
          />
          <Footer
            itemsLeft={taskLeft}
            changeDirectoryAll={changeListAll}
            changeDirectoryActive={changeListActive}
            changeDirectoryComplete={changeListComplete}
            clearCompleateItems={clearCompleateItems}
          />
        </section>
      </section>
    </>
  );
};

export default App;
