import { useState } from 'react';
import './NewTaskForm.css';

const NewTaskForm = props => {
  const [labelTask, setLabelTask] = useState('');
  const [labelMin, setLabelMin] = useState('');
  const [labelSec, setLabelSec] = useState('');

  const submitForm = e => {
    e.preventDefault();

    props.addItem(labelTask, labelMin, labelSec);
    setLabelTask('');
    setLabelMin('');
    setLabelSec('');
  };

  const onLabelChangeTitle = e => {
    setLabelTask(e.target.value);
  };

  const onLabelChangeMin = e => {
    const re = /^[0-9\b]+$/;

    if (e.target.value === '' || re.test(e.target.value)) {
      setLabelMin(e.target.value);
    }
  };
  const onLabelChangeSec = e => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || (re.test(e.target.value) && e.target.value < 60)) {
      setLabelSec(e.target.value);
    }
  };

  return (
    <form className="new-todo-form" onSubmit={submitForm}>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        onChange={onLabelChangeTitle}
        value={labelTask}
        onSubmit={submitForm}
        required
      />
      <input
        className="new-todo-form__timer"
        placeholder="Min"
        onChange={onLabelChangeMin}
        value={labelMin}
        maxLength={2}
        required
      />
      <input
        className="new-todo-form__timer"
        placeholder="Sec"
        onChange={onLabelChangeSec}
        value={labelSec}
        maxLength={2}
        required
      />
      <button type="submit"></button>
    </form>
  );
};

export default NewTaskForm;
