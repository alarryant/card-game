import React, {Component} from 'react';
import Register from './Register.jsx';


class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
    return (
    <nav>
        <h1>Angenica-Mongela Games</h1>
    </nav>
    );
    }
}

class Header extends Component {

    render() {
        return(
            <div>
                <NavBar/>
                <Register registerInfo={this.props.registerInfo}/>
            </div>
        )
    }
}

export default Header;