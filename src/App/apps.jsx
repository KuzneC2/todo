// import { useEffect, useState, useRef } from 'react';
// import Footer from '../Footer/Footer';
// import NewTaskForm from '../NewTaskForm/NewTaskForm';
// import TaskList from '../TaskList/TaskList';
// import { formatDistanceToNowStrict } from 'date-fns';
// import './App.css';

// const App = () => {
//   const [dataTasks, setDataTasks] = useState([]);
//   const [filteredDataTasks, setFilteredDataTasks] = useState([]);
//   const [filterName, setFilterName] = useState('all');
//   const [editTaskDescription, setEditTaskDescription] = useState('');
//   const maxId = useRef(100);
//   const timersRef = useRef({})

//   useEffect(() => {
//     setFilteredDataTasks(dataTasks);
//     updateTimer();
//   }, []);

//   const updateTimer = () => {
//     setInterval(() => {
//       setDataTasks(prevDataTask =>
//         prevDataTask.map(task => ({
//           ...task,
//           timeCreated: `created ${timeCreate(task.timer)}`,
//         })),
//       );
//       setFilteredDataTasks(prevFilteredDataTasks =>
//         prevFilteredDataTasks.map(task => ({
//           ...task,
//           timeCreated: `created ${timeCreate(task.timer)}`,
//         })),
//       );
//     }, 15000);
//   };

//   const createTodoItem = (description, min, sec, timer) => {
//     return {
//       id: maxId.current++,
//       description,
//       timeCreated: `created ${timeCreate(timer)}`,
//       timer,
//       status: 'active',
//       defaulDescription: description,
//       min,
//       sec,
//       timerIsTrue: true,
//       check: false,
//     };
//   };

//   const timeCreate = timer => {
//     return formatDistanceToNowStrict(new Date(timer), {
//       addSuffix: true,
//     });
//   };

//   const addItem = (description, min, sec) => {
//     const newItem = createTodoItem(description, min, sec, new Date() - 1);
//     const newArr = [newItem, ...dataTasks];
//     const newFilterArr = [newItem, ...filteredDataTasks];
//     if (filterName !== 'completed') {
//       setDataTasks(newArr);
//       setFilteredDataTasks(newFilterArr);
//     } else {
//       setDataTasks(newArr);
//     }
//   };

//   const editTask = id => {
//     const newDescription = dataTasks.find(el => el.id === id);
//     setFilteredDataTasks(
//       filteredDataTasks.map(task => {
//         if (task.id === id) {
//           return { ...task, status: 'editing' };
//         }
//         if (task.status === 'editing') {
//           const prevStatus = dataTasks.find(el => el.id === task.id);
//           return { ...task, status: prevStatus.status };
//         } else {
//           return task;
//         }
//       }),
//     );
//     setEditTaskDescription(newDescription.description);
//   };

//   const editSubmit = (e, id) => {
//     e.preventDefault();
//     const updateDataObject = dataTasks.find(el => el.id === id);
//     setDataTasks(prevDataTasks =>
//       prevDataTasks.map(task => {
//         if (task.id === id) {
//           return {
//             ...task,
//             description: editTaskDescription,
//             defaulDescription: editTaskDescription,
//           };
//         } else {
//           return task;
//         }
//       }),
//     );
//     setFilteredDataTasks(prevFilteredDataTasks =>
//       prevFilteredDataTasks.map(task => {
//         if (task.id === id) {
//           return {
//             ...task,
//             description: editTaskDescription,
//             status: updateDataObject.status,
//             defaulDescription: editTaskDescription,
//           };
//         } else {
//           return task;
//         }
//       }),
//     );
//   };

//   const changeLabel = e => {
//     setEditTaskDescription(e.target.value);
//   };

