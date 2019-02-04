import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';


class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            email: '',
            password: '',
            username: '',
            submitted: false
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
    const username = this.state.username;
    this.props.registerInfo(email, password, username);
    }

    render() {
        return (
            <div>
            <Button bsStyle="default" bsSize="large" onClick={this.handleShow}>
                Register
            </Button>

            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Register Your Account</Modal.Title>
                </Modal.Header>
                <form onSubmit={this.handleSubmit}>
                    <Modal.Body>
                        <h4>Email</h4>
                        <input type="email" placeholder="Enter your email" name="email" onChange={this.handleChange}></input>
                        <h4>Password</h4>
                        <input type="password" placeholder="Enter a password" name='password' onChange={this.handleChange}></input>
                        <h4>Username</h4>
                        <input type="username" placeholder="Enter a username" name="username" onChange={this.handleChange}></input>
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

export default Register