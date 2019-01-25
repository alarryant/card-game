import React, {Component} from 'react';
import { Hand, Card, CardBack } from 'react-deck-o-cards';

class BlackjackGame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getRandomInt = this.getRandomInt.bind(this);
    this.selectUniqueCard = this.selectUniqueCard.bind(this);
    this.createBlackjackHands = this.createBlackjackHands.bind(this);
    this.displayBlackjackHand = this.displayBlackjackHand.bind(this);
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

  componentDidMount(props) {
    // temporary solution for async
    setTimeout(() => {
      this.props.sendBlackjackHands(this.createBlackjackHands(this.props.currentDeck));
    }, 3000);
  }

  render() {

    return (
      <div>
        <h1>yes this works</h1>
        <h5>Player 1</h5>
        {this.displayBlackjackHand(this.state.player1Hand)}
        <h5>Player 2</h5>
        {this.displayBlackjackHand(this.state.player2Hand)}
      </div>);
  }
}

export default BlackjackGame;