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
    }

    // data structure to recieve data from the user
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            exp = [1, 2, 3, 4, 5, 6]
            // create new ID
            if (data.allItems[type].length > 10) {
                ID: data.allItems[type][data.allItems[type].length - 1].id + 1;
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
        }
    }
})();




// UI controller
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    // public function/method to use in the other controller that will have to be in the object that the IIFE function will return
    return {
        getInput: function () {
            return {
                // will be either inc (income) or exp (expense)
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
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

    var crtlAddItem = function () {

        // 1. get the field input data
        var input = UICtrl.getInput();
        // console.log(input);

        // 2. add the item to the budget controller
        budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. add the item to the UI

        // 4. calculate the budget 

        // 5. display the budget on the UI 

        // console.log('it works');
    };

    return {
        init: function () {
            // console.log('application has started');
            setupEventListeners();
        }
    }

})(budgetController, UIController);


