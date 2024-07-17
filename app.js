const express=require('express');
const cors=require('cors');
const bodyparser=require('body-parser');
const userroutes=require('./routes/user');
const sequelize=require('./util/database');
const app=express();
app.use(cors());
app.use(bodyparser.json());

app.use(userroutes);

PORT=3000; 

(async () => {
    try {
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    } catch (err) {
        console.log(err);
    }
})();