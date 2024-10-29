import { Component } from 'react';
import Footer from '../Footer/Footer';
import NewTaskForm from '../NewTaskForm/NewTaskForm';
import TaskList from '../TaskList/TaskList';
import { formatDistanceToNowStrict } from 'date-fns';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.maxId = 100;
    this.state = {
      dataTasks: [],
      filteredDataTasks: [],
      filterName: 'all',
      editTaskId: null,
      editTaskDescription: '',
    };
  }

  updateTimer = () => {
    setInterval(() => {
      this.setState(prevState => ({
        dataTasks: prevState.dataTasks.map(task => ({
          ...task,
          timeCreated: `created ${this.timeCreate(task.timer)}`,
        })),
        filteredDataTasks: prevState.filteredDataTasks.map(task => ({
          ...task,
          timeCreated: `created ${this.timeCreate(task.timer)}`,
        })),
      }));
    }, 15000);
  };

  createTodoItem = (description, min, sec, timer, status = '') => {
    return {
      id: this.maxId++,
      description,
      timeCreated: `created ${this.timeCreate(timer)}`,
      timer,
      status,
      defaulDescription: description,
      min,
      sec,
      timerIsTrue: false,
    };
  };

  timeCreate = timer => {
    return formatDistanceToNowStrict(new Date(timer), {
      addSuffix: true,
    });
  };

  addItem = (description, min, sec) => {
    const newItem = this.createTodoItem(description, min, sec, new Date() - 1);
    this.setState(({ dataTasks, filteredDataTasks, filterName }) => {
      const newArr = [newItem, ...dataTasks];
      const newFilterArr = [newItem, ...filteredDataTasks];

      if (filterName !== 'completed') {
        return {
          dataTasks: newArr,
          filteredDataTasks: newFilterArr,
        };
      } else {
        return {
          dataTasks: newArr,
        };
      }
    });
  };

  editTask = id => {
    const newDescription = this.state.dataTasks.find(el => el.id == id);
    this.setState({
      filteredDataTasks: this.state.filteredDataTasks.map(task => {
        if (task.id == id) {
          return { ...task, status: 'editing' };
        }
        if (task.status == 'editing') {
          const prevStatus = this.state.dataTasks.find(el => el.id == task.id);
          return { ...task, status: prevStatus.status };
        } else {
          return task;
        }
      }),
      editTaskDescription: newDescription.description,
    });
  };

  editSubmit = (e, id) => {
    e.preventDefault();
    const updateDataObject = this.state.dataTasks.find(el => el.id === id);
    this.setState(prevState => ({
      dataTasks: prevState.dataTasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            description: this.state.editTaskDescription,
            defaulDescription: this.state.editTaskDescription,
          };
        } else {
          return task;
        }
      }),
      filteredDataTasks: prevState.filteredDataTasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            description: this.state.editTaskDescription,
            status: updateDataObject.status,
            defaulDescription: this.state.editTaskDescription,
          };
        } else {
          return task;
        }
      }),
    }));
  };

  changeLabel = e => {
    this.setState({
      editTaskDescription: e.target.value,
    });
  };

  changeStatus = id => {
    const updatedDataTasks = this.state.dataTasks.map(task => {
      if (task.id == id) {
        if (task.status == '') {
          return { ...task, status: 'completed' };
        } else if (task.status == 'completed') {
          return { ...task, status: '' };
        }
      }
      return task;
    });

    const filteredDataTasks = updatedDataTasks.filter(el => {
      if (this.state.filterName === 'completed') {
        return el.status === 'completed';
      } else if (this.state.filterName === 'active') {
        return el.status === '';
      } else {
        return true;
      }
    });

    this.setState({
      dataTasks: updatedDataTasks,
      filteredDataTasks: filteredDataTasks,
    });
  };

  deleteTask = id => {
    this.setState(({ dataTasks, filteredDataTasks }) => {
      const idx = dataTasks.findIndex(el => el.id === id);
      const idxFilt = filteredDataTasks.findIndex(el => el.id === id);
      return {
        dataTasks: [...dataTasks.slice(0, idx), ...dataTasks.slice(idx + 1)],
        filteredDataTasks: [...filteredDataTasks.slice(0, idxFilt), ...filteredDataTasks.slice(idxFilt + 1)],
      };
    });
  };

  componentDidMount() {
    this.setState({ filteredDataTasks: this.state.dataTasks });
    this.updateTimer();
  }

  changeTaskList = status => {
    this.setState(() => {
      const filteredDataTasks =
        status === 'all' ? this.state.dataTasks : this.state.dataTasks.filter(el => el.status === status);

      return {
        filteredDataTasks,
        filterName: status,
      };
    });
  };

  changeListAll = () => this.changeTaskList('all');
  changeListActive = () => this.changeTaskList('');
  changeListComplete = () => this.changeTaskList('completed');

  clearCompleateItems = () => {
    this.setState(() => ({
      dataTasks: this.state.dataTasks.filter(el => el.status !== 'completed'),
      filteredDataTasks: this.state.filteredDataTasks.filter(el => el.status !== 'completed'),
    }));
  };

  updateTimerTask = async (id, min, sec) => {
    const newDataTasks = this.state.dataTasks.map(task => {
      if (task.id === id) {
        return { ...task, min, sec };
      }
      return task;
    });
    const newFilterTasks = this.state.filteredDataTasks.map(task => {
      if (task.id === id) {
        return { ...task, min, sec };
      }
      return task;
    });

    this.setState({ dataTasks: newDataTasks, filteredDataTasks: newFilterTasks });
  };

  // Таймер для задач
  startTimer = (id, min, sec, timerLast) => {
    console.log(id);

    const newDataTasks = this.state.dataTasks.map(task => {
      if (task.id == id) {
        return { ...task, timerIsTrue: true };
      }
      return task;
    });
    const newDataTasksFilter = this.state.filteredDataTasks.map(task => {
      if (task.id == id) {
        return { ...task, timerIsTrue: true };
      }
      return task;
    });
    this.setState({
      dataTasks: newDataTasks,
      filteredDataTasks: newDataTasksFilter,
    });

    console.log(this.state.dataTasks);
    console.log(this.state.filteredDataTasks);

    timerLast = setInterval(() => {
      if (
        this.state.dataTasks.find(el => el.id == id).timerIsTrue &&
        this.state.filteredDataTasks.find(el => el.id == id).timerIsTrue
      ) {
        if (min == 0 && sec == 0) {
          console.log('Таймер завершен!');
          this.changeStatus(id);
          clearInterval(timerLast);
        } else if (min >= 1) {
          if (sec === 0) {
            min--;
            sec = 59;
          } else {
            sec--;
          }
          console.log(`мин: ${min} сек: ${sec}`);
          return this.updateTimerTask(id, min, sec);
        } else if (min == 0 && sec > 0) {
          if (sec === 0) {
            min--;
            sec = 59;
          } else {
            sec--;
          }

          console.log(`мин: ${min} сек: ${sec}`);
          return this.updateTimerTask(id, min, sec);
        }
      } else {
        clearInterval(timerLast);
        console.log('pause');
      }
    }, 1000);
  };
  stopTimer = id => {
    const newArr = this.state.dataTasks.map(task => {
      if (task.id == id) {
        return { ...task, timerIsTrue: false };
      }
      return task;
    });
    const newArrFilter = this.state.filteredDataTasks.map(task => {
      if (task.id == id) {
        return { ...task, timerIsTrue: false };
      }
      return task;
    });
    this.setState({
      dataTasks: newArr,
      filteredDataTasks: newArrFilter,
    });
    console.log(this.state);
  };

  render() {
    const { filteredDataTasks } = this.state;
    const taskDone = this.state.dataTasks.filter(el => el.status === 'completed').length;
    const taskLeft = this.state.dataTasks.length - taskDone;

    return (
      <>
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <NewTaskForm addItem={this.addItem} />
          </header>
          <section className="main">
            <TaskList
              filteredDataTasks={filteredDataTasks}
              toggleStatusTodo={this.changeStatus}
              onDeleted={this.deleteTask}
              onEdit={this.editTask}
              editSubmit={this.editSubmit}
              changeLabel={this.changeLabel}
              startTimer={this.startTimer}
              stopTimer={this.stopTimer}
            />
            <Footer
              itemsLeft={taskLeft}
              changeDirectoryAll={this.changeListAll}
              changeDirectoryActive={this.changeListActive}
              changeDirectoryComplete={this.changeListComplete}
              clearCompleateItems={this.clearCompleateItems}
            />
          </section>
        </section>
      </>
    );
  }
}

export default App;
