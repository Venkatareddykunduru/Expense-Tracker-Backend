document.addEventListener('DOMContentLoaded', async function () {
    // Example data, replace with actual data from your backend
    // const data = {
    //     "2023": {
    //         "total": 1200,
    //         "months": {
    //             "January": {
    //                 "total": 300,
    //                 "days": {
    //                     "5": {
    //                         "total": 100,
    //                         "expenses": [
    //                             {
    //                                 "description": "Lunch",
    //                                 "category": "Food",
    //                                 "amount": 50,
    //                                 "date": "2023-01-05T12:30:00.000Z"
    //                             },
    //                             {
    //                                 "description": "Bus Ticket",
    //                                 "category": "Transport",
    //                                 "amount": 50,
    //                                 "date": "2023-01-05T08:15:00.000Z"
    //                             }
    //                         ]
    //                     },
    //                     "15": {
    //                         "total": 200,
    //                         "expenses": [
    //                             {
    //                                 "description": "Dinner",
    //                                 "category": "Food",
    //                                 "amount": 100,
    //                                 "date": "2023-01-15T19:45:00.000Z"
    //                             },
    //                             {
    //                                 "description": "Movie Ticket",
    //                                 "category": "Entertainment",
    //                                 "amount": 100,
    //                                 "date": "2023-01-15T21:00:00.000Z"
    //                             }
    //                         ]
    //                     }
    //                 }
    //             },
    //             "February": {
    //                 "total": 400,
    //                 "days": {
    //                     "10": {
    //                         "total": 150,
    //                         "expenses": [
    //                             {
    //                                 "description": "Coffee",
    //                                 "category": "Food",
    //                                 "amount": 50,
    //                                 "date": "2023-02-10T09:00:00.000Z"
    //                             },
    //                             {
    //                                 "description": "Books",
    //                                 "category": "Education",
    //                                 "amount": 100,
    //                                 "date": "2023-02-10T11:00:00.000Z"
    //                             }
    //                         ]
    //                     },
    //                     "20": {
    //                         "total": 250,
    //                         "expenses": [
    //                             {
    //                                 "description": "Dinner",
    //                                 "category": "Food",
    //                                 "amount": 150,
    //                                 "date": "2023-02-20T20:00:00.000Z"
    //                             },
    //                             {
    //                                 "description": "Taxi",
    //                                 "category": "Transport",
    //                                 "amount": 100,
    //                                 "date": "2023-02-20T22:00:00.000Z"
    //                             }
    //                         ]
    //                     }
    //                 }
    //             }
    //         }
    //     },
    //     "2024": {
    //         "total": 1500,
    //         "months": {
    //             "March": {
    //                 "total": 500,
    //                 "days": {
    //                     "1": {
    //                         "total": 300,
    //                         "expenses": [
    //                             {
    //                                 "description": "Groceries",
    //                                 "category": "Food",
    //                                 "amount": 150,
    //                                 "date": "2024-03-01T10:00:00.000Z"
    //                             },
    //                             {
    //                                 "description": "Fuel",
    //                                 "category": "Transport",
    //                                 "amount": 150,
    //                                 "date": "2024-03-01T15:00:00.000Z"
    //                             }
    //                         ]
    //                     },
    //                     "10": {
    //                         "total": 200,
    //                         "expenses": [
    //                             {
    //                                 "description": "Lunch",
    //                                 "category": "Food",
    //                                 "amount": 100,
    //                                 "date": "2024-03-10T13:00:00.000Z"
    //                             },
    //                             {
    //                                 "description": "Bus Ticket",
    //                                 "category": "Transport",
    //                                 "amount": 100,
    //                                 "date": "2024-03-10T08:30:00.000Z"
    //                             }
    //                         ]
    //                     }
    //                 }
    //             },
    //             "April": {
    //                 "total": 1000,
    //                 "days": {
    //                     "5": {
    //                         "total": 300,
    //                         "expenses": [
    //                             {
    //                                 "description": "Dinner",
    //                                 "category": "Food",
    //                                 "amount": 200,
    //                                 "date": "2024-04-05T20:00:00.000Z"
    //                             },
    //                             {
    //                                 "description": "Taxi",
    //                                 "category": "Transport",
    //                                 "amount": 100,
    //                                 "date": "2024-04-05T22:00:00.000Z"
    //                             }
    //                         ]
    //                     },
    //                     "15": {
    //                         "total": 700,
    //                         "expenses": [
    //                             {
    //                                 "description": "Concert",
    //                                 "category": "Entertainment",
    //                                 "amount": 300,
    //                                 "date": "2024-04-15T19:00:00.000Z"
    //                             },
    //                             {
    //                                 "description": "Dinner",
    //                                 "category": "Food",
    //                                 "amount": 200,
    //                                 "date": "2024-04-15T21:00:00.000Z"
    //                             },
    //                             {
    //                                 "description": "Books",
    //                                 "category": "Education",
    //                                 "amount": 200,
    //                                 "date": "2024-04-15T18:00:00.000Z"
    //                             }
    //                         ]
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // };
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please log in first.');
        window.location.href = 'login.html';
        return;
    }
    const response=await axios.get('http://35.153.50.19:3000/report/generatereport', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data=response.data;
    const container = document.querySelector('.container');
    
    // Create a function to add a table for each month
    function createMonthTable(month, monthData) {
        const monthTable = document.createElement('table');
        monthTable.className = 'table table-bordered mt-4';
        monthTable.innerHTML = `
            <thead>
                <tr class="table-primary">
                     <th colspan="4" class="text-center"><h2>${month}</h2></th>
                </tr>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                
                ${Object.entries(monthData.days).map(([day, dayData]) => `
                    
                    ${dayData.expenses.map(exp => `
                        <tr>
                            <td>${new Date(exp.date).toLocaleDateString()}</td>
                            <td>${exp.description}</td>
                            <td>${exp.category}</td>
                            <td>$${exp.amount.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="bg-light font-weight-bold">Total: $${dayData.total.toFixed(2)}</td>
                    </tr>
                `).join('')}

                <tr>

                    <td colspan="4" class="bg-light font-weight-bold text-center">Expenses for the whole month Total: $${monthData.total.toFixed(2)}</td>
                </tr>
                
            </tbody>
        `;
        return monthTable;
    }

    // Iterate over years and generate tables
    for (const [year, yearData] of Object.entries(data)) {
        // Year summary table
        // const yearHeading = document.createElement('h1');
        // yearHeading.textContent = `Year: ${year}`;
        // container.appendChild(yearHeading);
        
        const yearSummaryTable = document.createElement('table');
        yearSummaryTable.className = 'table table-bordered mt-3';
        yearSummaryTable.innerHTML = `
            <thead>
                <tr class="table-primary">
                     <th colspan="4" class="text-center"><h2>${year}</h2></th>
                </tr>
                <tr>
                    <th>Month</th>
                    <th>Total Expense</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(yearData.months).map(([month, monthData]) => `
                    <tr>
                        <td>${month}</td>
                        <td>$${monthData.total.toFixed(2)}</td>
                    </tr>
                `).join('')}
                <tr>

                    <td colspan="4" class="bg-light font-weight-bold text-center">Expenses for the whole year Total: $${yearData.total.toFixed(2)}</td>
                </tr>
            </tbody>
        `;
        container.appendChild(yearSummaryTable);
        
        // Monthly tables
        for (const [month, monthData] of Object.entries(yearData.months)) {
            
            const monthTable = createMonthTable(month, monthData);
            container.appendChild(monthTable);
        }

        const hr = document.createElement('hr');
        hr.style.border = '2px solid black';
        container.appendChild(hr);
    }
});
