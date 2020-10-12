class Controller{
constructor(){
//atributos
this.display = document.querySelector("#display");
this.operation = ["0"];
this.lastOperator;
this.lastNumber;
this.clickSound = new Audio('click.mp3')
//métodos
this.Buttons();
this.Keyboards();
}
Keyboards(){
    document.addEventListener('keyup', each=>{ this.setOperation(each.key)})
}
Buttons(){
    let numbers = document.querySelectorAll(".btn");
    numbers.forEach(currentButton=>{ currentButton.addEventListener("click", ()=>{this.setOperation(currentButton.innerHTML); this.viewDisplay();
     });
    currentButton.addEventListener('mouseover', ()=>{ currentButton.style.cursor = "pointer"})
    });
        
}
setOperation(operator){
this.clickSound.currentTime = 0;
this.clickSound.play();
let index =0;
let newOperator = operator;
for(index; index <= 9; index++){
    if(index == operator){
        newOperator = parseInt(operator);
      break;
    }
}
switch(newOperator){
    case index:
    case ",":
    case ".": 
        this.NumberOrDot(newOperator);
        break;
    case "=":
        this.Calculation();
        break;
    case "C":
    case "Esc":
        this.lastOperator = null;
        this.lastNumber = null;
        this.operation =  ["0"];
        break;
    case "CE":
    case "Del":
        this.operation.pop();
        this.operation.push("0");
        break;
    case "+" :
    case "-" :
    case "*" :
    case "/" :
        this.Calculation2(newOperator);
        break; 
    case "Backspace":
    case "←":
        this.backspace();
        break;
    case "±":
    case "F9":
        this.moreorless();
        break;
    case "√":
    case "@":
        if(!(isNaN(this.GetLastOperation()))){
            if(this.GetLastOperation() >= 0 ){
                this.ChangeOperation(Math.sqrt(this.GetLastOperation()).toString());
            }else{
                this.setDisplay = "Número inválido";
            }
        }
        
        break;
    case "¹/x":
    case "R":
        this.reciproc();
        break;
    case "x²":
    case "Q":
        this.sqr();
        break;
    case "%":
      this.percent();
      break;
}
}
backspace(){
    if(!isNaN(this.GetLastOperation())){
       let erasedNumber= this.GetLastOperation().split("");
       erasedNumber.pop();
       let newNumber = erasedNumber.join("");
       if(newNumber.split("").length == 0){
        this.ChangeOperation("0");
       }else{
        this.ChangeOperation(newNumber.toString());
       }
    }
}
percent(){
    let percent, calcPercent;
    if(this.operation.length ==1){
       if(this.lastNumber){
           calcPercent = (this.GetLastOperation() * this.GetLastOperation())/100;
           this.ChangeOperation(calcPercent.toString());
       }else{
           this.operation = ["0"];
       }
    }else{
    if(isNaN(this.GetLastOperation())){
        percent = this.getLastItem(false);
        calcPercent = (this.getLastItem(false)*percent)/100;
        this.operation.push(calcPercent.toString());
    }else{
        percent = this.GetLastOperation();
        this.operation.pop();
        calcPercent =  (this.getLastItem(false)*percent)/100;
        this.operation.push(calcPercent.toString());
    }
}
}
//métodos especificos de botões
reciproc(){ // botão 1/x
    if(!isNaN(this.GetLastOperation())){
        let reciprocNumber = 1/parseFloat(this.GetLastOperation());
        this.ChangeOperation(reciprocNumber.toString());
    }
   }
sqr(){ //quadrado do número //botão x²
    if(!isNaN(this.GetLastOperation())){
        let sqrNumber = parseFloat(this.GetLastOperation()) * parseFloat(this.GetLastOperation());
        this.ChangeOperation(sqrNumber.toString());
    }
   }
moreorless(){ //botão +-
    if(!isNaN(this.GetLastOperation())){
        let invertNumber = parseFloat(this.GetLastOperation()) * -1 ;
        this.ChangeOperation(invertNumber.toString());
    }
}
Calculation(){
    if(this.operation.length <3){
        if(!this.lastNumber && !this.lastOperator && this.operation.length == 3){
            let First = this.operation[2];
            let Operation = this.operation[1];
            this.operation = [First, Operation, First];
            this.lastOperator = Operation;
            this.lastNumber = First;
            let result = this.getResult();
            this.operation = [result];
        }else{
            let current = this.operation[0];
            this.operation = [current, this.lastOperator, this.lastNumber];
            let result = this.getResult();
            this.operation= [result];
        }
    }else if(this.operation.length == 3){
        this.lastOperator = this.getLastItem();
        this.lastNumber = this.getLastItem(false);
        let result = this.getResult();
        this.operation =  [result];
    }
}
//métodos facilitadores
viewDisplay(){

    if(this.operation.join("").length <=10){
        this.setDisplay = this.operation.join("");
    }else{
        this.setDisplay = "Excedeu o limite de caracteres";
    }
    
}
NumberOrDot(operator){

    let NumberOrDot = isNaN(operator) ? "Dot" : "Number";

switch(NumberOrDot){
    case 'Dot':
        if (isNaN(this.GetLastOperation())){
            this.operation.push("0.");
        }else{
           if(this.GetLastOperation().split("").indexOf(".")== -1){
               let ConcatDot = this.ConcatThings(this.GetLastOperation(), ".");
               this.ChangeOperation(ConcatDot);
           }
        }
        break;
    case "Number":
        if(isNaN(parseInt(this.GetLastOperation()))){
            this.operation.push(operator.toString());
        }else{
            let Verificator = this.GetLastOperation().split("");
            let leftZero =  Verificator.length ==1 && Verificator[0] == 0 ? true : false;
            if(leftZero==true){
                this.operation.pop();
                this.operation.push(operator.toString());
            }else{
                let ConcatNumber = this.ConcatThings(this.GetLastOperation(), operator);
                this.ChangeOperation(ConcatNumber, this.GetLastOperation());
            }   
        }
break;
    }
}
Calculation2(Operator){
    if(isNaN(this.GetLastOperation())){
        if(this.isOperator(Operator)){
            this.ChangeOperation(Operator);
        }
    }else{
        this.operation.push(Operator);
        if(this.operation.length >3 ){
           this.lastOperator =  this.getLastItem();
           this.operation.pop();
           let result = this.getResult();
           this.operation = [result,this.lastOperator];
           this.lastNumber =  this.getLastItem(false);
        }
    }
}

getLastItem(Operator = true){
    let lastItem
    for(let i = this.operation.length - 1;  i >=0; i--){
     if (Operator){
        if ((this.isOperator(this.operation[i]))){
            lastItem = this.operation[i];
            break;
        }
     }else if(!this.isOperator(this.operation[i])){
         lastItem = this.operation[i];
         break;
     }
    }
    return lastItem;
}
isOperator(Operator){
    return (["-", "+", "/", "*"].indexOf(Operator) > -1);
}
GetLastOperation(){//método que captura o ultimo valor do array this.operation
return this.operation[this.operation.length - 1];
}
ConcatThings(value1,value2){//método que recebe dois valores e os concatena
return value1.toString() + value2.toString();
}
ChangeOperation(value){//remove um indice do array e insera outro no final.
this.operation.pop();
this.operation.push(value);
}
getResult(){
    return eval(this.operation.join(" ")).toString();
}

//getters & setters
get getDisplay(){ return this.display.innerHTML }
set setDisplay(expression){ this.display.innerHTML = expression }
}