function createStyledElement (className, element = 'div') {
  const el = document.createElement(element)
  el.setAttribute('class', className)
  return el
}

class FourInARowGame {
  constructor() {
    this.rows = 6
    this.columns = 7
    this.board = document.getElementById('board')
    this.playerOne = {
      color: "red"
    }
    this.playerTwo = {
      color: "blue"
    }
    this.boardData = this.createInitialBoardData()
    this.activePlayer = this.playerOne
    this.winner = null
  }

  updateIsWinner() {
    // horizontal check
    for (let i = 0; i < this.rows; i++) {
      let winStack = []
      let lastColor = ''
      for (let j = 0; j < this.columns; j++) {
        if (this.boardData[i][j].color) {
          if (winStack.length === 0) {
            winStack.push(this.boardData[i][j])
            lastColor = this.boardData[i][j].color
          } else if (this.boardData[i][j].color === lastColor) {
            winStack.push(this.boardData[i][j])
          } else {
            winStack = [this.boardData[i][j]]
            lastColor = this.boardData[i][j].color
          }
          if (winStack.length === 4) {
            this.winner = lastColor
            const winnerEl = document.getElementById('winner')
            winnerEl.innerText = `The winner is ${lastColor}!`
            return
          }
        } else {
          winStack = []
          lastColor = ''
        }
      }
    }

    // vertical check
    for (let i = 0; i < this.columns; i++) {
      let winStack = []
      let lastColor = ''
      for (let j = 0; j < this.rows; j++) {
        if (this.boardData[j][i].color) {
          if (winStack.length === 0) {
            winStack.push(this.boardData[j][i])
            lastColor = this.boardData[j][i].color
          } else if (this.boardData[j][i].color === lastColor) {
            winStack.push(this.boardData[j][i])
          } else {
            winStack = []
            lastColor = ''
          }
          if (winStack.length === 4) {
            this.winner = lastColor
            const winnerEl = document.getElementById('winner')
            winnerEl.innerText = `The winner is ${lastColor}!`
            return
          }
        } else {
          winStack = []
          lastColor = ''
        }
      }
    }

    // diagonal left to right check
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let winStack = []
        let lastColor = ''
        for (let k = i, m = j; k < this.rows && m < this.columns; k++, m++) {
          if (this.boardData[k][m].color) {
            if (winStack.length === 0) {
              winStack.push(this.boardData[k][m])
              lastColor = this.boardData[k][m].color
            } else if (this.boardData[k][m].color === lastColor) {
              winStack.push(this.boardData[k][m])
            } else {
              winStack = [this.boardData[k][m]]
              lastColor = this.boardData[k][m].color
            }
            if (winStack.length === 4) {
              this.winner = lastColor
              const winnerEl = document.getElementById('winner')
              winnerEl.innerText = `The winner is ${lastColor}!`
              return
            }
          }  else {
            winStack = []
            lastColor = ''
          }
        }
      }
    }

    // diagonal right to left check
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        let winStack = []
        let lastColor = ''
        for (let k = i, m = j; k < this.rows && m >= 0; k++, m--) {
          if (this.boardData[k][m].color) {
            if (winStack.length === 0) {
              winStack.push(this.boardData[k][m])
              lastColor = this.boardData[k][m].color
            } else if (this.boardData[k][m].color === lastColor) {
              winStack.push(this.boardData[k][m])
            } else {
              winStack = [this.boardData[k][m]]
              lastColor = this.boardData[k][m].color
            }
            if (winStack.length === 4) {
              this.winner = lastColor
              const winnerEl = document.getElementById('winner')
              winnerEl.innerText = `The winner is ${lastColor}!`
            }
          } else {
            winStack = []
            lastColor = ''
          }
        }
      }
    }
  }

  createInitialBoardData() {
    const tempBoard = []
  
    for (let row = 0; row < this.rows; row++) {
      const currRow = []
      for (let col = 0; col < this.columns; col++) {
        currRow.push({
          color: null,
        })
      }
      tempBoard.push(currRow)
    }
  
    return tempBoard
  }

  handleClick = (event) => {
    if (this.winner) {
      window.alert(`The winner is ${this.winner}.  Please start a new game to continue playing.`)
      return
    }

    const [pRow, pCol] = event.target.id.split('-')

    const pieceIsEmpty = (this.boardData[pRow][pCol].color === null)
    const pieceBelowTouched = (pRow === '5') || this.boardData[Number(pRow) + 1][pCol].color

    if (pieceIsEmpty && pieceBelowTouched) {
      event.target.setAttribute('class', `circle ${this.activePlayer.color}-background`)
      this.boardData[pRow][pCol].color = this.activePlayer.color

      if (this.activePlayer === this.playerOne) {
        this.activePlayer = this.playerTwo
      } else {
        this.activePlayer = this.playerOne
      }

      const activePlayerEl = document.getElementById('active-player')
      activePlayerEl.innerText = `Active player: ${this.activePlayer.color}`

      this.updateIsWinner()
      
    } else {
      window.alert("Only spaces that are empty and have no empty spaces below them can be played.")
    }
  }

  renderBoard() {
    for (let row = 0; row < this.rows; row++) {
      const rowEl = createStyledElement('row')
      for (let col = 0; col < this.columns; col++) {
        const currRow = row
        const currCol = col
        const pieceBackground = createStyledElement('game-square')
        const piece = createStyledElement('circle white-background', 'button')
        const id = `${currRow}-${currCol}`

        piece.setAttribute('id', id)
        piece.addEventListener('click', this.handleClick)
  
        pieceBackground.append(piece)
        rowEl.append(pieceBackground)
      }
      this.board.append(rowEl)
    }
  }
}

const startNewGame = () => {
  const board = document.getElementById('board')
  while (board.lastElementChild) {
    board.removeChild(board.lastElementChild)
  }

  const winnerEl = document.getElementById('winner')
  winnerEl.innerText = 'No winner yet'

  const game = new FourInARowGame
  game.renderBoard()

  const activePlayerEl = document.getElementById('active-player')
  activePlayerEl.innerText = `Active player: ${game.activePlayer.color}`
}

const startNewGameEl = document.getElementById('new-game')
startNewGameEl.addEventListener('click', startNewGame)

const game = new FourInARowGame
game.renderBoard()
