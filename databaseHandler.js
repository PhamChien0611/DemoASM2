const { MongoClient, ObjectId } = require('mongodb');

//const URL = 'mongodb://localhost:27017';
const URL = "mongodb+srv://dbasm2:meocom255@cluster0.pcwuq.mongodb.net/test";

const DATABASE_NAME = "DBASM2"

//Get Database
async function getDB() {
    const client = await MongoClient.connect(URL);
    const dbo = client.db(DATABASE_NAME);
    return dbo;
}

//Add product function
async function addProduct(newProduct) {
    const dbo = await getDB();
    const newS = await dbo.collection("products").insertOne(newProduct);
    console.log("Gia tri id moi duoc insert la: ", newS.insertedId.toHexString());
}

//Delete product function
async function deleteProduct(idInput) {
    const dbo = await getDB();
    await dbo.collection("products").deleteOne({ _id: ObjectId(idInput) });
}

//Search product funtion
async function searchProduct(searchInput) {
    const dbo = await getDB();
    const allProducts = await dbo.collection("products").find({ name: searchInput }).toArray();
    return allProducts;
}

//Get All products
async function getAllProducts() {
    const dbo = await getDB();
    const allProducts = await dbo.collection("products").find({}).toArray();
    return allProducts;
}

//Get Product by ID
async function getProductById(idInput) {
    const dbo = await getDB();
    return dbo.collection("products").findOne({ _id: ObjectId(idInput) });
}

//Update product function
async function updateProduct(id, nameInput, priceInput, imgURLInput) {
    const dbo = await getDB();
    dbo.collection("products").updateOne({ _id: ObjectId(id) }, { $set: { name: nameInput, price: priceInput, imgURL: imgURLInput } })
}

//Get All accounts
async function getAllAccounts() {
    const dbo = await getDB();
    const allAccounts = await dbo.collection("accounts").find({}).toArray();
    return allAccounts;
}

//Add account function
async function addAccount(newAccount) {
    const dbo = await getDB();
    const newS = await dbo.collection("accounts").insertOne(newAccount);
    console.log("Gia tri id moi duoc insert la: ", newS.insertedId.toHexString());
}

//Delete account function
async function deleteAccount(idInput) {
    const dbo = await getDB();
    await dbo.collection("accounts").deleteOne({ _id: ObjectId(idInput) });
}

//Get Account by ID
async function getAccountById(idInput) {
    const dbo = await getDB();
    return dbo.collection("accounts").findOne({ _id: ObjectId(idInput) });
}

//Update account function
async function updateAccount(id, usernameInput, passwordInput) {
    const dbo = await getDB();
    dbo.collection("accounts").updateOne({ _id: ObjectId(id) }, { $set: { username: usernameInput, password: passwordInput } })
}

//Check Account function
async function checkUser(usernameInput, passwordInput) {
    const dbo = await getDB();
    const results = await dbo.collection("accounts").findOne({ username: usernameInput, password: passwordInput  });
    if (results != null)
        return true;
    else
        return false;
}

module.exports = { getDB, addProduct, deleteProduct, searchProduct, getAllProducts, getProductById, updateProduct, getAllAccounts, addAccount, deleteAccount, getAccountById, updateAccount, checkUser }