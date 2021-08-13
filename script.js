let turn = false; // false x - turn true o -turn
let compSet = false;
let winingPattern = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
let xTab = [];
let yTab = [];
let wining = null;
let overlay = document.querySelector('.overlay');
let changeButton = document.querySelector("#change");
let comp = document.querySelector("#comp");
let xScore = 0;
let oScore = 0;
let compInterval = null;
let excludedNumber = [];

const reset = () => {
    document.querySelectorAll('.boarder .cell').forEach(it => {
        it.classList.remove('x-class');
        it.classList.remove('o-class');
    });
    const classes = document.querySelector('.boarder').className.split(" ").filter(c => !c.startsWith('class-'));
    document.querySelector('.boarder').className = classes.join(" ").trim();
    xTab = [];
    yTab = [];
    wining = null;
    turn = changeButton.textContent.indexOf('X') > -1 ? true : false;
}
const drawLine = () => {
    document.querySelector('.boarder').classList.add(`class-${wining.join('-')}`)
}
const showScore = () => {
    document.querySelector('.xScore').textContent = xScore;
    document.querySelector('.oScore').textContent = oScore;
}
const showMessageWin = () => {
    turn ? oScore = oScore + 1 : xScore = xScore + 1;
    overlay.querySelector('.message-p').textContent = `Gratulacje ! Wygałeś ${turn ? 'O' : 'X'}`;
    showScore();
    change(1);
}

const change = (opacity) => {
    if(opacity === 1) {
        overlay.classList.add('overlay-index');
        overlay.style.opacity = "1";
    } else {
        setTimeout(() => {
            overlay.classList.remove('overlay-index');
            if(compSet) {
                clearInterval(compInterval);
                excludedNumber = [];
                setTimeout(() => {
                    reset();
                    compInterval = setInterval(() => startComp(),1000); 
                },1500);
            }
        },300);
        overlay.style.opacity = "0";
    }
}

const calculate = (sum) => {
    let sorted = [...sum];
    let counter = 0;
    if(sorted.length < 3) return;
    for(let i = 0; i < winingPattern.length; i++) {
        sorted.forEach(it => {
                if(winingPattern[i].includes(it)) {
                    counter++;
                }
            });
        if(counter == 3){
            sorted = winingPattern[i];
            break;
        }
        counter = 0;
    }
    return counter == 3 ? sorted : [];
}

const calculateWin = (number) => {
    if(!turn) {
        xTab.push(number);
        wining = calculate(xTab);
    } else {
        yTab.push(number);
        wining = calculate(yTab);
    }
    if(wining && wining.length == 3) {
        drawLine();
        showMessageWin();
        if(compSet) {
            clearInterval(compInterval);
            excludedNumber = [];
        }
        return;
    }
}
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    console.log('excludedNumber',excludedNumber);
    let number = Math.floor(Math.random() * (max - min)) + min;
    while(excludedNumber.find(it => it === number) != undefined) {
        number = Math.floor(Math.random() * (max - min)) + min;
    }
    excludedNumber.push(number);
    return number;
}

const startComp = () => {
    if(!turn) {
        let number = getRandomInt(1,9);
        let it = document.querySelector(`.cell-${number}`);
        it.classList.add('x-class');
        calculateWin(number);
        turn = true;
        if(excludedNumber.length === 9) {
            clearInterval(compInterval);
            excludedNumber = [];
            setTimeout(() => {
                reset();
                compInterval = setInterval(() => startComp(),1000); 
            },1500);
        }
    }
}

document.querySelector('.close').addEventListener('click',(e) => change(0),false);
overlay.addEventListener('click',(e) => change(0),false);

document.querySelector("#clear").addEventListener('click',(e) => reset(),false);

comp.addEventListener('click',(e) => {
    compSet = !compSet;
    document.querySelector("#comp").innerText = compSet ? "Sam ze zobą" : "Graj z AI";
    reset();
    if(compSet) {
        compInterval = setInterval(() => startComp(),1000);
    } else {
        clearInterval(compInterval);
    }
},false);

changeButton.addEventListener('click',(e) => {
    if(xTab.length > 0 || yTab.length > 0 || (wining && wining.length == 3)) return;
    turn = !turn;
    turn ? changeButton.textContent="Graj X" : changeButton.textContent = "Graj O";
},false);

document.querySelector(".boarder").addEventListener('click',e => {
    let it = e.target;

    if( wining && wining.length == 3 || 
        it.classList.contains('x-class') || 
        it.classList.contains('o-class')) {
        return;
    }

    let number = null;
    for(let i = 1; i<10;i++) {
        if(it.classList.contains(`cell-${i}`)) {
            number = i;
            break;
        }
    } 
    excludedNumber.push(number);
    if(!turn) {
        it.classList.add('x-class');
        calculateWin(number);
        turn = true;
    } else {
        it.classList.add('o-class');
        calculateWin(number);
        turn = false; 
    }
},false);