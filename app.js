var express = require("express");
const path = require('path');
const fs = require('fs');



var app = express();

//配置模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// set public dir
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extend: true }));





app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'home.html'));
});

app.post('/login', function(req, res) {
    // console.log(req.body);
    const { phone, verificationcode } = req.body;
    const usersFilePath = path.join(__dirname, 'users.json');
    let users = []
    try {
        users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    } catch (err) {
        users = [];
    }
    const existingUser = users.find(user => user.username === phone);
    if (existingUser) {
        return res.status(400).json({ error: 'phone num already exists' });
    }

    const newUser = {phone, verificationcode};
    users.push(newUser);

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.status(201).render('success', {message: 'User registered successfully'});
});


app.listen(3000, () => {
    console.log('server is running at 3000');
});