//   const changeStatus = id => {
//     const updatedDataTasks = dataTasks.map(task => {
//         if (task.id == id && task.status == 'completed') {
//       startTimer(task.id, Number(task.min), Number(task.sec), null);
//         }
//       if (task.id === id) {
//         if (task.status === 'active') {
//           return { ...task, status: 'completed', check: true, timerIsTrue: false };
//         } else if (task.status === 'completed') {
//           return { ...task, status: 'active', check: false, timerIsTrue: true };
//         }
//       }
//       return task;
//     });
//     const newfilteredDataTasks = updatedDataTasks.filter(task => {
//       if (filterName === 'active') {
//         return task.status === 'active';
//       } else if (filterName === 'completed') {
//         return task.status === 'completed';
//       } else {
//         return true;
//       }
//     });

//     setDataTasks(updatedDataTasks);
//     setFilteredDataTasks(newfilteredDataTasks);
//   };

//   const changeTaskList = status => {
//     const newfilteredDataTasks = status === 'all' ? dataTasks : dataTasks.filter(el => el.status === status);
//     setFilteredDataTasks(newfilteredDataTasks);
//     setFilterName(status);
//   };

//   const changeListAll = () => changeTaskList('all');
//   const changeListActive = () => changeTaskList('active');
//   const changeListComplete = () => changeTaskList('completed');

//   const deleteTask = id => {
//     const idx = dataTasks.findIndex(el => el.id === id);
//     const idxFilt = filteredDataTasks.findIndex(el => el.id === id);

//     setDataTasks([...dataTasks.slice(0, idx), ...dataTasks.slice(idx + 1)]);
//     setFilteredDataTasks([...filteredDataTasks.slice(0, idxFilt), ...filteredDataTasks.slice(idxFilt + 1)]);
//   };

//   const clearCompleateItems = () => {
//     setDataTasks(dataTasks.filter(el => el.status !== 'completed'));
//     setFilteredDataTasks(filteredDataTasks.filter(el => el.status !== 'completed'));
//   };

//   const taskDone = dataTasks.filter(el => el.status === 'completed').length;
//   const taskLeft = dataTasks.length - taskDone;

//   const updateTimerTask = async (id, min, sec) => {
//     const newDataTasks = dataTasks.map(task => {
//       if (task.id === id) {
//         const formattedMin = min < 10 ? `0${min}` : min;
//         const formattedSec = sec < 10 ? `0${sec}` : sec;
//         return { ...task, min: formattedMin, sec: formattedSec };
//       }
//       return task;
//     });
//     const newFilterTasks = filteredDataTasks.map(task => {
//       if (task.id === id) {
//         const formattedMin = min < 10 ? `0${min}` : min;
//         const formattedSec = sec < 10 ? `0${sec}` : sec;
//         return { ...task, min: formattedMin, sec: formattedSec };
//       }
//       return task;
//     });

//     setDataTasks(newDataTasks);
//     setFilteredDataTasks(newFilterTasks);
//   };

//   const startTimer = (id, min, sec, timerLast) => {
//     const newDataTasks = dataTasks.map(task => {
//       if (task.id == id) {
//         return { ...task, timerIsTrue: true };
//       }
//       return task;
//     });

//     setDataTasks(newDataTasks);

//     timerLast = setInterval(() => {
//       if (dataTasks.find(el => el.id == id) == undefined) {
//         clearInterval(timerLast);
//       } else if (dataTasks.find(el => el.id == id).timerIsTrue) {
//         min = Number(min);
//         sec = Number(sec);
//         if (min == 0 && sec == 0) {
//           changeStatus(id);
//           clearInterval(timerLast);
//         } else if (min >= 1) {
//           if (sec === 0) {
//             min--;
//             sec = 59;
//           } else {
//             sec--;
//           }
//           return updateTimerTask(id, min, sec);
//         } else if (min == 0 && sec > 0) {
//           if (sec === 0) {
//             min--;
//             sec = 59;
//           } else {
//             sec--;
//           }

//           return updateTimerTask(id, min, sec);
//         }
//       } else {
//         clearInterval(timerLast);
//       }
//     }, 1000);
//   };

