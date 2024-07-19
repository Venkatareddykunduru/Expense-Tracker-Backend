const User = require('../models/user');

exports.showleaderboard = async (req, res) => {
    try {
        if (!req.user.ispremium) {
            return res.status(403).json({ message: 'Premium membership required' });
        }

        const leaderboard = await User.findAll({
            attributes: ['name', 'email', 'totalExpense'],
            order: [['totalExpense', 'DESC']]
        });

        res.json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
