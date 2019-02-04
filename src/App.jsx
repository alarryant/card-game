import React, {Component} from 'react';
import Header from './_header.jsx';
import Login from './Login.jsx';
import Blackjack from './Blackjack.jsx';
import GameSelection from './GameSelection.jsx';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {players: [],
                  loggedIn: false,
                  chooseGame: false};
    this.sendBlackjackHands = this.sendBlackjackHands.bind(this);
    this.loginInfo = this.loginInfo.bind(this);
    this.registerInfo = this.registerInfo.bind(this);
    this.gameInfo = this.gameInfo.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
  }

  loginInfo = (email, password) => {
    const userLogin = {
      type: 'login',
      email: email,
      password: password
    };
    this.setState({loggedIn: true, chooseGame: true});
    this.socket.send(JSON.stringify(userLogin));
  }

  registerInfo = (email, password, username) => {
    const userRegister = {
      type: 'register',
      email: email,
      password: password,
      username: username
    };
    this.socket.send(JSON.stringify(userRegister));
    this.setState({loggedIn: true, chooseGame: true});
  };

  gameInfo = game => {
    const gameData= {
      type: 'gameType',
      gameType: game,
      user: this.state.user
    };

    this.setState({chooseGame: false});
    this.socket.send(JSON.stringify(gameData));
  };

  sendBlackjackHands = hands => {
    let handData = {type: "blackjackHand", data: hands, players: this.state.players}
    this.socket.send(JSON.stringify(handData));
  };

  displayMessage = msg => {
    return (<h1>{this.state.msg}</h1>)
  };

  componentDidMount() {
    // connects to Web Socket server
    this.socket = new WebSocket(
      'ws://localhost:3001'
    );

    // receives data from server
    this.socket.onmessage = (event) => {
      let serverData = JSON.parse(event.data);

      switch (serverData.type) {

        case 'login':
          this.setState({ user: serverData.user,
                          chooseGame: true});
        break;

        case 'register':
          this.setState({ user: serverData.user,
                          chooseGame: true});
        break;

        case 'gameType':
          if (serverData.users && (serverData.users.length === 2)) {
            this.setState({ currentPlayer: serverData.player,
                            inQueue: false,
                            players: serverData.users,
                            game_id: serverData.game_id,
                            currentDeck: serverData.currentDeck});
          } else {
            this.setState({inQueue: true})
          }
        break;

        case 'message':
          this.setState({msg: serverData.msg});
        break;

        case 'blackjackHand':
        this.setState({currentPlayer: serverData.player,
                       currentDeck: serverData.currentDeck,
                       players: serverData.players,
                       player1Hand: serverData.player1Hand,
                       player2Hand: serverData.player2Hand,
                       P1Turn: serverData.P1Turn,
                       P2Turn: serverData.P2Turn});
        break;
      }
    };
  }
  render() {
    return (
      <div>
        <Header loggedIn={this.state.loggedIn} registerInfo={this.registerInfo}/>
        <Login loggedIn={this.state.loggedIn} loginInfo={this.loginInfo}/>
        {this.state.msg ? this.displayMessage(this.state.msg) : ''}
        {this.state.chooseGame ? <GameSelection gameInfo={this.gameInfo} /> : ''}
        {this.state.inQueue && this.state.loggedIn ? <h1>Waiting for another player to join the game...</h1> :
        <Blackjack P1Turn={this.state.P1Turn} P2Turn={this.state.P2Turn} currentPlayer={this.state.currentPlayer} currentDeck={this.state.currentDeck} sendBlackjackHands={this.sendBlackjackHands} players={this.state.players} player1Hand={this.state.player1Hand} player2Hand={this.state.player2Hand}/>}
      </div>
    );
  }
}
export default App;
