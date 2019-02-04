import React, {Component} from 'react';
import { Hand, Card, CardBack } from 'react-deck-o-cards';

class BlackjackGame extends Component {
  constructor(props) {
    super(props);
    this.state = {P1Turn: 0, P2Turn: 0};
    this.getRandomInt = this.getRandomInt.bind(this);
    this.selectUniqueCard = this.selectUniqueCard.bind(this);
    this.createBlackjackHands = this.createBlackjackHands.bind(this);
    this.displayBlackjackHand = this.displayBlackjackHand.bind(this);
    this.checkHandValue = this.checkHandValue.bind(this);
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
    let formattedHand = [];
    hand.map(card => {
      formattedHand.push({rank: card.number, suit: card.suit})
    })
    return formattedHand
  }

  checkHandValue(p1=[], p2=[]) {
    let p1Sum = 0;
    let p2Sum = 0;
    let p1IncludesAce = 0;
    let p2IncludesAce = 0;

    p1.forEach((card, i) => {
      if (card.number === 1) {
        p1Sum += 11;
        p1IncludesAce ++;
      } else if (card.number > 1 && card.number < 10) {
        p1Sum += card.number;
      } else {
        p1Sum += 10;
      }

      if (i === p1.length - 1) {
        while (p1Sum > 21 && p1IncludesAce > 0) {
          p1Sum -= 10;
          p1IncludesAce --;
        }
      }
    })

    p2.forEach((card, i) => {
      if (card.number === 1) {
        p2Sum += 11;
        p2IncludesAce ++;
      } else if (card.number > 1 && card.number < 10) {
        p2Sum += card.number;
      } else {
        p2Sum += 10;
      }

      if (i === p2.length - 1) {
        while (p2Sum > 21 && p2IncludesAce > 0) {
          p2Sum -= 10;
          p2IncludesAce --;
        }
      }
    })

    if (p1Sum > 21) {
      this.setState({P1bust: true, P1hitOption: false});
    } else if (p1Sum === 21) {
      this.setState({P1bust: false, P1hitOption: false});
    } else {
      this.setState({P1bust: false, P1hitOption: true});
    }

    if (p2Sum > 21) {
      this.setState({P2bust: true, P2hitOption: false});
    } else if (p2Sum === 21) {
      this.setState({P2bust: false, P2hitOption: false});
    } else {
      this.setState({P2bust: false, P2hitOption: true});
    }
  }

  handleP1Hit = event => {
    event.preventDefault();
    let turnCounter = this.state.P1Turn + 1;
    let newCard = this.selectUniqueCard(this.state.currentDeck);
    let newHand = this.state.player1Hand;
    newHand.push(newCard);
    let newDeck = this.state.currentDeck;
    let newCardIndex = newDeck.indexOf(newCard);
    if (newCardIndex > -1) {
      newDeck.splice(newCardIndex, 1);
    }

    this.setState({ currentDeck: newDeck,
                    player1Hand: newHand,
                    P1Turn: turnCounter});
    this.props.sendBlackjackHands({ hands: {currentDeck: newDeck,
                                            player1Hand: newHand,
                                            player2Hand: this.state.player2Hand},
                                    P1Turn: turnCounter,
                                    P2Turn: this.state.P2Turn});
  }

  handleP2Hit = event => {
    event.preventDefault();
    let turnCounter = this.state.P2Turn + 1;
    let newCard = this.selectUniqueCard(this.state.currentDeck);
    let newHand = this.state.player2Hand;
    newHand.push(newCard);
    let newDeck = this.state.currentDeck;
    let newCardIndex = newDeck.indexOf(newCard);
    if (newCardIndex > -1) {
      newDeck.splice(newCardIndex, 1);
    }

    this.setState({currentDeck: newDeck, player2Hand: newHand, P2Turn: turnCounter});
    this.props.sendBlackjackHands({hands: {currentDeck: newDeck, player2Hand: newHand, player1Hand: this.state.player1Hand}, P1Turn: this.state.P1Turn, P2Turn: turnCounter});
  }

  handleDeal = event => {
    event.preventDefault();
    this.props.sendBlackjackHands({hands: this.createBlackjackHands(this.props.currentDeck), P1Turn: 1, P2Turn: 1});
    this.setState({P1Turn: 1, P2Turn: 1});
  }

  componentDidUpdate(props) {
    if ((this.state.currentDeck !== this.props.currentDeck) && this.props.currentDeck) {
      this.setState({P1Turn: this.props.P1Turn, P2Turn: this.props.P2Turn, currentPlayer: this.props.currentPlayer, players: this.props.players, currentDeck: this.props.currentDeck, player1Hand: this.props.player1Hand, player2Hand: this.props.player2Hand});
      this.checkHandValue(this.state.player1Hand, this.state.player2Hand);
    }
  }

  render() {
    const defHandStyle = {
      maxHeight:'40vh',
      minHeight:'20vh',
      backgroundColor: 'white',

      maxWidth:'20vw',
      padding: 0,
    };

    return (
      <div>
        <div>
          <button onClick={this.handleDeal}>Deal</button>
          {(this.state.P1Turn === 0) && (this.state.P2Turn === 0) ? <h1>GAME IS READY!</h1> : ''}
          <h5>Player 1: {/*this.props.players[0].username*/}</h5>
          <Hand cards={this.displayBlackjackHand(this.state.player1Hand)} hidden={false} style={defHandStyle} />
          {(this.state.P1hitOption && (this.state.P1Turn <= this.state.P2Turn)) && (this.state.currentPlayer === 1) ? <button onClick={this.handleP1Hit}>Hit</button> : ''}
          {this.state.P1bust && (this.state.currentPlayer === 1) ? <h1>You lost!</h1> : ''}
          {this.state.P2bust && (this.state.currentPlayer === 1) ? <h1>You won!</h1> : ''}
        </div>
        <div>
          <h5>Player 2: {/*this.props.players[1].username*/}</h5>
          <Hand cards={this.displayBlackjackHand(this.state.player2Hand)} hidden={false} style={defHandStyle} />
          {(this.state.P2hitOption && (this.state.P2Turn <= this.state.P1Turn)) && (this.state.currentPlayer === 2) ? <button onClick={this.handleP2Hit}>Hit</button> : ''}
          {this.state.P2bust && (this.state.currentPlayer === 2) ? <h1>You lost!</h1> : ''}
          {this.state.P1bust && (this.state.currentPlayer === 2) ? <h1>You won!</h1> : ''}
        </div>
      </div>
      )}
}

export default BlackjackGame;