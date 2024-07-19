const User=require('../models/user');
const Expense=require('../models/expense');

exports.showleaderboard=async (req, res) => {
    try {
        if (!req.user.ispremium) {
            return res.status(403).json({ message: 'Premium membership required' });
        }

        const users = await User.findAll({
            attributes: ['name', 'email'],
            include: [{
                model: Expense,
                attributes: ['amount']
            }]
        });

        const leaderboard = users.map(user => {
            const totalExpense = user.expenses.reduce((sum, expense) => sum + expense.amount, 0);
            return { name: user.name, email: user.email, totalExpense };
        }).sort((a, b) => b.totalExpense - a.totalExpense);

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}