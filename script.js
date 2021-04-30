const color = ['red', 'green', 'blue', 'yellow'] // initialize colours
const cells = [...document.getElementsByClassName('cell')] // getting all the elements from yhe DOM
const clickedCell = new Set() // creating set for track
let score = 0 // setting score zero

// filling colours in all the cells and initialize the game
const fillColour = () => {
  cells.forEach((ele, i) => {
    let randomColour = Math.floor(Math.random() * 4 + 0) // generating random number for filling colour from the colour array
    ele.className = 'cell ' + `${color[randomColour]}` // filling colours
    ele.addEventListener('mouseover', () => hover(i)) // adding event listner mouseover to heighlight same colour block
    ele.addEventListener('mouseout', () => out(i)) // adding event listner mouseout to remove heighlight
    ele.addEventListener('click', () => handleClick(i)) // adding eventlistner click
  })
}
fillColour() // invoking method at first load

// handling the click functionality of each cell
function handleClick(i) {
  const collection = collector(i) // getting all the same colour elements
  // getting index array from recived collection of same colour elements
  const indexList = collection.map((item) => {
    return item.indx
  })
  indexList.sort((a, b) => a - b) // sorting array for propper elemnt movement
  indexList.forEach((i) => {
    let tempindx = i
    cells[tempindx].className = 'clicked' // changing classname of clicked elements
    while (tempindx - 12 > 0) {
      if (cells[tempindx].className === 'clicked') {
        tempindx += 12
        break
      } else {
        tempindx -= 12
      }
    }
    moveElements(i) // moving elemnts from top to bottom
    score += 1
  })
  moveElementsLeft() // moving left if a complete coloum is become empty
  document.getElementById('score').innerHTML = score
  let blockscore = document.getElementById('blockscore')
  blockscore.innerHTML = 0
  // win check
  let won = win()
  if (won) {
    alert('you won the game! ✨🎉')
  }
  // nomoves check
  let noMove = noMoves()
  if (noMove) {
    alert('no moves left !🎃')
  }
}

// move elemnts top to bottom
function moveElements(i) {
  let item1 = cells[i]
  while (i - 12 >= 0) {
    let item2 = cells[i - 12]
    // swapping classes
    let temp = item1.className
    item1.className = item2.className
    item2.className = temp
    i = i - 12
    item1 = cells[i]
  }
  clickedCell.add(item1)
}

let last = 144 // variable to control recursion in moveElementsLeft

// move elements from right to left if a coloumn becomes empty
function moveElementsLeft() {
  //132
  let check = false
  for (let i = 132; i < last; i++) {
    if (cells[i].className === 'clicked') {
      check = true
      let j = i
      while (j >= 0) {
        let k = j
        while ((k + 1) % 12 !== 0) {
          let item1 = cells[k]
          let item2 = cells[k + 1]
          let temp = item1.className
          item1.className = item2.className
          item2.className = temp
          k += 1
        }
        j -= 12
      }
    }
  }
  if (check) {
    last -= 1
    moveElementsLeft()
  }
}

// mouseout event fuction
function out(i) {
  const collection = collector(i)
  collection.forEach((item) => {
    if (!clickedCell.has(item.item)) {
      let tempClass = item.item.className
      let classStr = tempClass.search('heighlight')
      if (classStr !== -1) {
        tempClass = tempClass.substring(0, classStr - 1)
        item.item.className = tempClass
      }
    }
  })
  let blockscore = document.getElementById('blockscore')
  blockscore.innerHTML = 0
}

// mouseon event function
function hover(i) {
  const collection = collector(i)
  collection.forEach((item) => {
    if (!clickedCell.has(item.item) && item.item.className !== 'clicked') {
      let tempClass = item.item.className
      item.item.className = tempClass + ' heighlight'
    }
  })
  let blockscore = document.getElementById('blockscore')
  blockscore.innerHTML = collection.length
}

// collector function to collect all the same colour element block
// used BFS for collecting elemnts
function collector(indx) {
  let collect = new Set() // to store collected elemnts
  collect.add({ item: cells[indx], indx: indx }) // added first element
  let temp = [indx] // used as queue for traversal
  let visited = new Set(temp) // visited set for tracking
  while (temp.length > 0) {
    let current = temp.pop()
    if (
      current - 1 >= 0 &&
      !(current % 12 === 0) &&
      !visited.has(current - 1) &&
      !clickedCell.has(cells[current - 1]) &&
      cells[current - 1].className !== 'clicked' &&
      cells[current - 1].className === cells[current].className
    ) {
      temp.unshift(current - 1)
      visited.add(current - 1)
      collect.add({ item: cells[current - 1], indx: current - 1 })
    }
    if (
      current - 12 >= 0 &&
      !visited.has(current - 12) &&
      !clickedCell.has(cells[current - 12]) &&
      cells[current - 12].className !== 'clicked' &&
      cells[current - 12].className === cells[current].className
    ) {
      temp.unshift(current - 12)
      visited.add(current - 12)
      collect.add({ item: cells[current - 12], indx: current - 12 })
    }
    if (
      current + 1 < 144 &&
      !((current + 1) % 12 === 0) &&
      !visited.has(current + 1) &&
      !clickedCell.has(cells[current + 1]) &&
      cells[current + 1].className !== 'clicked' &&
      cells[current + 1].className === cells[current].className
    ) {
      temp.unshift(current + 1)
      visited.add(current + 1)
      collect.add({ item: cells[current + 1], indx: current + 1 })
    }
    if (
      current + 12 < 144 &&
      !visited.has(current + 12) &&
      !clickedCell.has(cells[current + 12]) &&
      cells[current + 12].className !== 'clicked' &&
      cells[current + 12].className === cells[current].className
    ) {
      temp.unshift(current + 12)
      visited.add(current + 12)
      collect.add({ item: cells[current + 12], indx: current + 12 })
    }
  }
  if (collect.size > 1) {
    return [...collect]
  } else {
    return []
  }
}

// win function
function win() {
  if (score === 144) {
    return true
  } else {
    return false
  }
}

// no move function
function noMoves() {
  let checker = true
  for (let i = 0; i < 144; i++) {
    let check = collector(i)
    if (check.length > 0) {
      checker = false
    }
  }
  return checker
}

// restart
function restart() {
  window.location.reload()
}
