const Task = ({
  status,
  description,
  timeCreated,
  toggleStatusTodo,
  onDeleted,
  onEdit,
  editSubmit,
  changeLabel,
  defaulDescription,
  sec,
  min,
  startTimer,
  stopTimer,
  check,
  timerIsTrue,
  editing,
}) => {
  if (editing) {
    return (
      <li className="editing">
        <div className="view">
          <input className="toggle" type="checkbox" />
          <label>
            <span className="description">{description}</span>
            <span className="created">{timeCreated}</span>
          </label>
          <button className="icon icon-edit"></button>
          <button className="icon icon-destroy" onClick={onDeleted}></button>
        </div>
        <form action="" onSubmit={editSubmit}>
          <input type="text" className="edit" value={defaulDescription} onChange={changeLabel} />
        </form>
      </li>
    );
  }

  return (
    <li className={status}>
      <div className="view">
        <input className="toggle" type="checkbox" onChange={toggleStatusTodo} checked={check} />

        <label>
          <span className="title">{description}</span>
          <span className="description">
            <button className="icon icon-play" onClick={startTimer} disabled={timerIsTrue}></button>
            <button className="icon icon-pause" onClick={stopTimer} disabled={!timerIsTrue}></button>
            <p className="todo-timer">{`${min}:${sec}`}</p>
          </span>
          <span className="created">{timeCreated}</span>
        </label>
        <button className="icon icon-edit" onClick={onEdit}></button>
        <button className="icon icon-destroy" onClick={onDeleted}></button>
      </div>
    </li>
  );
};

export default Task;
