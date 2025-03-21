// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyDx02btd0AVS04QfrE8Z4ALGbDgZzrLNNQ",
//     authDomain: "cleanseguru-ac5e9.firebaseapp.com",
//     projectId: "cleanseguru-ac5e9",
//     storageBucket: "cleanseguru-ac5e9.appspot.com",
//     messagingSenderId: "123435300422",
//     appId: "1:123435300422:web:e6b7800c053745ffc3bc47"
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
  firebase.initializeApp(firebaseConfig);

// Remove the window.onload function at the bottom since we already have populateCountryOptions



document.addEventListener("DOMContentLoaded", () => {
    submitbtn = document.getElementById('submitbtn');
    submitbtn.addEventListener("click", async function handleSignUp(event) {
        event.preventDefault();
        
        const submitButton = document.querySelector('button[type="submit"]');
        
        try {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Signing up...';
    
            // Get all form values first
            const email = document.getElementById('emailInput').value.trim();
            
            // Check if email exists before attempting full signup
            try {
                const methods = await firebase.auth().fetchSignInMethodsForEmail(email);
                if (methods && methods.length > 0) {
                    throw new Error('This email address is already registered. Please use a different email or try logging in.');
                }
            } catch (emailCheckError) {
                if (emailCheckError.code === 'auth/invalid-email') {
                    throw new Error('Please enter a valid email address');
                }
                throw emailCheckError;
            }
    
            const password = document.getElementById('passwordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            const fullName = document.getElementById('nameInput').value.trim();
            const phone = document.getElementById('phoneInput').value.trim();
            const role = document.querySelector('input[name="flexRadioDefault"]:checked').value;
            const city = document.getElementById('cityInput').value.trim();
            const state = document.getElementById('stateInput').value.trim();
            const country = document.getElementById('countrySelect').value;
            
            // Get files
            const profilePicture = document.getElementById('profilePictureInput').files[0];
    
            // Get selected services for cleaners
            const services = [];
            let experienceLevel = null;
            
            if (role === 'cleaner') {
                // Get services
                if (document.getElementById('oneTimeService').checked) services.push('one-time');
                if (document.getElementById('weeklyService').checked) services.push('weekly');
                if (document.getElementById('monthlyService').checked) services.push('monthly');
                
                // Get experience level
                const experienceRadio = document.querySelector('input[name="experienceLevel"]:checked');
                experienceLevel = experienceRadio ? experienceRadio.value : null;
            }
    
            // Create user account first
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
    
            // Create user profile in Firestore without file uploads
            await firebase.firestore().collection('users').doc(user.uid).set({
                fullName,
                email,
                phone,
                role,
                city,
                state,
                country,
                services: role === 'cleaner' ? services : [],
                experienceLevel: experienceLevel,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
    
            // Redirect to appropriate dashboard
            window.location.href = role === 'client' ? '../pages/clientpage.html' : '../pages/cleanerpage.html';
    
        } catch (error) {
            console.error('Signup error:', error);
            showError(error.message || 'Failed to create account. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Submit';
        }
    })
    
    async function uploadFile(file, path) {
        if (!file) return null;
        
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(path);
        
        try {
            // Upload file without custom metadata
            const snapshot = await fileRef.put(file, {
                contentType: file.type
            });
            
            // Get the download URL
            const downloadURL = await snapshot.ref.getDownloadURL();
            return downloadURL;
        } catch (error) {
            console.error('Upload error:', error);
            // More specific error handling
            if (error.code === 'storage/unauthorized') {
                throw new Error('Storage access denied. Please make sure you are signed in.');
            } else if (error.code === 'storage/cors-error') {
                throw new Error('File upload failed due to CORS configuration.');
            }
            throw new Error('Failed to upload file: ' + error.message);
        }
    }
    
    function showError(message) {
        let errorDiv = document.getElementById('errorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'alert alert-danger mt-3';
            const form = document.getElementById('signup-form');
            form.insertBefore(errorDiv, form.firstChild);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Initialize country select options
    window.onload = function() {
        const countrySelect = document.getElementById('countrySelect');
        const countries = ['Ghana', 'Nigeria', 'South Africa', 'Kenya', 'Ethiopia'];
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countrySelect.appendChild(option);
        });
    };
    
    
});


