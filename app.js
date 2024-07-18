const express=require('express');
const cors=require('cors');
const bodyparser=require('body-parser');
const sequelize=require('./util/database');
const expenseroutes=require('./routes/expense');
const userauthroutes=require('./routes/user');
const paymentroutes=require('./routes/payment');
const User=require('./models/user');
const Expense=require('./models/expense');
const Order=require('./models/order');


const app=express();
app.use(cors());
app.use(bodyparser.json());

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);

// User.findByPk(1).then((user)=>{
//     console.log(Object.keys(user.__proto__)); // Outputs all methods available on user instance

// })// Example of fetching a user instance

// Check available methods

app.use('/auth',userauthroutes);
app.use('/expense',expenseroutes);
app.use('/payment',paymentroutes);


PORT=3000; 

(async () => {
    try {
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (err) {
        console.log('Unable to start server : '+err);
    }
})();