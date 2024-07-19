const Expense = require('../models/expense.js');
const sequelize=require('../util/database.js');

exports.addexpense = async (req, res, next) => {
    const amount = parseInt(req.body.amount, 10);
    const category = req.body.category;
    const description = req.body.description;
    

    try {
        let expense;
        await sequelize.transaction(async (t) => {
            // Create the expense within the transaction
            expense=await req.user.createExpense({
                amount: amount,
                category: category,
                description: description
            }, { transaction: t });

            // Update the user's totalExpense within the transaction
            req.user.totalExpense = (parseInt(req.user.totalExpense, 10) || 0) + amount;
            await req.user.save({ transaction: t });
        });

        console.log('Expense saved');
        res.status(200).json({ message: 'Expense added successfully',id:expense.id});
    } catch (err) {
        console.log('Error adding expense:', err);
        res.status(500).json({ error: 'Failed to add expense' });
    }
};

exports.getexpenses = (req, res, next) => {
    console.log('get expenses method is called');
    req.user.getExpenses()
    .then((data) => {
        console.log(data);
        res.json(data);
    })
    .catch((err) => {
        console.log("Error getting expenses: " + err);
        res.status(500).json({ error: 'Failed to retrieve expenses' });
    });
}

exports.deleteexpense = async (req, res, next) => {
    const id = req.params.id;

    try {
        await sequelize.transaction(async (t) => {
            // Find the expense within the transaction context
            const expense = await Expense.findByPk(id, { transaction: t });

            if (!expense) {
                throw new Error('Expense not found'); // This will trigger a rollback
            }

            const amount = expense.amount;

            // Delete the expense within the transaction
            await expense.destroy({ transaction: t });

            // Subtract the amount from the user's totalExpense within the transaction
            req.user.totalExpense = (parseInt(req.user.totalExpense, 10) || 0) - amount;
            await req.user.save({ transaction: t });
        });

        console.log('Expense deleted');
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.log('Error deleting expense:', err);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};

exports.editexpense = async (req, res, next) => {
    const id = req.params.id;
    const updatedAmount = parseInt(req.body.amount, 10);
    const updatedCategory = req.body.category;
    const updatedDescription = req.body.description;

    try {
        await sequelize.transaction(async (t) => {
            // Find the expense within the transaction context
            const expense = await Expense.findByPk(id, { transaction: t });

            if (!expense) {
                return res.status(404).json({ error: 'Expense not found' });
            }

            // Calculate the difference in amount
            const amountDifference = updatedAmount - expense.amount;

            // Update the expense fields
            expense.amount = updatedAmount;
            expense.category = updatedCategory;
            expense.description = updatedDescription;

            // Save the updated expense within the transaction
            await expense.save({ transaction: t });

            // Update the user's total expense
            req.user.totalExpense += amountDifference;
            await req.user.save({ transaction: t });
        });

        console.log('Expense updated');
        res.status(200).json({ message: 'Expense updated successfully', });
    } catch (err) {
        console.log('Error updating expense: ' + err);
        res.status(500).json({ error: 'Failed to update expense' });
    }
};