function signup() {
    var username = document.getElementById("signup-username").value;
    var password = document.getElementById("signup-password").value;
    
    var encryptedPassword = btoa(password);
    
    localStorage.setItem(username, encryptedPassword);
    
    alert("Signup successful!");
}

function login() {
    var username = document.getElementById("login-username").value;
    var password = document.getElementById("login-password").value;
    
    var storedEncryptedPassword = localStorage.getItem(username);
    
    if (storedEncryptedPassword) {
        var storedPassword = atob(storedEncryptedPassword);
        
        if (password === storedPassword) {
            alert("Login successful!");
        } else {
            alert("Incorrect password!");
        }
    } else {
        alert("User not found!");
    }
}