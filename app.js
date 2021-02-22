const itemName = document.getElementById('item-name');
const itemType = document.getElementById('item-type');
const itemAmount = document.getElementById('item-dollar');
const form = document.getElementById('form');
const btnMonthly = document.getElementById('btn-monthly');
const btnAnnually = document.getElementById('btn-annually');
const incomeData = document.getElementById('income');
const expenseData = document.getElementById('expenses');
const totalSavingsEl = document.getElementById('total-savings');
const savingsPercentEl = document.getElementById('savings-percentage');
const totalSavingsAnnualEl = document.getElementById('total-savings-annual');
const totalSavingsAnnualLabel = document.getElementById('total-savings-annual-label');
const errorMessagesEl = document.getElementById('error-messages');
const inputNoteEl = document.getElementById('input-note');



let incomeList = [];
let expenseList = [];

let dragBegIndex;
let dragBegType;

function getItemData() {
    const name = itemName.value; 
    const type = itemType.value;
    const amount = +itemAmount.value;
    let messages = [];

    if(name === '' || name == null) {
        itemName.classList.add('error');
        messages.push('Please Enter A Valid Item Name')
    } else {
        itemName.classList.remove('error');
    }
    
    if(isNaN(amount) || amount <= 0) {
        itemAmount.classList.add('error')
        messages.push('Please Enter Valid Dollar Amount (Positive Numbers Only)')
    } else {
        itemAmount.classList.remove('error');
    }

    if(messages.length > 0) {
        displayErrors(messages);
    } else {
        addItemToArray(name, type, amount);
        errorMessagesEl.classList.remove('show');
    }

    
}

function addItemToArray(name,type,amount) {
    const item = {
        item: name,
        category: type,
        value: amount
    }

    type === 'income' ? incomeList.push(item) : expenseList.push(item);

    updateBudget();
}


// DOM Related Functions

