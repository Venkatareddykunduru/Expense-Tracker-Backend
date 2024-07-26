document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const errorMessage = document.getElementById('error-message');
    const buyPremiumButton = document.getElementById('buy-premium');
    const showLeaderboardButton = document.getElementById('show-leaderboard');
    const leaderboardDiv = document.getElementById('leaderboard');
    let editId = null;
    let currentPage = 1;
    let limit;

    const token = localStorage.getItem('token');
    const ispremium = localStorage.getItem('ispremium');

    if (!token) {
        alert('Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    if (ispremium == 'true') {
        buyPremiumButton.style.display = 'none';
        showLeaderboardButton.style.display = 'block';
    }
    limit=localStorage.getItem('limit') || 2;

    const rowsLimitSelect = document.getElementById('rows-limit-select');
    rowsLimitSelect.value=limit;
    limit = parseInt(rowsLimitSelect.value);

    rowsLimitSelect.addEventListener('change', function () {
        limit = parseInt(this.value);
        localStorage.setItem('limit',limit);
        renderExpenses(1); // Re-render expenses with new limit starting from the first page
    });

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            renderExpenses(currentPage - 1);
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        renderExpenses(currentPage + 1);
    });

    showLeaderboardButton.addEventListener('click', function () {
        axios.get('http://35.153.50.19:3000/premium/leaderboard', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (response.status === 403) {
                alert(response.data.message);
                buyPremiumButton.style.display = 'block';
                showLeaderboardButton.style.display = 'none';
                return;
            }
            if (response.status === 401) {
                alert('You are not authenticated. Please log in again.');
                window.location.href = 'login.html'; // Redirect to login page
                return;
            }
            const leaderboard = response.data;
            leaderboardDiv.innerHTML = `
                <h3 class="text-center mb-4">Leaderboard</h3>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Total Expense</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${leaderboard.map((user, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${user.name}</td>
                                <td>₹${user.totalExpense}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        })
        .catch(error => {
            alert('Server Side issue in fetching details');
            console.error('Error fetching leaderboard', error);
        });
    });

    function createListItem(expense) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between';
        li.innerHTML = `
            ${expense.amount} - ${expense.description} - ${expense.category}
            <div>
                <button class="btn btn-secondary btn-sm me-2 edit-btn" data-id="${expense.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${expense.id}">Delete</button>
            </div>
        `;
        expenseList.appendChild(li);

        // Add event listener for delete button
        li.querySelector('.delete-btn').addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            axios.delete(`http://35.153.50.19:3000/expense/deleteexpense/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                renderExpenses(currentPage);
            })
            .catch(error => {
                console.error('Error deleting expense:', error);
                errorMessage.textContent = 'Error deleting expense';
            });
        });

        // Add event listener for edit button
        li.querySelector('.edit-btn').addEventListener('click', function () {
            editId = this.getAttribute('data-id');
            // axios.get(`http://35.153.50.19:3000/expense/getexpense/${editId}`, {
            //     headers: { Authorization: `Bearer ${token}` }
            // })
            // .then(response => {
            //     const expense = response.data;
                document.getElementById('amount').value = expense.amount;
                document.getElementById('description').value = expense.description;
                document.getElementById('category').value = expense.category;
            
        });
    }

    function renderExpenses(page) {
        axios.get(`http://35.153.50.19:3000/expense/getexpenses?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            //console.log(response.status+" "+typeof response.status);
            const expenses = response.data.expenses;
            expenseList.innerHTML = '';
            expenses.forEach(expense => createListItem(expense));
            document.getElementById('current-page').textContent = response.data.currentPage;
            currentPage = response.data.currentPage;

            // Disable/Enable pagination buttons
            document.getElementById('prev-page').disabled = currentPage === 1;
            document.getElementById('next-page').disabled = currentPage === response.data.totalPages;
        })
        .catch(error => {
            console.error('Error retrieving expenses:', error);
            errorMessage.textContent = 'Error retrieving expenses';
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;

        const newExpense = { amount, description, category };

        if (editId !== null) {
            axios.put(`http://35.153.50.19:3000/expense/editexpense/${editId}`, newExpense, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                editId = null;
                form.reset();
                renderExpenses(currentPage);
            })
            .catch(error => {
                console.error('Error updating expense:', error);
                errorMessage.textContent = 'Error updating expense';
            });
        } else {
            axios.post('http://35.153.50.19:3000/expense/addexpense', newExpense, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                form.reset();
                renderExpenses(currentPage);
            })
            .catch(error => {
                console.error('Error adding expense:', error);
                errorMessage.textContent = 'Error adding expense';
            });
        }
    });

    renderExpenses(currentPage); // Initial rendering of expenses from server
});
