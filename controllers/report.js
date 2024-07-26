exports.generatereport=async (req,res)=>{
    try{
        if (!req.user.ispremium) {
            return res.status(403).json({ message: 'Premium membership required' });
        }
        const expenses=await req.user.getExpenses();
        const groupedData = expenses.reduce((acc, expense) => {
            const date = new Date(expense.createdAt);
            const year = date.getFullYear();
            const month = date.toLocaleString('default', { month: 'long' });
            const day = date.getDate();

            // Initialize year, month, and day if not present
            if (!acc[year]) {
                acc[year] = { total: 0, months: {} };
            }
            if (!acc[year].months[month]) {
                acc[year].months[month] = { total: 0, days: {} };
            }
            if (!acc[year].months[month].days[day]) {
                acc[year].months[month].days[day] = { total: 0, expenses: [] };
            }

            // Update totals
            acc[year].total += expense.amount;
            acc[year].months[month].total += expense.amount;
            acc[year].months[month].days[day].total += expense.amount;

            // Add expense details
            acc[year].months[month].days[day].expenses.push({
                description: expense.description,
                category: expense.category,
                amount: expense.amount,
                date:date
            });
   
            return acc;
        }, {});

        //console.log(groupedData);

        res.json(groupedData);
    }
    catch(error){
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}