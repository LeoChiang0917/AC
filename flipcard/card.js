const Symbols = [
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
    'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
  ]
  const GAME_STATE= {
    FirstCardAwate:'FirstCardAwate',
    SecondCardAwat:'SecondCardAwat',
    CardMatchFail:'CardMatchFail',
    CardMatched:'CardMatched',
    GameFinished:'GameFinished'
  }
 
const view = {
getcardcontent(index){
    const number = this.transformNumber((index%13)+1)
    const symbols = Symbols[Math.floor(index / 13)]
    return `
        <p>${number}</p>
        <img src="${symbols}">
        <p>${number}</p>
     `
},
    getCardElement(index){
return `
     <div class="card back"data-index = "${index}">
    </div>
     `   
    },
    //score連動
    renderScore(score){
    document.querySelector('.score').textContent = `Score: ${score}`;
     },
     //TriedTimes連動
     renderTriedTimes(times) {
        document.querySelector(".tried").textContent = `You've tried: ${times} times`;
      },
    transformNumber(number){
    switch(number){
    case 1:
    return 'A'
    case 11:
    return 'J' 
    case 12:
    return 'Q' 
    case 13:
    return 'K'
    default:
    return number   
}
    },
//52張卡背面的內容
displayCard(indexs){
const rootElement = document.querySelector('#cards')
rootElement.innerHTML = indexs.map(index=>this.getCardElement(index)).join('');
},

//翻牌並出現數字
flipcard(...cards){
//讓回傳的參數變成陣列    
cards.map(card=>{
 //如果是背面，回傳正面
 if(card.classList.contains('back')){
    card.classList.remove('back')
    card.innerHTML = this.getcardcontent(Number(card.dataset.index))
    return
}
 // 回傳背面
card.classList.add('back')
card.innerHTML = null
})

},
pairedcard(...cards){
   cards.map(card=>{
    card.classList.add('paired')
   }) 
},
appendWrongAnimation(...cards){
cards.map(card=>{
    card.classList.add('wrong')
    card.addEventListener('animationend',event=>{
     event.target.classList.remove('wrong'),{once:true}   
    })
})
},
}


const modal = {
    revealCard : [], 
    isCardMatched(){
return this.revealCard[0].dataset.index%13===this.revealCard[1].dataset.index%13
    }, 
    score:0,
    triedtimes:0
}


const controller = {
    currentState: GAME_STATE.FirstCardAwate,
    generateCards () {
      view.displayCard(utility.getRandomNumberArray(52))
    },
    dispatchCardAction (card) {
      if (!card.classList.contains('back')) {
        return
         
      }
      switch (this.currentState) {
        case GAME_STATE.FirstCardAwate:
          view.flipcard(card)
          modal.revealCard.push(card)
          this.currentState = GAME_STATE.SecondCardAwat
          break
        case GAME_STATE.SecondCardAwat:
           view.renderTriedTimes(++modal.triedtimes) 
          view.flipcard(card)
          modal.revealCard.push(card)
          // 判斷配對是否成功
          if(modal.isCardMatched()){
            // 配對成功
            view.renderScore(modal.score += 10)
             this.currentState = GAME_STATE.CardMatched
             view.pairedcard(...modal.revealCard)
             this.currentState = GAME_STATE.FirstCardAwate
           }else{
           //配對失敗
            this.currentState = GAME_STATE.CardMatchFail
            view.appendWrongAnimation(...modal.revealCard)  
            setTimeout(this.resetCards,1000)
           }
          break
      }
      console.log('this.currentState', this.currentState)
      console.log('revealCard', modal.revealCard.map(card => card.dataset.index))
    },
        resetCards(){
            view.flipcard(...modal.revealCard)
            modal.revealCard=[]
            controller.currentState = GAME_STATE.FirstCardAwate
      }
  }

  
//洗牌
const utility = {
    getRandomNumberArray(count){
      const Number = Array.from(Array(count).keys())
      for(let index = Number.length-1;index>0;index--){
          let randomindex = Math.floor(Math.random()*(index+1));
          [Number[index],Number[randomindex]]=[Number[randomindex],Number[index]]
      }
    return Number
  } 
  }


  controller.generateCards()
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', event => {
        controller.dispatchCardAction (card)
    })
  })

  

