// Initialize Firebase

var config = {
    apiKey: "AIzaSyDf9fnuCfrXVVBNQu4L2FTw_C1kLRrwZ1g",
    authDomain: "travel-repo.firebaseapp.com",
    databaseURL: "https://travel-repo.firebaseio.com",
    storageBucket: "travel-repo.appspot.com",
    messagingSenderId: "410921328144"
};
firebase.initializeApp(config);

//Get Elements
var txtEmail = $('#txtEmail');
var txtPassword = $('#txtPassword');
var btnLogin = $('#btnLogin');
var btnSignUp = $('#btnSignUp');
var btnLogout = $('#btnLogout');

btnLogin.show();
btnLogout.hide();

//Add login event

btnLogin.on('click', function() {

    //get email and pass

    var email = txtEmail.val().trim();
    var pass = txtPassword.val().trim();
    var auth = firebase.auth();

    // Sign In
    var promise = firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);


    });
    email.val("");
    pass.val("");

});

btnSignUp.on('click', function() {

    //get email and pass
    var email = txtEmail.val().trim();
    var pass = txtPassword.val().trim();
    var auth = firebase.auth();

    // Sign In
    var promise = firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {

        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });
});

btnLogout.on('click', function() {

    firebase.auth().signOut();
});

//Add real-time authentication listener

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        btnLogout.show();
        console.log(user);
    } else {
        console.log("user not logged in");
        btnLogout.hide();
    }
});
