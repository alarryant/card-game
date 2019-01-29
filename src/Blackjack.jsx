import React, {Component} from 'react';
import { Hand, Card, CardBack } from 'react-deck-o-cards';

class BlackjackGame extends Component {
  constructor(props) {
    super(props);
    this.state = {newRound: true};
    this.getRandomInt = this.getRandomInt.bind(this);
    this.selectUniqueCard = this.selectUniqueCard.bind(this);
    this.createBlackjackHands = this.createBlackjackHands.bind(this);
    this.displayBlackjackHand = this.displayBlackjackHand.bind(this);
    this.checkP1HandValue = this.checkP1HandValue.bind(this);
    this.checkP2HandValue = this.checkP2HandValue.bind(this);
    this.handleP1Hit = this.handleP1Hit.bind(this);
    this.handleP2Hit = this.handleP2Hit.bind(this);
    this.handleDeal = this.handleDeal.bind(this);
  }

  getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  selectUniqueCard = deckArray => {
    let numberOfCards = deckArray.length - 1;
    return deckArray[this.getRandomInt(0, numberOfCards)];
  }

  createBlackjackHands = deckArray => {
    let player1Hand = [];
    let player2Hand = [];
    let newDeck = deckArray;

    while (player1Hand.length < 2) {
      let card = this.selectUniqueCard(newDeck);

      if ((!player2Hand.includes(card) && !player1Hand.includes(card)) && card) {
        player1Hand.push(card);
        let cardIndex = newDeck.indexOf(card);
        if (cardIndex > -1) {
          newDeck.splice(cardIndex, 1);
        }
      }
    }

    while (player2Hand.length < 2) {
      let card = this.selectUniqueCard(newDeck);

      if ((!player2Hand.includes(card) && !player1Hand.includes(card)) && card) {
        player2Hand.push(card);
        let cardIndex = newDeck.indexOf(card);
        if (cardIndex > -1) {
          newDeck.splice(cardIndex, 1);
        }
      }
    }

    let hands = {player1Hand: player1Hand, player2Hand: player2Hand, currentDeck: newDeck};
    this.setState({player1Hand: player1Hand, player2Hand: player2Hand, currentDeck: newDeck});
    return hands;
  };

  displayBlackjackHand(hand=[]) {

    const defHandStyle = {
      maxHeight:'34vh',
      minHeight:'34vh',

      maxWidth:'100vw',
      padding: 0,
    };


    return hand.map(card => {
      return (
        <div>
          <Hand cards={[
      { rank: card.number, suit: card.suit },
    ]} hidden={false} style={defHandStyle} />
        </div>
      )
    })
  }

  checkP1HandValue(playerhand=[]) {
    let sum = 0;
    playerhand.forEach(card => {
      if (card.number < 10) {
        if (card.number === 1 && (sum + 11 <= 21)) {
          sum += 11;
        } else if (card.number === 1 && (sum + 11 > 21)) {
         sum += 1;
        } else {
          sum += card.number;
        }
      } else {
        sum += 10;
      }
    })
    if (sum > 21) {
      this.setState({P1bust: true, P1hitOption: false, P1value: sum});
    } else if (sum === 21) {
      this.setState({P1bust: false, P1hitOption: false, P1value: sum});
    } else {
      this.setState({P1bust: false, P1hitOption: true, P1value: sum});
    }
  }

  checkP2HandValue(playerhand=[]) {
    let sum = 0;
    playerhand.forEach(card => {
      if (card.number < 10) {
        if (card.number === 1 && (sum + 11 <= 21)) {
          sum += 11;
        } else if (card.number === 1 && (sum + 11 > 21)) {
          sum += 1;
        } else {
          sum += card.number;
        }
      } else {
        sum += 10;
      }
    })
    if (sum > 21) {
      this.setState({P2bust: true, P2hitOption: false, P2value: sum});
    } else if (sum === 21) {
      this.setState({P2bust: false, P2hitOption: false, P1value: sum});
    } else {
      this.setState({P2bust: false, P2hitOption: true, P2value: sum});
    }
  }

  handleP1Hit = event => {
    event.preventDefault();
    let newCard = this.selectUniqueCard(this.state.currentDeck);
    let newHand = this.state.player1Hand;
    newHand.push(newCard);
    let newDeck = this.state.currentDeck;
    let newCardIndex = newDeck.indexOf(newCard);
    if (newCardIndex > -1) {
      newDeck.splice(newCardIndex, 1);
    }
    this.setState({currentDeck: newDeck, player1Hand: newHand});
    this.props.sendBlackjackHands({currentDeck: newDeck, player1Hand: newHand, player2Hand: this.state.player2Hand});
    this.checkP1HandValue(newHand);
  }

  handleP2Hit = event => {
    event.preventDefault();
    let newCard = this.selectUniqueCard(this.state.currentDeck);
    let newHand = this.state.player2Hand;
    newHand.push(newCard);
    let newDeck = this.state.currentDeck;
    let newCardIndex = newDeck.indexOf(newCard);
    if (newCardIndex > -1) {
      newDeck.splice(newCardIndex, 1);
    }
    this.setState({currentDeck: newDeck, player2Hand: newHand});
    this.props.sendBlackjackHands({currentDeck: newDeck, player2Hand: newHand, player1Hand: this.state.player1Hand});
    this.checkP2HandValue(newHand);
  }

  handleDeal = event => {
    event.preventDefault();
    this.props.sendBlackjackHands(this.createBlackjackHands(this.props.currentDeck));
    this.setState({newRound: false});
    this.checkP1HandValue(this.state.player1Hand);
    this.checkP2HandValue(this.state.player2Hand);
  }

  render() {

    return (
      <div>

      {/* EVERYONE IS PLAYER TWO? */}
      {this.props.clientID === this.props.playerOne ? 
        <div>
           {this.state.newRound ? <button onClick={this.handleDeal}>Deal</button> : ''}
          <h1>GAME IS READY! {this.props.gameID}</h1>
          <h5>Player 1: {this.props.playerOne}</h5>
          {this.displayBlackjackHand(this.state.player1Hand)}
          {this.state.P1hitOption ? <button onClick={this.handleP1Hit}>Hit</button> : ''}
          {this.state.P1bust ? <h1>You lost!</h1> : ''}
        </div>
        :
        <div>
          {this.state.newRound ? <button onClick={this.handleDeal}>Deal</button> : ''}
          <h1>GAME IS READY! {this.props.gameID}</h1>
          <h5>Player 2: {this.props.playerTwo}</h5>
          {this.displayBlackjackHand(this.state.player2Hand)}
          {this.state.P2hitOption ? <button onClick={this.handleP2Hit}>Hit</button> : ''}
          {this.state.P2bust ? <h1>You lost!</h1> : ''}
        </div>
        }
        </div>
        )}
}

export default BlackjackGame;