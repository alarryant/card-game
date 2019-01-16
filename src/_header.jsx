import React, {Component} from 'react';


function NavBar(props){
    return (
    <nav>
        <h1>Angenica-Mongela Games</h1>
        <button>Register</button>
    </nav>
    );
}

class Header extends Component {
    
    render() {
        return(
            <div>
                <NavBar/>
            </div>
        )
    }
}

export default Header;