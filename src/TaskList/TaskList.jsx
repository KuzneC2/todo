import { Component } from 'react';
import PropTypes from 'prop-types';
import Task from '../Task/Task';

export default class TaskList extends Component {
  render() {
    const {
      dataTasks,
      toggleStatusTodo,
      onDeleted,
      onEdit,
      editSubmit,
      changeLabel,
      startTimer,
      stopTimer,
      cancelEdit,
      editTaskDescription,
    } = this.props;

    return (
      <ul className="todo-list">
        {dataTasks.map(task => (
          <Task
            key={task.id}
            status={task.status}
            description={task.description}
            timeCreated={task.timeCreated}
            toggleStatusTodo={() => toggleStatusTodo(task.id)}
            onDeleted={() => onDeleted(task.id)}
            onEdit={() => onEdit(task.id)}
            editSubmit={e => editSubmit(e, task.id)}
            changeLabel={e => changeLabel(e)}
            defaulDescription={task.defaulDescription}
            min={task.min}
            sec={task.sec}
            stopTimer={() => stopTimer(task.id)}
            startTimer={() => startTimer(task.id, task.min, task.sec, task.timerIsTrue)} // Передача id задачи в startTimer
            timerIsTrue={task.timerIsTrue}
            check={task.check}
            editing={task.editing}
            cancelEdit={e => cancelEdit(e, task.id)}
            editTaskDescription={editTaskDescription}
          />
        ))}
      </ul>
    );
  }
}

TaskList.propTypes = {
  filteredDataTasks: PropTypes.array,
  toggleStatusTodo: PropTypes.func,
  onDeleted: PropTypes.func,
  onEdit: PropTypes.func,
  editSubmit: PropTypes.func,
  changeLabel: PropTypes.func,
};
TaskList.defaultProps = {
  filteredDataTasks: [],
  toggleStatusTodo: () => {},
  onDeleted: () => {},
  onEdit: () => {},
  editSubmit: () => {},
  changeLabel: () => {},
};