function updateBudget() {
    incomeData.innerHTML = '';
    expenseData.innerHTML = '';


    incomeData.innerHTML = ` 
        ${incomeList.map((item, index) => `
            <div class="item-container draggable" draggable="true" id="${index}"    data-type="income">
                <div class="item-name">
                    <strong>${item.item}</strong>
                </div>
                <div class="item-value">
                    <span>${formatMoney(item.value)}</span>
                    <i class="fas fa-bars btn-drag">
                        <div class="item-note">Herro</div>
                    </i>
                    <button class="btn-delete" id="btn-delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('')}

            <div class="item-container">
                <div class="item-name">
                    <strong>Total Income</strong>
                </div>

                <div class="item-value">
                    <strong id="total-income"></strong>
                    <i class="fas fa-bars btn-drag"></i>
                    <button class="btn-delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
    `;


    expenseData.innerHTML= `
        ${expenseList.map((item, index) => `
            <div class="item-container draggable" draggable="true" id="${index}" data-type="expense">
                <div class="item-name">
                    <strong>${item.item}</strong>
                </div>
                <div class="item-value">
                    <span>${formatMoney(item.value)}</span>
                    <i class="fas fa-bars btn-drag"></i>
                    <button class="btn-delete" id="btn-delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('')}

            <div class="item-container">
                <div class="item-name">
                    <strong>Total Expenses</strong>
                </div>

                <div class="item-value">
                    <strong id="total-expenses"></strong>
                    <i class="fas fa-bars btn-drag"></i>
                    <button class="btn-delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
    `;

    updateTotals();
    addBtnListeners();
    addDragListeners();
   
}



function updateTotals() {
    if(incomeList.length === 0 && expenseList.length === 0) {
        totalSavingsEl.innerHTML = '-';
        savingsPercentEl.innerHTML = '-';
        totalSavingsAnnualEl.innerHTML = '-';

    } else {
        const incomeSum = incomeList.map(item => item.value).reduce((acc,cv) => acc + cv, 0);
        const expenseSum = expenseList.map(item => item.value).reduce((acc,cv) => acc + cv, 0);
        const incomeTotal = document.getElementById('total-income');
        const expenseTotal = document.getElementById('total-expenses');
    
    
        incomeTotal.innerHTML = formatMoney(incomeSum);
        expenseTotal.innerHTML = formatMoney(expenseSum);
    
        totalSavingsEl.innerHTML = formatMoney(incomeSum - expenseSum);
        savingsPercentEl.innerHTML = `${incomeSum === 0 ? '-' : Math.floor(((incomeSum - expenseSum)/incomeSum * 100),0) + '%' }`;
        totalSavingsAnnualEl.innerHTML = formatMoney((incomeSum - expenseSum) * 12) 


    }

}


function deleteItem(target) {
   const classBtn = target.parentElement.id;

    if(classBtn === 'btn-delete') {
        const itemID = target.parentElement.parentElement.parentElement.id;
        const itemType = target.parentElement.parentElement.parentElement.getAttribute('data-type');

        if(itemType === 'income') {
            incomeList.splice(itemID,1);
            
        } else if(itemType === 'expense') {
            expenseList.splice(itemID,1);
        }

       

        if(incomeList.length === 0 && expenseList.length === 0) {
            btnMonthly.classList.add('selected');
            btnAnnually.classList.remove('selected');
            totalSavingsAnnualEl.style.visibility = 'visible';
            totalSavingsAnnualLabel.style.visibility = 'visible';
            inputNoteEl.innerHTML = 'Monthly';
        }

        updateBudget();
    }
}

function displayErrors(messages) {

    errorMessagesEl.innerHTML = '';
 
    errorMessagesEl.innerHTML = `
        ${messages.map(error => `
            <p>${error}</p>
        `).join('')}
    `;

    errorMessagesEl.classList.add('show')
}



// Drag and Drop Functions

function dragStart() {
    dragBegIndex = +this.closest('div').getAttribute('id');
    dragBegType = this.closest('div').getAttribute('data-type')
    console.log(dragBegType);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter() {
    this.classList.add('over');
    // const selectedItem = document.getElementById(`${dragBegIndex}`)
    // selectedItem.classList.add('over')
}

function dragDrop() {
    this.classList.remove('over');

    const dragEndIndex = +this.getAttribute('id');
    const dragEndType = this.getAttribute('data-type');
    

    if(dragBegType === dragEndType) {
        swapItems(dragBegIndex, dragEndIndex, dragEndType)
    }

    
}

function dragLeave() {

    this.classList.remove('over');
    // const leavingItem = document.getElementById(`${dragBegIndex}`);
    // leavingItem.classList.remove('over')
}

function swapItems(fromIndex, toIndex, itemType) {
    if(itemType === 'income') {
        [incomeList[fromIndex], incomeList[toIndex]] = [incomeList[toIndex], incomeList[fromIndex]]

        updateBudget();
    }

    if(itemType === 'expense') {
        [expenseList[fromIndex], expenseList[toIndex]] = [expenseList[toIndex], expenseList[fromIndex]]

        updateBudget();
    }
}
 

function addDragListeners() {
    const draggables = document.querySelectorAll('.draggable');
   
    
    draggables.forEach(dataCont => {
        dataCont.addEventListener('dragstart', dragStart);

        dataCont.addEventListener('dragover', dragOver);
        dataCont.addEventListener('drop', dragDrop);
        dataCont.addEventListener('dragenter', dragEnter);
        dataCont.addEventListener('dragleave', dragLeave)
    });

    // incomeExpenseCont.forEach(container => {
        
    // })
}


function switchMonthlyAnnually(selectedBtn) {
    if(selectedBtn === 'btn-monthly') {
        const incomeListMonthly = incomeList.map(monthlyItem => {
            return {
                item: monthlyItem.item,
                category: monthlyItem.category,
                value: monthlyItem.value / 12
            }
        });

        const expenseListMonthly = expenseList.map(monthlyItem => {
            return {
                item: monthlyItem.item,
                category: monthlyItem.category,
                value: monthlyItem.value / 12
            }
        });

        incomeList = incomeListMonthly;
        expenseList = expenseListMonthly;

        totalSavingsAnnualEl.style.visibility = 'visible';
        totalSavingsAnnualLabel.style.visibility = 'visible';

        updateBudget()
       
        
    }

    if(selectedBtn === 'btn-annually') {
        const incomeListAnnual = incomeList.map(annualItem => {
            return {
                item: annualItem.item,
                category: annualItem.category,
                value: annualItem.value * 12
            }
        })

        const expenseListMonthly = expenseList.map(monthlyItem => {
            return {
                item: monthlyItem.item,
                category: monthlyItem.category,
                value: monthlyItem.value * 12
            }
        });



        incomeList = incomeListAnnual;
        expenseList = expenseListMonthly;

        totalSavingsAnnualEl.style.visibility = 'hidden';
        totalSavingsAnnualLabel.style.visibility = 'hidden';

        updateBudget();
    }
}









function formatMoney(number) {
    return '$' + (number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}




// Add Delete Button event listeners



function addBtnListeners() {
    const deleteBtns = document.querySelectorAll('#btn-delete');
    const dragBtns = document.querySelectorAll('.btn-drag');
    deleteBtns.forEach(btn => btn.addEventListener('click', e => deleteItem(e.target)))
    
    dragBtns.forEach(btn => btn.addEventListener('click', e => {
        const noteDiv = e.target.firstElementChild;

        noteDiv.classList.toggle('visibile')


    }));
}


// Monthly and Annual Btn event listeners

btnMonthly.addEventListener('click', (e) => {
    if(incomeList.length === 0 && expenseList.length === 0) return;

    const btnID = e.target.id;
    const isSelectedMonthly = btnMonthly.classList.contains('selected');

    if(!isSelectedMonthly) {
        btnMonthly.classList.add('selected');
        btnAnnually.classList.remove('selected');
        inputNoteEl.innerHTML = 'Monthly';
        
       switchMonthlyAnnually(btnID);
    }
});


btnAnnually.addEventListener('click', (e) => {
    if(incomeList.length === 0 && expenseList.length === 0) return;

    const btnID = e.target.id;
    const isSelectedAnnually = btnAnnually.classList.contains('selected');

    if(!isSelectedAnnually) {
        btnAnnually.classList.add('selected');
        btnMonthly.classList.remove('selected');
        inputNoteEl.innerHTML = 'Annual';
    
        switchMonthlyAnnually(btnID);
     
    }

});





















// Event Listeners


form.addEventListener('submit', e => {
    e.preventDefault();
    getItemData();
})