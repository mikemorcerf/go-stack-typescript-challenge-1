import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce((acc, curr)=>{
      if(curr.type==='income'){
        acc.income += curr.value;
      } else {
        acc.outcome += curr.value;
      }
      return acc;
    }, {income: 0, outcome: 0, total: 0});
    balance.total = balance.income - balance.outcome;

    return balance;
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    const balance = this.getBalance();
    if(type==='outcome' && balance.total-value<0){
      throw Error('Current balance not enough to process transaction.');
    }

    const transaction = new Transaction({ title, type, value });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
