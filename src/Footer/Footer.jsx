import PropTypes from 'prop-types';
import { Component } from 'react';
import TasksFilter from '../TasksFilter/TasksFilter';

export default class Footer extends Component {
  render() {
    const { itemsLeft, clearCompleateItems, onChangeFilter } = this.props;
    return (
      <footer className="footer">
        <span className="todo-count">{itemsLeft} items left</span>
        <TasksFilter onChangeFilter={filter => onChangeFilter(filter)}></TasksFilter>
        <button className="clear-completed" onClick={() => clearCompleateItems()}>
          Clear completed
        </button>
      </footer>
    );
  }
}

Footer.propTypes = {
  itemsLeft: PropTypes.node,
  changeDirectoryAll: PropTypes.func,
  changeDirectoryActive: PropTypes.func,
  changeDirectoryComplete: PropTypes.func,
  clearCompleateItems: PropTypes.func,
};

Footer.defaultProps = {
  itemsLeft: '',
  changeDirectoryAll: () => {},
  changeDirectoryActive: () => {},
  changeDirectoryComplete: () => {},
  clearCompleateItems: () => {},
};
