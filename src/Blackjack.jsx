import React, {Component} from 'react';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function selectUniqueCard(deckArray) {
  return deckArray[getRandomInt(0, deckArray.length - 1)];
}

function createBlackJackHands(deckArray) {
  let player1Hand = [];
  let player2Hand = [];
  let newDeck = deckArray;

  if (deckArray) {
    let card = selectUniqueCard(deckArray);

    if ((!player2Hand.includes(card) && !player1Hand.includes(card)) && card && player1Hand.length < 3) {
      player1Hand.push(card);
      let cardIndex = newDeck.indexOf(card);
      if (cardIndex > -1) {
        newDeck.splice(cardIndex, 1);
      }
    } else if ((!player2Hand.includes(card) && !player1Hand.includes(card)) && card && player2Hand.length < 3) {
      player2Hand.push(card);
      let cardIndex = newDeck.indexOf(card);
      if (cardIndex > -1) {
        newDeck.splice(cardIndex, 1);
      }
    }
    let hands = {player1Hand: player1Hand, player2Hand: player2Hand, currentDeck: newDeck};
    return hands;
  }
};

class BlackjackGame extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setState({currentDeck: this.props.currentDeck});
    // console.log("create hand in blackjack comp", createBlackJackHands(this.props.currentDeck));
    if (this.state.currentDeck) {
      this.props.displayBlackjackHands(createBlackJackHands(this.props.currentDeck));
      console.log(createBlackJackHands("this is in comp did mount", this.props.currentDeck));
    }
  }

  render() {
    // console.log("props in bj", this.props.currentDeck);
    // this.props.displayBlackjackHands(createBlackJackHands(this.props.currentDeck));
    return (<h1>yes this works</h1>);
  }
}

export default BlackjackGame;