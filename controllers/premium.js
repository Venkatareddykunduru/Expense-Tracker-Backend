const { Sequelize } = require('sequelize');
const User = require('../models/user');
const Expense = require('../models/expense');

exports.showleaderboard = async (req, res) => {
    try {
        if (!req.user.ispremium) {
            return res.status(403).json({ message: 'Premium membership required' });
        }

        const leaderboard = await User.findAll({
            attributes: [
                'name', 
                'email',
                [Sequelize.fn('COALESCE', Sequelize.fn('SUM', Sequelize.col('expenses.amount')), 0), 'totalExpense']
            ],
            include: [{
                model: Expense,
                attributes: []
            }],
            group: ['User.id'],
            order: [[Sequelize.literal('totalExpense'), 'DESC']]
        });

        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