//   const stopTimer = id => {
//     console.log('stop');
//     const task = dataTasks.find(task => task.id === id);
//     if (task) {
//       const newArr = dataTasks.map(task => {
//         if (task.id === id) {
//           clearInterval(task.timerLast);
//           return { ...task, timerIsTrue: false, timerLast: null };
//         }
//         return task;
//       });
//       const newArrFilter = filteredDataTasks.map(task => {
//         if (task.id === id) {
//           return { ...task, timerIsTrue: false };
//         }
//         return task;
//       });

//     setDataTasks(newArr);
//     setFilteredDataTasks(newArrFilter)

//     }
//   };

//   return (
//     <>
//       <section className="todoapp">
//         <header className="header">
//           <h1>todos</h1>
//           <NewTaskForm addItem={addItem} />
//         </header>
//         <section className="main">
//           <TaskList
//             filteredDataTasks={filteredDataTasks}
//             toggleStatusTodo={changeStatus}
//             onDeleted={deleteTask}
//             onEdit={editTask}
//             editSubmit={editSubmit}
//             changeLabel={changeLabel}
//             startTimer={startTimer}
//             stopTimer={stopTimer}
//           />
//           <Footer
//             itemsLeft={taskLeft}
//             changeDirectoryAll={changeListAll}
//             changeDirectoryActive={changeListActive}
//             changeDirectoryComplete={changeListComplete}
//             clearCompleateItems={clearCompleateItems}
//           />
//         </section>
//       </section>
//     </>
//   );
// };

// export default App;

// import { Component } from 'react';
// import Footer from '../Footer/Footer';
// import NewTaskForm from '../NewTaskForm/NewTaskForm';
// import TaskList from '../TaskList/TaskList';
// import { formatDistanceToNowStrict } from 'date-fns';
// import './App.css';

// class App extends Component {
//   constructor() {
//     super();
//     this.maxId = 100;
//     this.state = {
//       dataTasks: [],
//       filteredDataTasks: [],
//       filterName: 'all',
//       editTaskId: null,
//       editTaskDescription: '',
//     };
//   }

//   updateTimer = () => {
//     setInterval(() => {
//       this.setState(prevState => ({
//         dataTasks: prevState.dataTasks.map(task => ({
//           ...task,
//           timeCreated: `created ${this.timeCreate(task.timer)}`,
//         })),
//         filteredDataTasks: prevState.filteredDataTasks.map(task => ({
//           ...task,
//           timeCreated: `created ${this.timeCreate(task.timer)}`,
//         })),
//       }));
//     }, 15000);
//   };

//   createTodoItem = (description, min, sec, timer) => {
//     return {
//       id: this.maxId++,
//       description,
//       timeCreated: `created ${this.timeCreate(timer)}`,
//       timer,
//       status: 'active',
//       defaulDescription: description,
//       min,
//       sec,
//       timerIsTrue: true,
//       check: false,
//     };
//   };

//   timeCreate = timer => {
//     return formatDistanceToNowStrict(new Date(timer), {
//       addSuffix: true,
//     });
//   };

//   addItem = (description, min, sec) => {
//     const newItem = this.createTodoItem(description, min, sec, new Date() - 1);
//     this.setState(({ dataTasks, filteredDataTasks, filterName }) => {
//       const newArr = [newItem, ...dataTasks];
//       const newFilterArr = [newItem, ...filteredDataTasks];

//       if (filterName !== 'completed') {
//         return {
//           dataTasks: newArr,
//           filteredDataTasks: newFilterArr,
//         };
//       } else {
//         return {
//           dataTasks: newArr,
//         };
//       }
//     });
//   };

