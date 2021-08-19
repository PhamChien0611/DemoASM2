const EXPRESS = require('express')
const path = require('path');
const { Int32 } = require('mongodb');
const hbs = require('hbs')
const session = require('express-session');

const { addProduct, deleteProduct, searchProduct, getAllProducts, getProductById, updateProduct, getAllAccounts, addAccount, deleteAccount, getAccountById, updateAccount, checkUser } = require('./databaseHandler');
const { Console } = require('console');

const APP = EXPRESS()

// Use the session middleware
APP.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'abcc##$$0911233$%%%32222',
    cookie: { maxAge: 60000 }
}));

APP.use(EXPRESS.urlencoded({ extended: true }))

APP.set('view engine', 'hbs');
APP.set('views', path.join(__dirname, 'views'))
APP.use(EXPRESS.static('public'))


// Begin : Manage Product
//Search by ID to edit Product Function
APP.get('/editProduct', async (req, res) => {
    const idInput = req.query.id;
    const username = req.session.username;
    const search_Product = await getProductById(idInput);
    res.render('editProduct', { loginName: username, product: search_Product })
})

//Update product function
APP.post('/updateProduct', async (req, res) => {
    const id = req.body.id;
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const imgURLInput = req.body.imgURL;
    await updateProduct(id, nameInput, priceInput, imgURLInput);
    res.redirect('manageProducts');
})

//Add product Function
APP.post('/doAddProduct', async (req, res) => {
    const nameInput = req.body.txtName;
    const priceInput = req.body.txtPrice;
    const imgURLInput = req.body.imgURL;
    const newProduct = { name: nameInput, price: Int32(priceInput), imgURL: imgURLInput };
    await addProduct(newProduct);
    res.redirect('manageProducts');
})

APP.get('/addProduct', requiresLogin, (req, res) => {
    const username = req.session.username;
    res.render('addProduct', { loginName: username })
})

//Manage Products
APP.get('/manageProducts', requiresLogin, async (req, res) => {
    const username = req.session.username;
    const allProducts = await getAllProducts();
    res.render('manageProducts', { loginName: username, data: allProducts })
})

//Delete product Function
APP.get('/delete', async (req, res) => {
    const idInput = req.query.id;
    await deleteProduct(idInput);
    res.redirect('manageProducts');
})

//Home Page
APP.get('/home', requiresLogin, async (req, res) => {
    // if (!req.session.username) 
    //     res.redirect('/');    
    const allProducts = await getAllProducts();
    const username = req.session.username;
    res.render('home', { loginName: username, data: allProducts })
})

//Search product Funtion
APP.post('/search', async (req, res) => {
    const searchInput = req.body.txtSearch;
    const username = req.session.username;
    const allProducts = await searchProduct(searchInput);
    res.render('manageProducts', { loginName: username, data: allProducts })
})

// End: Manage Product


// Begin : Manage Account

//Get All Accounts
APP.get('/manageAccounts', requiresLogin, async (req, res) => {
    const allAccounts = await getAllAccounts();
    const username = req.session.username;
    res.render('manageAccounts', { loginName: username, data: allAccounts })
})

//Add product Function
APP.post('/doAddAccount', async (req, res) => {
    const usernameInput = req.body.txtUsername;
    const passwordInput = req.body.txtPassword;
    const newAccount = { username: usernameInput, password: passwordInput };
    await addAccount(newAccount);
    res.redirect('manageAccounts');
})

APP.get('/addAccount', requiresLogin, (req, res) => {
    const username = req.session.username;
    res.render('addAccount', { loginName: username })
})

//Delete Account Function
APP.get('/deleteAccount', async (req, res) => {
    const idInput = req.query.id;
    await deleteAccount(idInput);
    res.redirect('manageAccounts');
})

//Search by ID to edit Account Function
APP.get('/editAccount', async (req, res) => {
    const idInput = req.query.id;
    const username = req.session.username;
    const search_Account = await getAccountById(idInput);
    res.render('editAccount', { loginName: username, account: search_Account })
})

//Update account function
APP.post('/updateAccount', async (req, res) => {
    const id = req.body.id;
    const usernameInput = req.body.txtUsername;
    const passwordInput = req.body.txtPassword;
    await updateAccount(id, usernameInput, passwordInput);
    res.redirect('manageAccounts');
})

// End: Manage account

//Login Function 
APP.get('/', (req, res) => {
    res.render('login');
})

APP.post('/login', async (req, res) => {
    const usernameInput = req.body.txtUsername;
    const passwordInput = req.body.txtPassword;
    const found = await checkUser(usernameInput, passwordInput)
    if (found) {
        req.session.username = usernameInput;
        res.redirect('home');
    }
    else {
        res.render('login', { errorMsg: "Username or password is incorrect!" });
    }
})

//Logout Function
APP.get('/logout', (req, res) => {
    req.session.username = false
    res.redirect('/')
})

//custom middleware
function requiresLogin(req, res, next) {
    if (req.session.username) {
        return next()
    } else {
        res.redirect('/')
    }
}

const PORT = process.env.PORT || 5000;
APP.listen(PORT);

console.debug('Server is running on ' + PORT);