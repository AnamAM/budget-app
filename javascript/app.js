// module that handles budget data 
// module patterns return an object containing all of the functions that we want public, bascially the functions that we want to give to the outside scope access to

// var budgetController = (function() {
//     var x = 23;
//     // private add()
//     var add = function(a) {
//         return x + a;
//     }
//     return {
//         publicTest: function(b) {
//             return (add(b));
//         }
//     }
// })();

// // module that takes care of the UI
// var UIController = (function() {
// })();

// // modules are function expressions and you can pass arguments into them
// var controller = (function(budgetCtrl, UTCtrl) {
//     var z = budgetController.publicTest(5);
//     return {
//         anotherPublic: function() {
//             console.log(z);
//         }
//     }

// })(budgetController, UIController);


// budget controller
var budgetController = (function () {
    // need a data model for expenses and incomes in this function
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
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
            if (data.allItems[type].length > 10) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
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

        calculateBudget: function () {
            // calculate total income and expenses 
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income the at we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
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
    }
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
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // replace the placecolder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert the HTML into the DOM
            // beforeend keyword makes it so that all of the HTML will be inserted as a child of these containers (last child/last element in the list)
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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

        // returning private DOMstrings into the public method; exposing DOMstrings object
        getDOMStrings: function () {
            return DOMstrings;
        }
    }
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
        })
    }

    var updateBudget = function () {

        // 1. calculate the budget 
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        console.log(budget);
        // 3. display the budget on the UI 
    }

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
        }
        else {
            alert('Please enter a valid description and/or value.');
        }
        // console.log('it works');
    };

    return {
        init: function () {
            console.log('application has started');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();


