import { useState } from 'react';

const TasksFilter = props => {
  const [filterDirectory, setFilterDirectory] = useState('all');

  const changeDirectory = filter => {
    setFilterDirectory(filter);

    props.onChangeFilter(filter);
  };

  return (
    <ul className="filters">
      <li>
        <button className={filterDirectory === 'all' ? 'selected' : ''} onClick={() => changeDirectory('all')}>
          All
        </button>
      </li>
      <li>
        <button className={filterDirectory === 'active' ? 'selected' : ''} onClick={() => changeDirectory('active')}>
          Active
        </button>
      </li>
      <li>
        <button className={filterDirectory === 'completed' ? 'selected' : ''} onClick={() => changeDirectory('completed')}>
          Completed
        </button>
      </li>
    </ul>
  );
};

export default TasksFilter;
