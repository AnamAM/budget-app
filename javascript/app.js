// module that handles budget data 
// module patterns return an object containing all of the functions that we want public, bascially the functions that we want to give to the outside scope access to
var budgetController = (function() {

    var x = 23;
    
    // private add()
    var add = function(a) {
        return x + a;
    }
    return {
        publicTest: function(b) {
            return (add(b));
        }
    }

})();

// module that takes care of the UI
var UIController = (function() {

    

})();

// modules are function expressions and you can pass arguments into them
var controller = (function(budgetCtrl, UTCtrl) {

    var z = budgetController.publicTest(5);

    return {
        anotherPublic: function() {
            console.log(z);
        }
    }

})(budgetController, UIController);