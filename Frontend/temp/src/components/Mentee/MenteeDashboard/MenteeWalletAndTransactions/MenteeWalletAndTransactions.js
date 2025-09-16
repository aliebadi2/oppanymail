import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../../config";
import "./MenteeWalletAndTransactions.css";

const MenteeWalletAndTransactions = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [addFundsAmount, setAddFundsAmount] = useState("");

  useEffect(() => {
    const fetchWalletAndTransactions = async () => {
      try {
        const walletResponse = await axios.get(`${config.path}/mentee/wallet`, {
          withCredentials: true,
        });
        setWalletBalance(walletResponse.data.balance);

        const transactionsResponse = await axios.get(
          `${config.path}/mentee/transactions`,
          { withCredentials: true }
        );
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error("Error fetching wallet or transactions:", error);
      }
    };

    fetchWalletAndTransactions();
  }, []);

  const handleAddFunds = async () => {
    if (!addFundsAmount || isNaN(addFundsAmount) || Number(addFundsAmount) <= 0) {
      alert("لطفا یک مقدار معتبر وارد کنید");
      return;
    }

    try {
      await axios.post(
        `${config.path}/mentee/wallet/add_funds`,
        { amount: addFundsAmount },
        { withCredentials: true }
      );
      setShowAddFundsModal(false);
      setAddFundsAmount(""); 
      window.location.reload(); 
    } catch (error) {
      console.error("Error adding funds:", error);
      alert("مشکلی در افزودن موجودی به کیف پول وجود دارد");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mentee-wallet-transactions-container">
      <h2 className="wallet-title">اطلاعات کیف پول</h2>
      <div className="wallet-balance">
        <span>موجودی کیف پول:</span>
        <span className="balance-amount">{walletBalance} تومان</span>
      </div>

      <button className="add-funds-button" onClick={() => setShowAddFundsModal(true)}>
        افزودن موجودی
      </button>

      <div className="transactions-table-container">
        <table className="mentee-responsive-table">
          <thead>
            <tr>
              <th>مبلغ</th>
              <th>نوع تراکنش</th>
              <th>تاریخ</th>
              <th>توضیحات</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.amount} تومان</td>
                <td>{transaction.type === "deposit" ? "اعتباری" : "برداشت"}</td>
                <td>{formatDate(transaction.timestamp)}</td>
                <td>{transaction.description || "بدون توضیحات"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddFundsModal && (
        <div className="add-funds-modal-overlay">
          <div className="add-funds-modal">
            <span className="close-button" onClick={() => setShowAddFundsModal(false)}>
              &times;
            </span>
            <h3 className="modal-title">افزودن موجودی</h3>
            <input
              type="number"
              placeholder="مبلغ به تومان"
              value={addFundsAmount}
              onChange={(e) => setAddFundsAmount(e.target.value)}
              className="input-amount"
            />
            <button className="submit-funds-button" onClick={handleAddFunds}>
              افزودن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeWalletAndTransactions;