//   editTask = id => {
//     const newDescription = this.state.dataTasks.find(el => el.id == id);
//     this.setState({
//       filteredDataTasks: this.state.filteredDataTasks.map(task => {
//         if (task.id == id) {
//           return { ...task, status: 'editing' };
//         }
//         if (task.status == 'editing') {
//           const prevStatus = this.state.dataTasks.find(el => el.id == task.id);
//           return { ...task, status: prevStatus.status };
//         } else {
//           return task;
//         }
//       }),
//       editTaskDescription: newDescription.description,
//     });
//   };

//   editSubmit = (e, id) => {
//     e.preventDefault();
//     const updateDataObject = this.state.dataTasks.find(el => el.id === id);
//     this.setState(prevState => ({
//       dataTasks: prevState.dataTasks.map(task => {
//         if (task.id === id) {
//           return {
//             ...task,
//             description: this.state.editTaskDescription,
//             defaulDescription: this.state.editTaskDescription,
//           };
//         } else {
//           return task;
//         }
//       }),
//       filteredDataTasks: prevState.filteredDataTasks.map(task => {
//         if (task.id === id) {
//           return {
//             ...task,
//             description: this.state.editTaskDescription,
//             status: updateDataObject.status,
//             defaulDescription: this.state.editTaskDescription,
//           };
//         } else {
//           return task;
//         }
//       }),
//     }));
//   };

//   changeLabel = e => {
//     this.setState({
//       editTaskDescription: e.target.value,
//     });
//   };

//   changeStatus = id => {
//     const updatedDataTasks = this.state.dataTasks.map(task => {
//       if (task.id == id && task.status == 'completed') {
//         this.startTimer(task.id, Number(task.min), Number(task.sec), null);
//       }
//       if (task.id === id) {
//         if (task.status === 'active') {
//           return { ...task, status: 'completed', check: true, timerIsTrue: false };
//         } else if (task.status === 'completed') {
//           return { ...task, status: 'active', check: false, timerIsTrue: true };
//         }
//       }
//       return task;
//     });
//     const filteredDataTasks = updatedDataTasks.filter(task => {
//       if (this.state.filterName === 'active') {
//         return task.status === 'active';
//       } else if (this.state.filterName === 'completed') {
//         return task.status === 'completed';
//       } else {
//         return true;
//       }
//     });
//     this.setState({
//       dataTasks: updatedDataTasks,
//       filteredDataTasks: filteredDataTasks,
//     });
//   };

//   deleteTask = id => {
//     this.setState(({ dataTasks, filteredDataTasks }) => {
//       const idx = dataTasks.findIndex(el => el.id === id);
//       const idxFilt = filteredDataTasks.findIndex(el => el.id === id);
//       return {
//         dataTasks: [...dataTasks.slice(0, idx), ...dataTasks.slice(idx + 1)],
//         filteredDataTasks: [...filteredDataTasks.slice(0, idxFilt), ...filteredDataTasks.slice(idxFilt + 1)],
//       };
//     });
//   };

//   componentDidMount() {
//     this.setState({ filteredDataTasks: this.state.dataTasks });
//     this.updateTimer();
//   }

//   changeTaskList = status => {
//     this.setState(() => {
//       const filteredDataTasks =
//         status === 'all' ? this.state.dataTasks : this.state.dataTasks.filter(el => el.status === status);

//       return {
//         filteredDataTasks,
//         filterName: status,
//       };
//     });
//   };

//   changeListAll = () => this.changeTaskList('all');
//   changeListActive = () => this.changeTaskList('active');
//   changeListComplete = () => this.changeTaskList('completed');

//   clearCompleateItems = () => {
//     this.setState(() => ({
//       dataTasks: this.state.dataTasks.filter(el => el.status !== 'completed'),
//       filteredDataTasks: this.state.filteredDataTasks.filter(el => el.status !== 'completed'),
//     }));
//   };

