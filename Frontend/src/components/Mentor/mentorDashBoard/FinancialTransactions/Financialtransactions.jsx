import React from 'react'
import DataTable from '../Table/DataTable'
import ClickButton from '../Cilck-button/ClickButton'
import './Financialtransactions.css'
function Financialtransactions() {
  return (
    <div className='transactions-container'>
      <div className='dash-board-balance'>
        <div >
          <p>موجودی حساب قابل برداشت: </p>
        </div>
      </div>
      <div className='dash-bord-account-history'>
        <h5>لیست واریز انجام شده </h5>
        <DataTable/>
      </div>
    </div>
  )
}

export default Financialtransactions