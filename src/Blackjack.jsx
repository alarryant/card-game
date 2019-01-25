import React, {Component} from 'react';
import CardsJS from 'cardsJS';

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
      let card = this.selectUniqueCard(deckArray);

      if ((!player2Hand.includes(card) && !player1Hand.includes(card)) && card) {
        player1Hand.push(card);
        let cardIndex = newDeck.indexOf(card);
        if (cardIndex > -1) {
          newDeck.splice(cardIndex, 1);
        }
      }
    }

    while (player2Hand.length < 2) {
      let card = this.selectUniqueCard(deckArray);

      if ((!player2Hand.includes(card) && !player1Hand.includes(card)) && card) {
        player2Hand.push(card);
        let cardIndex = newDeck.indexOf(card);
        if (cardIndex > -1) {
          newDeck.splice(cardIndex, 1);
        }
      }
    }

    let hands = {player1Hand: player1Hand, player2Hand: player2Hand, currentDeck: newDeck};
    return hands;
  };

  displayBlackjackHand(hand=[]) {
    return hand.map(card => {
      return (
        <div>
          <p>card.number</p>
          <p>card.suit</p>
        </div>
      )
    })
  }

  componentDidMount(props) {
    // temporary solution for async
    setTimeout(() => {
      this.setState({ currentDeck: this.props.currentDeck, player1Hand: this.props.player1Hand, player2Hand: this.props.player2Hand });
      console.log("this is in comp did mount", this.state);
      this.props.sendBlackjackHands(this.createBlackjackHands(this.state.currentDeck));
    }, 3000);
  }

  render() {
    // console.log("this is in blackjack", this.props);
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