//   updateTimerTask = (id, min, sec) => {
//     const newDataTasks = this.state.dataTasks.map(task => {
//       if (task.id === id) {
//         const formattedMin = min < 10 ? `0${min}` : min;
//         const formattedSec = sec < 10 ? `0${sec}` : sec;
//         return { ...task, min: formattedMin, sec: formattedSec };
//       }
//       return task;
//     });
//     const newFilterTasks = this.state.filteredDataTasks.map(task => {
//       if (task.id === id) {
//         const formattedMin = min < 10 ? `0${min}` : min;
//         const formattedSec = sec < 10 ? `0${sec}` : sec;
//         return { ...task, min: formattedMin, sec: formattedSec };
//       }
//       return task;
//     });
//     this.setState({
//       dataTasks: newDataTasks,
//       filteredDataTasks: newFilterTasks,
//     });
//   };

//   // Таймер для задач
//   startTimer = (id, min, sec, timerLast) => {
//     const newDataTasks = this.state.dataTasks.map(task => {
//       if (task.id == id) {
//         return { ...task, timerIsTrue: true };
//       }
//       return task;
//     });
//     const newDataTasksFilter = this.state.filteredDataTasks.map(task => {
//       if (task.id == id) {
//         return { ...task };
//       }
//       return task;
//     });
//     this.setState({
//       dataTasks: newDataTasks,
//       filteredDataTasks: newDataTasksFilter,
//     });
//     timerLast = setInterval(() => {
//       if (this.state.dataTasks.find(el => el.id == id) == undefined) {
//         clearInterval(timerLast);
//       } else if (this.state.dataTasks.find(el => el.id == id).timerIsTrue) {
//         min = Number(min);
//         sec = Number(sec);
//         if (min == 0 && sec == 0) {
//           this.changeStatus(id);
//           clearInterval(timerLast);
//         } else if (min >= 1) {
//           if (sec === 0) {
//             min--;
//             sec = 59;
//           } else {
//             sec--;
//           }
//           return this.updateTimerTask(id, min, sec);
//         } else if (min == 0 && sec > 0) {
//           if (sec === 0) {
//             min--;
//             sec = 59;
//           } else {
//             sec--;
//           }

//           return this.updateTimerTask(id, min, sec);
//         }
//       } else {
//         clearInterval(timerLast);
//       }
//     }, 1000);
//   };

//   stopTimer = id => {
//     const task = this.state.dataTasks.find(task => task.id === id);
//     if (task) {
//       const newArr = this.state.dataTasks.map(task => {
//         if (task.id === id) {
//           clearInterval(task.timerLast);
//           return { ...task, timerIsTrue: false, timerLast: null };
//         }
//         return task;
//       });
//       const newArrFilter = this.state.filteredDataTasks.map(task => {
//         if (task.id === id) {
//           return { ...task, timerIsTrue: false };
//         }
//         return task;
//       });

//       this.setState({
//         dataTasks: newArr,
//         filteredDataTasks: newArrFilter,
//       });
//     }
//   };

//   render() {
//     const { filteredDataTasks } = this.state;
//     const taskDone = this.state.dataTasks.filter(el => el.status === 'completed').length;
//     const taskLeft = this.state.dataTasks.length - taskDone;

//     return (
//       <>
//         <section className="todoapp">
//           <header className="header">
//             <h1>todos</h1>
//             <NewTaskForm addItem={this.addItem} />
//           </header>
//           <section className="main">
//             <TaskList
//               filteredDataTasks={filteredDataTasks}
//               toggleStatusTodo={this.changeStatus}
//               onDeleted={this.deleteTask}
//               onEdit={this.editTask}
//               editSubmit={this.editSubmit}
//               changeLabel={this.changeLabel}
//               startTimer={this.startTimer}
//               stopTimer={this.stopTimer}
//             />
//             <Footer
//               itemsLeft={taskLeft}
//               changeDirectoryAll={this.changeListAll}
//               changeDirectoryActive={this.changeListActive}
//               changeDirectoryComplete={this.changeListComplete}
//               clearCompleateItems={this.clearCompleateItems}
//             />
//           </section>
//         </section>
//       </>
//     );
//   }
// }

// export default App;
