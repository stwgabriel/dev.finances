
const

  Modal = {

    open() {
      document
        .querySelector('.modal__overlay')
        .classList.add('active');

    },
    close() {

      document
        .querySelector('.modal__overlay')
        .classList.remove('active');
    }
  },

  Utils = {

    formatAmount(value) {
      value = value * 100


      return Math.round(value)
    },
    curr(value) {

      const signal = Number(value) < 0 ? '-' : '';

      value = String(value).replace(/\D/g, '');
      value = Number(value) / 100;
      value = value.toLocaleString('pt-BR', {

        style: 'currency',
        currency: 'BRL'
      });

      return signal + value;

    },

    formatDate(date) {

      const splittedDate = date.split('-');

      return ` ${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    }
  },

  Storage = {

    get() {

      return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
    },

    set(transaction) {


      localStorage.setItem('dev.finances:transactions', JSON.stringify(transactions.data))
    }
  },

  transactions = {

    data: Storage.get(),

    add(Transaction) {

      transactions.data.push(Transaction)
      App.reload()
    },

    remove(index) {

      transactions.data.splice(index, 1);
      App.reload();
    },

    income() {

      let income = 0;
      transactions.data.forEach(transactions => {

        if (transactions.amount > 0) {

          income += transactions.amount;
        }
      })

      return income

    },

    expense() {

      let expense = 0;
      transactions.data.forEach(transactions => {

        if (transactions.amount < 1) {

          expense += transactions.amount;
        }
      })

      return expense
    },

    total() {

      return transactions.income() + transactions.expense()
    }
  },

  DOM = {

    dataContainer: document.querySelector('#data__table tbody'),

    addTransaction(transactions, index) {

      const tr = document.createElement('tr');
      tr.innerHTML = DOM.insertData(transactions, index);
      tr.dataset.index = index;

      DOM.dataContainer.appendChild(tr)
    },

    insertData(transactions, index) {

      const debit = transactions.amount > 0 ? 'income' : 'expense';
      const amount = Utils.curr(transactions.amount)

      const model = `
       
        <td class="description"> ${transactions.description} </td>
        <td class="${debit}"> ${amount} </td>
        <td class="date"> ${transactions.date} </td>
        <td> <img id='minus' onclick=" transactions.remove(${index})" src="./src/assets/minus.svg" alt="remover transaçao"></td>
        
      `
      return model
    },

    upBalance() {

      document
        .querySelector('#incomeView')
        .innerHTML = Utils.curr(transactions.income());

      document
        .getElementById('expenseView')
        .innerHTML = Utils.curr(transactions.expense());

      document
        .querySelector('#totalView')
        .innerHTML = Utils.curr(transactions.total());
    },

    clearTransa() {

      DOM.dataContainer.innerHTML = ''
    }
  },

  Form = {

    formData: {

      description: document.querySelector('#description'),
      amount: document.querySelector('#amount'),
      date: document.querySelector('#date')
    },

    getValues() {

      return {

        description: Form.formData.description.value,
        amount: Form.formData.amount.value,
        date: Form.formData.date.value
      }
    },

    validateFields() {

      const { description, amount, date } = Form.getValues();

      if (description.trim() === '' || amount.trim() === '' || date.trim() === '') {

        throw new Error('Preencha todos os campos')
      }
    },

    formatData() {

      let { description, amount, date } = Form.getValues()

      amount = Utils.formatAmount(amount);
      date = Utils.formatDate(date);

      return {

        description,
        amount,
        date
      }
    },

    clearFields() {

      Form.formData.description.value = ''
      Form.formData.amount.value = ''
      Form.formData.date.value = ''
    },

    submit(event) {

      event.preventDefault();

      try {

        Form.validateFields();
        const newTransaction = Form.formatData();
        transactions.add(newTransaction);
        Form.clearFields();
        Modal.close();

      } catch (error) {

        alert(error.message);
      };
    }
  },

  App = {

    init() {

      transactions.data.forEach(DOM.addTransaction);

      DOM.upBalance();

      Storage.set(transactions.data)

    },

    reload() {

      DOM.clearTransa();
      App.init();
    },
  };

App.init();