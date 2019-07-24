// budget controller
var budgetController = (function () {
    // need a data model for expenses and incomes in this function
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    // calculates percentage for each expense
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else {
            this.percentage = -1;
        }
    };

    // returns percentage for each expense
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    // data structure to recieve data from the user
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        // set to -1 incase the value is nonexistent; if there are no budget values and no total expenses on incomes, then there cannot be a percentage
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            // create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                console.log(ID);
            }
            else {
                ID = 0;
                console.log(ID);
            }

            // if the string is a 'exp', we can create a new expense using the designation and the value that we can pass in
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            }
            // if the string is an 'inc', we can create a new income object based on the income function constructor 
            else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // the type is either exp or inc which comes from the addItem function above 
            data.allItems[type].push(newItem);
            // newItem needs to be returned because the other module/function that's going to call this function can have direct access to the item that we just created
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);


            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {
            // calculate total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
        },

        // calculate the expense percentages for each of the expense objects that are stored in the expenses array
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        // method created to return something from data structure or from module so that you can get used to having functions that only retrieve or set data
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function () {
            console.log(data);
        }
    };
})();

// UI controller
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;

        // + or - before number 
        // abs stands for absolute which removes the sign off the number
        num = Math.abs(num);

        // adds exactly 2 decimal places; method of the number prototype
        num = num.toFixed(2);

        // comma separating the thousands
        // splitting through the whole numbers and the decimal part -- will be stored in an array
        numSplit = num.split('.');
        int = numSplit[0]; // whole numbers
        if (int.length > 3) {
            // substr(0, 1) -- start at position 0, and only show ONE number
            // substr(1, 3) -- start at position 1, and show THREE number
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1]; // decimal part
        // returning - or +, a space, the number with commas, and decimals at the end
        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
    };


    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    // public function/method to use in the other controller that will have to be in the object that the IIFE function will return
    return {
        getInput: function () {
            return {
                // will be either inc (income) or exp (expense)
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            // create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // replace the placecolder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert the HTML into the DOM
            // beforeend keyword makes it so that all of the HTML will be inserted as a child of these containers (last child/last element in the list)
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // tricks slice method into thinking that we gave it an array, so it will return with an array
            var fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });
            // focus goes back on description so it's easier for the user to handle 
            fieldsArr[0].focus();
        },

        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    // you want the first percentage at the first element and so on...
                    current.textContent = percentages[index] + '%';
                }
                else {
                    current.textContent = '---';
                }
            });
        },

        displayDate: function () {
            var now, months, month, year;

            var now = new Date();
            // var christmas = new Date(2016, 11, 25);

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );
            nodeListForEach(fields, function (cur) {
                // toggle adds red focus class when it's not there, and when it's there on an element, it will remove it 
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        // returning private DOMstrings into the public method; exposing DOMstrings object
        getDOMStrings: function () {
            return DOMstrings;
        }
    };
})();

// global app controller
// set up event listener for the input button -- it is the central place where you can decide where you want to control what happens upon each event and then delegate these tasks to the other controllers 
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', crtlAddItem);
        // console.log('button was clicked');

        // event listener for global doc
        document.addEventListener('keypress', function (event) {
            // console.log(event);
            if (event.keyCode === 13 || event.which === 13) {
                // console.log('ENTER was pressed');
                crtlAddItem();
            }
        });
        // event delegation started to delete incomes and expenses; used container class element primarily for this reason and did DOM traversing in ctrlDeleteItem function to move up to the parent element 
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function () {
        // 1. calculate the budget 
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3. display the budget on the UI 
        // console.log(budget);
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        // 1. calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. update the UI with the new percentages 
        UICtrl.displayPercentages(percentages);
        console.log(percentages);
    };

    // function that is called when someone hits the input button or enter key 
    var crtlAddItem = function () {
        var input, newItem;

        // 1. get the field input data
        var input = UICtrl.getInput();
        console.log(input);

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. clear the fields
            UICtrl.clearFields();

            // 5. calculate and update budget
            updateBudget();

            // 6. calculate and update the percentages 
            updatePercentages();
        }
        else {
            alert('Please enter a valid description and/or value.');
        }
        // console.log('it works');
    };

    // in event delegation, an event bubbles up so we can know where it came from and where it was fired by looking at the target property of the event
    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure 
            budgetCtrl.deleteItem(type, ID);

            // 2. delete the item from the UI 
            UICtrl.deleteListItem(itemID);

            // 3. update and show the new budget 
            updateBudget();

            // 4. calculate and update percentages 
            updatePercentages();
        }
    };

    return {
        init: function () {
            console.log('application has started');
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();


