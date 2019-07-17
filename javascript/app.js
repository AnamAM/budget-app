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

})();

// UI controller
var UIController = (function () {
    // public function/method to use in the other controller that will have to be in the object that the IIFE function will return
    return {
        getInput: function () {
            return {
                type: document.querySelector('.add__type').value, // will be either inc (income) or exp (expense)
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value
            };
        }
    }
})();

// global app controller
// set up event listener for the input button -- it is the central place where you can decide where you want to control what happens upon each event and then delegate these tasks to the other controllers 
var controller = (function (budgetCtrl, UICtrl) {

    var crtlAddItem = function () {

        // 1. get the field input data
        var input = UICtrl.getInput();
        console.log(input);

        // 2. add the item to the budget controller

        // 3. add the item to the UI

        // 4. calculate the budget 

        // 5. display the budget on the UI 

        // console.log('it works');
    }

    document.querySelector('.add__btn').addEventListener('click', crtlAddItem);
    // console.log('button was clicked');

    // event listener for global doc
    document.addEventListener('keypress', function (event) {
        // console.log(event);
        if (event.keyCode === 13 || event.which === 13) {
            // console.log('ENTER was pressed');
            crtlAddItem();
        }
    })

})(budgetController, UIController);