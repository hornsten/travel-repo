$(document).ready(function() {
    //Initialize Firebase

    var config = {
        apiKey: "AIzaSyDf9fnuCfrXVVBNQu4L2FTw_C1kLRrwZ1g",
        authDomain: "travel-repo.firebaseapp.com",
        databaseURL: "https://travel-repo.firebaseio.com",
        storageBucket: "travel-repo.appspot.com",
        messagingSenderId: "410921328144"
    };

    firebase.initializeApp(config);

    var database = firebase.database().ref();
    //Get Elements
    var txtEmail = $('#txtEmail');
    var txtPassword = $('#txtPassword');
    var btnLogin = $('#btnLogin');
    var btnSignUp = $('#btnSignUp');
    var btnLogout = $('#btnLogout');

    btnLogin.show();
    btnSignUp.show();
    btnLogout.hide();

    // Modal
    $('#modal1').modal('open');
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
        starting_top: '4%', // Starting top style attribute
        ending_top: '10%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

            console.log(modal, trigger);
        },
        complete: function() {} // Callback for Modal close
    });

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
            $('#user-message').append(errorMessage);



        });

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
            $('#user-message').html(errorCode);
            $('#user-message').html(errorMessage);

        });

    });

    btnLogout.on('click', function() {

        firebase.auth().signOut();
        $('#user-message').html(' You have signed out.');
    });


    //Add real-time authentication listener

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            btnLogin.hide();
            btnSignUp.hide();
            btnLogout.show();

            console.log(user);
            $('#user-message').html('You are signed in. ');
            writeDatabase();
            $('#login-status').html('Logout');
            txtEmail.val("");
            txtPassword.val("");


        } else {
            $('#user-message').html("You are not signed in. ");
            btnLogin.show();
            btnSignUp.show();
            btnLogout.hide();
            $('#login-status').html('Login');

        }
    });

    //Adds users to the database upon login or signup
    function writeDatabase() {
        var email = txtEmail.val().trim();

        database.child('users').push({

            email: email

        });

        database.child('users').on("child_added", function(snapshot) {

            // Change the HTML to reflect
            console.log(snapshot);
            // Handle the errors
        }, function(errorObject) {

            console.log("Errors handled: " + errorObject.code);


        });
    }
    $('#search-place-info').on('click', shareLocale);

    function shareLocale() {
        var locale = $("#destination").val().trim();

        database.child('locale').set({

            locale: locale

        });

        database.child('locale').on("value", function(localeSnap) {


            // Change the HTML to reflect
            console.log(localeSnap);

            // empties input fields
            $('#origin').val("");
            $('#destination').val("");
            // Handle the errors
        }, function(errorObject) {

            console.log("Errors handled: " + errorObject.code);


        });
    }
});
