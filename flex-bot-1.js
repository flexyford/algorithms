(function () {

  var botName = 'flex-bot'
  var myDeck = [];
  var oppDeck = [];

  var MIN_GAMBLE_RATING = 70
  var FIFTY_FIFTY = 50
  var MIN_OPP_WIN_RATING = FIFTY_FIFTY
  var MIN_CARDS_TO_GAMBLE = 2

  function compareNumbers(a, b) {
      return a - b;
  }

  function buildDecks(didIWin, loot) {

    if (didIWin) {
      loot.forEach( function(card) {
        // Add Card to My Deck
        if(!card.isMine) {
          myDeck.push(card.value)
          oppDeck.splice(oppDeck.lastIndexOf(card.value), 1)
        }
      });
      myDeck = myDeck.sort(compareNumbers)
    } else {
      loot.forEach( function(card) {
        // Add Card to Opponenet Deck
        if(card.isMine) {
          oppDeck.push(card.value)
          myDeck.splice(myDeck.lastIndexOf(card.value), 1)
        }
      });
      oppDeck = oppDeck.sort(compareNumbers)
    }

    if (oppDeck.length + myDeck.length > 52) {
      debugger
    }

  }

  /* returns a number from 0 .. 100 */
  function oddsOfBetterCard(deck, drawnCard) {
    tempDeck = [].concat(deck)
    tempDeck.splice(tempDeck.lastIndexOf(drawnCard.value), 1)
    return winOdds(tempDeck, drawnCard)
  }

  /* returns a number from 0 .. 100 */
  function winOdds(deck, drawnCard) {
    for(i=0; i<deck.length; i++) {
      if(deck[i] > drawnCard.value) {
        return (deck.length - i) / deck.length * 100
      }
    }
    return 0
  }  

  function myDeckAvg(deck, drawnCard) {
    tempDeck = [].concat(deck)
    tempDeck.splice(tempDeck.lastIndexOf(drawnCard.value), 1)
    return deckAvg(tempDeck)
  }

  function deckAvg(deck) {
    var sum = 0;
    if (deck.length > 1) {
      sum = deck.reduce(function(a, b) { return a + b });
    } else if (deck.length > 0) {
      sum = deck[0]
    } else {
      return 0
    }
    return sum / deck.length;
  }

  var BotClass = function () {
    // <<Initialize bot state here>>
    myDeck =  [2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14] // 26 uniform cars
    oppDeck = [2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14] // 26 uniform cars

    return {
      name: botName,
      play: function (drawnCard, remainingDeckSize, moveType) {
        //
        // moveType will be either 'normal', 'war', 'normal-gamble', or 'war-gamble'
        //
        // Return 'accept' to play the drawn card, or 'gamble' to draw a different card.
        //
        if (moveType === 'normal' || moveType === 'war') {
          oppWinRating = winOdds(oppDeck, drawnCard)
          betterCardRating = oddsOfBetterCard(myDeck, drawnCard)

          myRemainingDeckAvg  = Math.ceil(myDeckAvg(myDeck, drawnCard))
          oppRemainingDeckAvg = Math.floor(deckAvg(oppDeck))

          /* Defensive Gambling */
          if (oppWinRating >= 50 && myRemainingDeckAvg >= oppRemainingDeckAvg) {
            return 'gamble'
          }

          /* Offensive Gambling */
          else if (oppWinRating >= 33 && oppWinRating <= 50 &&
            betterCardRating >= 50) {
            return 'gamble'
          }

          else if (drawnCard.value < 6) {
            console.log("DrawnCard:" + drawnCard.value)
            console.log("oppWinRating:" + oppWinRating)
            console.log("betterCardRating " + betterCardRating)
            console.log("myRemainingDeckAvg " + myRemainingDeckAvg)
            console.log("oppRemainingDeckAvg " + oppRemainingDeckAvg)
          }

        }
        return 'accept'
      },
      handleRoundResult: function (didIWin, loot) {
        // Build Decks
        buildDecks(didIWin, loot)
      }
    }
  }

  BotClass.botName = botName

  var isNodeJs = typeof module != "undefined" && module !== null && module.exports
  if (isNodeJs) {
    module.exports = BotClass
  }
  else {
    BotRegistry.register(botName, BotClass)
  }
})()