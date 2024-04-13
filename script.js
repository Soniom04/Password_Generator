const pass_op = document.querySelector("[pass_op]")
const copy_msg = document.querySelector('[copy_msg]')
const copy_btn = document.querySelector('[copy_btn]')
const pswdLenNo = document.querySelector("[pswd_len_no]")
const uppercaseCheck = document.querySelector('#Uppercase')
const lowercaseCheck = document.querySelector('#Lowercase')
const NumbersCheck = document.querySelector('#Numbers')
const symbolsCheck = document.querySelector('#symbols')
const indicator = document.querySelector('[indicator]')
const generate_btn = document.querySelector('[generate_btn]')
const filters = document.querySelectorAll('input[type=checkbox]')
const inp_len = document.querySelector("[lenSlider]")
const symbols = "!@#$%^&*()-_+=<>?/[]{}|\;:',.`~`"

let password = ""
let passwordLength = 10
let checkCount = 0
sliderLength()
setIndicator("#d0d0d0")

function sliderLength(){
    inp_len.value = passwordLength;
    pswdLenNo.innerText = passwordLength;
    const min = inp_len.min
    const max = inp_len.max
    inp_len.style.backgroundSize = (passwordLength- min)/(max-min) * 100 + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color
    indicator.style.boxShadow = `0px 0px 5px 1px  ${color}`;
}

function randomNo(min,max){
    return Math.floor(Math.random()*(max-min))+min
}

function getRandomNo(){
    return randomNo(0,9)
}

function getRandomUpperCase(){
    return String.fromCharCode(randomNo(65,90))
}

function getRandomLowerCase(){
    return String.fromCharCode(randomNo(97,122))
}

function getRandomSymbols(){
    const randSymbNo = getRandomNo(0,symbols.length)
    return symbols.charAt(randSymbNo)
}

function showStrength(){
    let hasNum = false
    let hasUpperCase = false
    let hasLowerCase = false
    let hasSymbols = false
    if(NumbersCheck.checked)hasNum = true
    if(uppercaseCheck.checked)hasUpperCase = true
    if(lowercaseCheck.checked)hasLowerCase = true
    if(symbolsCheck.checked)hasSymbols = true

    if((hasUpperCase && hasLowerCase && (hasNum || hasSymbols)) && passwordLength >=8){setIndicator("#0f0")}
    else if(hasUpperCase && hasLowerCase && passwordLength >=6){setIndicator("#fade25")}
    else{setIndicator("#f00")}
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(pass_op.value)
        console.log(pass_op.value)
        copy_msg.innerText = "Copied"
    }
    catch(e){
        copy_msg.innerText = "Failed"
    }
    copy_msg.classList.add('active')
    setTimeout(() => {
        copy_msg.classList.remove('active')
    },2000)
}

inp_len.addEventListener('input',(e) =>{
    passwordLength = e.target.value
    sliderLength()
})

copy_btn.addEventListener('click',() =>{
    if(pass_op.value)
        copyContent();
})

function updateCheckCount(){
    checkCount=0
    filters.forEach((checkbox) =>{
        if(checkbox.checked)
            checkCount++
    })
    if(checkCount>passwordLength){
        passwordLength = checkCount
        sliderLength()
    }
}

filters.forEach((checkbox) => {
    checkbox.addEventListener('change',updateCheckCount)
});

function shufflePassword(array){
    //Fisher Yates Method
    for(let i = array.length - 1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1))
        const temp = array[j]
        array[j] = array[i]
        array[i] = temp
    }
    let str = ""
    array.forEach((el) => (str+=el))
    return str
}

generate_btn.addEventListener('click',(e)=>{
    if(checkCount<=0)return

    if(checkCount>passwordLength){
        passwordLength = checkCount
        sliderLength()
    }
    password = ""
    let funcArray = [];
    if(uppercaseCheck.checked)
        funcArray.push(getRandomUpperCase)

    if(lowercaseCheck.checked)
        funcArray.push(getRandomLowerCase)

    if(NumbersCheck.checked)
        funcArray.push(getRandomNo)

    if(symbolsCheck.checked)
        funcArray.push(getRandomSymbols)
    for(let i=0;i<funcArray.length;i++){
        password += funcArray[i]()
    }
    for(let i=0;i<passwordLength - funcArray.length;i++){
        password+= funcArray[randomNo(0,funcArray.length)]()
    }

    password = shufflePassword(Array.from(password));
    pass_op.value = password
    showStrength()
})

