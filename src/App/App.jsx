import { Component } from "react";
import Footer from "../Footer/Footer";
import NewTaskForm from "../NewTaskForm/NewTaskForm";
import TaskList from "../TaskList/TaskList";
import { formatDistanceToNowStrict } from "date-fns";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.maxId = 100;
    this.state = {
      dataTasks: [
        this.createTodoItem("обезуметь", "2024-10-14T15:05:10", "completed"),
        this.createTodoItem("поспать 8 часов", "2025-02-14T14:59:10", ""),
        this.createTodoItem("сделать проект", "2025-04-14T14:59:00"),
      ],
      filteredDataTasks: [],
      filterName: "all",
      editTaskId: null,
      editTaskDescription: "",
    };
  }

  updateTimer = () => {
    setInterval(() => {
      this.setState((prevState) => ({
        dataTasks: prevState.dataTasks.map((task) => ({
          ...task,
          timeCreated: `created ${this.timeCreate(task.timer)}`,
        })),
        filteredDataTasks: prevState.filteredDataTasks.map((task) => ({
          ...task,
          timeCreated: `created ${this.timeCreate(task.timer)}`,
        })),
      }));
    }, 15000);
  };

  createTodoItem = (description, timer, status = "") => {
    return {
      id: this.maxId++,
      description,
      timeCreated: `created ${this.timeCreate(timer)}`,
      timer,
      status,
      defaulDescription: description,
    };
  };

  timeCreate = (timer) => {
    return formatDistanceToNowStrict(new Date(timer), {
      addSuffix: true,
    });
  };

  addItem = (description) => {
    const newItem = this.createTodoItem(description, new Date() - 1);
    this.setState(({ dataTasks, filteredDataTasks, filterName }) => {
      const newArr = [newItem, ...dataTasks];
      const newFilterArr = [newItem, ...filteredDataTasks];

      if (filterName !== "completed") {
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

  editTask = (id) => {
    const newDescription = this.state.dataTasks.find((el) => el.id == id);
    this.setState({
      filteredDataTasks: this.state.filteredDataTasks.map((task) => {
        if (task.id == id) {
          return { ...task, status: "editing" };
        }
        if (task.status == "editing") {
          const prevStatus = this.state.dataTasks.find(
            (el) => el.id == task.id,
          );
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
    const updateDataObject = this.state.dataTasks.find((el) => el.id === id);
    this.setState((prevState) => ({
      dataTasks: prevState.dataTasks.map((task) => {
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
      filteredDataTasks: prevState.filteredDataTasks.map((task) => {
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

  changeLabel = (e) => {
    this.setState({
      editTaskDescription: e.target.value,
    });
  };

  changeStatus = (id) => {
    const updatedDataTasks = this.state.dataTasks.map((task) => {
      if (task.id == id) {
        if (task.status == "") {
          return { ...task, status: "completed" };
        } else if (task.status == "completed") {
          return { ...task, status: "" };
        }
      }
      return task;
    });

    const filteredDataTasks = updatedDataTasks.filter((el) => {
      if (this.state.filterName === "completed") {
        return el.status === "completed";
      } else if (this.state.filterName === "active") {
        return el.status === "";
      } else {
        return true;
      }
    });

    this.setState({
      dataTasks: updatedDataTasks,
      filteredDataTasks: filteredDataTasks,
    });
  };

  deleteTask = (id) => {
    this.setState(({ dataTasks, filteredDataTasks }) => {
      const idx = dataTasks.findIndex((el) => el.id === id);
      const idxFilt = filteredDataTasks.findIndex((el) => el.id === id);
      return {
        dataTasks: [...dataTasks.slice(0, idx), ...dataTasks.slice(idx + 1)],
        filteredDataTasks: [
          ...filteredDataTasks.slice(0, idxFilt),
          ...filteredDataTasks.slice(idxFilt + 1),
        ],
      };
    });
  };

  componentDidMount() {
    this.setState({ filteredDataTasks: this.state.dataTasks });
    this.updateTimer();
  }

  changeListAll = () => {
    this.setState(() => ({
      filteredDataTasks: this.state.dataTasks,
      filterName: "all",
    }));
  };

  changeListActive = () => {
    this.setState(() => ({
      filteredDataTasks: this.state.dataTasks.filter((el) => el.status === ""),
      filterName: "active",
    }));
  };

  changeListComplete = () => {
    this.setState(() => ({
      filteredDataTasks: this.state.dataTasks.filter(
        (el) => el.status === "completed",
      ),
      filterName: "completed",
    }));
  };

  clearCompleateItems = () => {
    this.setState(() => ({
      dataTasks: this.state.dataTasks.filter((el) => el.status !== "completed"),
      filteredDataTasks: this.state.filteredDataTasks.filter(
        (el) => el.status !== "completed",
      ),
    }));
  };

  render() {
    const { filteredDataTasks } = this.state;
    const taskDone = this.state.dataTasks.filter(
      (el) => el.status === "completed",
    ).length;
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
