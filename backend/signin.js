// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDx02btd0AVS04QfrE8Z4ALGbDgZzrLNNQ",
//   authDomain: "cleanseguru-ac5e9.firebaseapp.com",
//   projectId: "cleanseguru-ac5e9",
//   storageBucket: "cleanseguru-ac5e9.firebasestorage.app",
//   messagingSenderId: "123435300422",
//   appId: "1:123435300422:web:e6b7800c053745ffc3bc47"
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

const firebaseConfig = {
    apiKey: "AIzaSyAfR4W9BGwrWGGjiolVXGsTrzbf87U-vw8",
    authDomain: "cleanseguru-backend.firebaseapp.com",
    projectId: "cleanseguru-backend",
    storageBucket: "cleanseguru-backend.firebasestorage.app",
    messagingSenderId: "1087327359292",
    appId: "1:1087327359292:web:06cc16a892a22741bd8e39",
    measurementId: "G-328VGK7M6X"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);

document.getElementById("submitbtn")
.addEventListener("click", async function handleSignIn(event) {
    alert("Sign in button clicked");
    event.preventDefault();

    
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    let errorMessage = document.getElementById('errorMessage');
    
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Get the ID token
        const idToken = await user.getIdToken();
        
        // Send token to your backend
        const response = await fetch('http://localhost:5000/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken })
        });

        if (response.ok) {
            // Redirect to dashboard or home page
            window.location.href = '../index.html';//next page
        } else {
            throw new Error('Authentication failed');
        }
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            errorMessage.textContent = 'Unable to connect to the server. Please try again later.';
        } else {
            errorMessage.textContent = error.message;
        }
    }
});

// Check if user is already signed in
/*
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, redirect to home page
        window.location.href = '../index.html';
    }
});
*/
document.addEventListener("DOMContentLoaded", () => {
    // Ensure Firebase is initialized before adding event listeners
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
});

