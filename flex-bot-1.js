(function () {

  var botName = 'flex-bot'
  var myDeck =  [2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14] // 26 uniform cars
  var oppDeck = [2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14] // 26 uniform cars

  var MIN_GAMBLE_RATING = 66
  var FIFTY_FIFTY = 50
  var MIN_OPP_WIN_RATING = FIFTY_FIFTY
  var MIN_CARDS_TO_GAMBLE = 10

  function compareNumbers(a, b) {
      return a - b;
  }

  function buildDecks(didIWin, loot) {

    if (didIWin) {
      loot.forEach( function(card) {
        // Add Card to My Deck
        if(!card.isMine) {
          myDeck.push(card.value)
        } else {
          // Remove card from opponenet deck
          oppDeck.splice(oppDeck.lastIndexOf(card.value), 1)
        }
      });
      myDeck = myDeck.sort(compareNumbers)
    } else {
      loot.forEach( function(card) {
        // Add Card to Opponenet Deck
        if(card.isMine) {
          oppDeck.push(card.value)
        } else {
          // Remove card from my deck
          myDeck.splice(myDeck.lastIndexOf(card.value), 1)
        }
      });
      oppDeck = oppDeck.sort(compareNumbers)
    }
  }

  /* returns a number from 0 .. 100 */
  function oddsOfBetterCard(deck, drawnCard) {
    return (deck.length - deck.lastIndexOf(drawnCard.value)) / deck.length * 100
  }

  /* returns a number from 0 .. 100 */
  function oddsOppWins(deck, drawnCard) {
    for(i=0; i<deck.length; i++) {
      if(deck[i] > drawnCard.value) {
        return (deck.length - i) / deck.length * 100
      }
    }
    return 0
  }  

  var BotClass = function () {
    // <<Initialize bot state here>>

    return {
      name: botName,
      play: function (drawnCard, remainingDeckSize, moveType) {
        //
        // moveType will be either 'normal', 'war', 'normal-gamble', or 'war-gamble'
        //
        // Return 'accept' to play the drawn card, or 'gamble' to draw a different card.
        //
        if (moveType === 'normal' || moveType === 'war') {
          // A Gamble is Possible
          oppWinRating = oddsOppWins(oppDeck, drawnCard)
          betterCardRating = oddsOfBetterCard(myDeck, drawnCard)
          
          if (oppWinRating > MIN_OPP_WIN_RATING && 
            betterCardRating > MIN_GAMBLE_RATING && 
            remainingDeckSize > MIN_CARDS_TO_GAMBLE) {
            return 'gamble'
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