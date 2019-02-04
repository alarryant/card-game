import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';


class GameSelection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            email: '',
            password: '',
            selectedOption: "option1",
            submitted: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleSubmit(event){
    event.preventDefault();
    let game = this.state.selectedOption;
    this.props.gameInfo(game);
    }

    handleOptionChange = event => {
        this.setState({
          selectedOption: event.target.value
        });
      };

    render() {
        return (
            <div>
            <h1>Choose your game</h1>
            <form onSubmit={this.handleSubmit}>
                <label>
                    <input
                      type="radio"
                      name="cardgame"
                      value="war"
                      checked={this.state.selectedOption === "war"}
                      onChange={this.handleOptionChange} />
                War
                </label>
                <label>
                    <input
                      type="radio"
                      name="cardgame"
                      value="blackjack"
                      checked={this.state.selectedOption === "blackjack"}
                      onChange={this.handleOptionChange} />
                Blackjack
                </label>
                <Button type="submit">Submit</Button>
            </form>
            </div>
        );
    }
}

export default GameSelection