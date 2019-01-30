import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            email: '',
            password: '',
            selectedOption: "option1",
            submitted: false
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleClose() {
    this.setState({ show: false });
    }

    handleShow() {
    this.setState({ show: true });
    }


    handleChange(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit(event){
    event.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    const gameType = this.state.selectedOption;
    this.props.loginInfo(email, password, gameType);
    }

    handleOptionChange = event => {
        this.setState({
          selectedOption: event.target.value
        });
      };

    render() {
        return (
            <div>
            <Button bsStyle="default" bsSize="large" onClick={this.handleShow}>
                Login
            </Button>

            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Login to Your Account</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.handleSubmit}>
                    <Modal.Body>
                        <h4>Email</h4>
                        <input type="email" placeholder="Email" name="email" onChange={this.handleChange}></input>
                        <h4>Password</h4>
                        <input type="password" placeholder="Password" name='password' onChange={this.handleChange}></input>
                        <h4>Choose Your Game</h4>
                        <label>
                            <input
                              type="radio"
                              name="cardgame"
                              value="war"
                              checked={this.state.selectedOption === "war"}
                              onChange={this.handleOptionChange}
                            />
                            War
                          </label>
                      <label>
                        <input
                          type="radio"
                          name="cardgame"
                          value="blackjack"
                          checked={this.state.selectedOption === "blackjack"}
                          onChange={this.handleOptionChange}
                        />
                        Blackjack
                      </label>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" onClick={this.handleClose}>Login</Button>
                    </Modal.Footer>
                </form>
            </Modal>
            </div>
        );
    }
}

export default Login