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
var txtEmail = document.getElementById('txtEmail');
var txtPassword = document.getElementById('txtPassword');
var btnLogin = document.getElementById('btnLogin');
var btnSignUp = document.getElementById('btnSignUp');
var btnLogout = document.getElementById('btnLogout');

//Add login event

btnLogin.addEventListener('click', function() {

    //get email and pass

    var email = txtEmail.value;
    var pass = txtPassword.value;
    var auth = firebase.auth();

    // Sign In
    var promise = firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);

    });


});

btnSignUp.addEventListener('click', function() {

    //get email and pass

    var email = txtEmail.value;
    var pass = txtPassword.value;
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

btnLogout.addEventListener('click', function() {

    firebase.auth().signOut();
});

//Add real-time authentication listener

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        btnLogout.classList.remove('hide');
        console.log(user);
    } else {
        console.log("user not logged in");
        btnLogout.classList.add('hide');
    }
});
