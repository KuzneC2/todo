import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './NewTaskForm.css';

export default class NewTaskForm extends Component {
  constructor() {
    super();
    this.state = {
      labelTask: '',
      labelMin: '',
      labelSec: '',
    };
  }

  submitForm = e => {
    e.preventDefault();
    this.props.addItem(this.state.labelTask, this.state.labelMin, this.state.labelSec);
    this.setState({
      labelTask: '',
      labelMin: '',
      labelSec: '',
    });
  };
  onLabelChangeTitle = e => {
    this.setState({
      labelTask: e.target.value,
    });
  };
  onLabelChangeMin = e => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      this.setState({
        labelMin: e.target.value,
      });
    }
  };
  onLabelChangeSec = e => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || (re.test(e.target.value) && e.target.value < 60)) {
      this.setState({
        labelSec: e.target.value,
      });
    }
  };
  render() {
    return (
      <form className="new-todo-form" onSubmit={this.submitForm}>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          onChange={this.onLabelChangeTitle}
          value={this.state.labelTask}
          onSubmit={this.submitForm}
          required
        />
        <input
          className="new-todo-form__timer"
          placeholder="Min"
          onChange={this.onLabelChangeMin}
          value={this.state.labelMin}
          maxLength={2}
          required
        />
        <input
          className="new-todo-form__timer"
          placeholder="Sec"
          onChange={this.onLabelChangeSec}
          value={this.state.labelSec}
          maxLength={2}
          required
        />
        <button type="submit"></button>
      </form>
    );
  }
}

NewTaskForm.propTypes = {
  addItem: PropTypes.func,
};
NewTaskForm.defaultProps = {
  addItem: () => {},
};
