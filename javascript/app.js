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

})();

// global app controller
// set up event listener for the input button -- it is the central place where you can decide where you want to control what happens upon each event and then delegate these tasks to the other controllers 
var controller = (function (budgetCtrl, UTCtrl) {

    document.querySelector('.add__btn').addEventListener('click', function() {
        // console.log('button was clicked');

        // 1. get the field input data

        // 2. add the item to the budget controller

        // 3. add the item to the UI

        // 4. calculate the budget 

        // 5. display the budget on the UI 
    })

    // event listener for global doc
    document.addEventListener('keypress', function(event) {
        // console.log(event);
        if (event.keyCode === 13 || event.which === 13) {
            console.log('ENTER was pressed');
        }

    })

})(budgetController, UIController);