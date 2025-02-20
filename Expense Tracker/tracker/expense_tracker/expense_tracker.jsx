import { useState } from 'react';
import { Plus, Minus, Trash, Edit } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  expenses: number;
}

interface Expense {
  id: number;
  name: string;
  amount: number;
}

const ExpenseTracker = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const addCategory = () => {
    if (newCategory) {
      setCategories([...categories, { id: categories.length + 1, name: newCategory, expenses: 0 }]);
      setNewCategory('');
    }
  };

  const addExpense = () => {
    if (newExpenseName && newExpenseAmount && selectedCategory) {
      setExpenses([...expenses, { id: expenses.length + 1, name: newExpenseName, amount: newExpenseAmount }]);
      setSelectedCategory({ ...selectedCategory, expenses: selectedCategory.expenses + newExpenseAmount });
      setCategories(categories.map(category => category.id === selectedCategory.id ? { ...category, expenses: category.expenses + newExpenseAmount } : category));
      setNewExpenseName('');
      setNewExpenseAmount(0);
    }
  };

  const deleteCategory = (category: Category) => {
    setCategories(categories.filter(c => c.id !== category.id));
    setExpenses(expenses.filter(expense => expense.name !== category.name));
  };

  const deleteExpense = (expense: Expense) => {
    setExpenses(expenses.filter(e => e.id !== expense.id));
    setSelectedCategory({ ...selectedCategory, expenses: selectedCategory.expenses - expense.amount });
    setCategories(categories.map(category => category.id === selectedCategory.id ? { ...category, expenses: category.expenses - expense.amount } : category));
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const saveEditedCategory = () => {
    if (editingCategory) {
      setCategories(categories.map(category => category.id === editingCategory.id ? { ...category, name: newCategory } : category));
      setEditingCategory(null);
      setNewCategory('');
    }
  };

  const editExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const saveEditedExpense = () => {
    if (editingExpense) {
      setExpenses(expenses.map(expense => expense.id === editingExpense.id ? { ...expense, name: newExpenseName, amount: newExpenseAmount } : expense));
      setSelectedCategory({ ...selectedCategory, expenses: selectedCategory.expenses - editingExpense.amount + newExpenseAmount });
      setCategories(categories.map(category => category.id === selectedCategory.id ? { ...category, expenses: category.expenses - editingExpense.amount + newExpenseAmount } : category));
      setEditingExpense(null);
      setNewExpenseName('');
      setNewExpenseAmount(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Expense Tracker</h1>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Add new category"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
        />
        <button
          onClick={addCategory}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
        >
          <Plus className="mr-2" />
          Add Category
        </button>
      </div>
      <div className="flex flex-wrap justify-between mb-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-gray-100 p-4 rounded-lg w-full md:w-1/2 xl:w-1/3 mb-4 md:mb-0 xl:mb-0"
          >
            <h2 className="text-xl font-bold mb-2">{category.name}</h2>
            <p className="text-lg font-bold mb-2">Expenses: ${category.expenses}</p>
            <button
              onClick={() => setSelectedCategory(category)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            >
              View Expenses
            </button>
            <button
              onClick={() => editCategory(category)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-yellow-400"
            >
              <Edit className="mr-2" />
              Edit
            </button>
            <button
              onClick={() => deleteCategory(category)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-red-400"
            >
              <Trash className="mr-2" />
              Delete
            </button>
          </div>
        ))}
      </div>
      {selectedCategory && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-bold mb-2">{selectedCategory.name} Expenses</h2>
          <div className="flex justify-between mb-4">
            <input
              type="text"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              placeholder="Add new expense"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
            />
            <input
              type="number"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
              placeholder="Amount"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
            />
            <button
              onClick={addExpense}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            >
              <Plus className="mr-2" />
              Add Expense
            </button>
          </div>
          <div className="flex flex-wrap justify-between mb-4">
            {expenses
              .filter((expense) => expense.name === selectedCategory.name)
              .map((expense) => (
                <div
                  key={expense.id}
                  className="bg-gray-200 p-4 rounded-lg w-full md:w-1/2 xl:w-1/3 mb-4 md:mb-0 xl:mb-0"
                >
                  <h2 className="text-lg font-bold mb-2">{expense.name}</h2>
                  <p className="text-lg font-bold mb-2">Amount: ${expense.amount}</p>
                  <button
                    onClick={() => editExpense(expense)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-yellow-400"
                  >
                    <Edit className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExpense(expense)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-red-400"
                  >
                    <Trash className="mr-2" />
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
      {editingCategory && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-bold mb-2">Edit Category</h2>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
          />
          <button
            onClick={saveEditedCategory}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
          >
            <Plus className="mr-2" />
            Save
          </button>
        </div>
      )}
      {editingExpense && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-bold mb-2">Edit Expense</h2>
          <input
            type="text"
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
            placeholder="Expense name"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
          />
          <input
            type="number"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(Number(e.target.value))}
            placeholder="Amount"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-400"
          />
          <button
            onClick={saveEditedExpense}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
          >
            <Plus className="mr-2" />
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;