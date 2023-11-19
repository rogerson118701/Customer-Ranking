import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom'
import Tier from "../Tier";

interface Customer {
  _id: string;
  customerId: string;
  customername: string;
  reward: string;
  totalamount: number;
  lastdate: string;
  [key: string]: string | number;
}

const Customers: React.FC = (props) => {
  const history = useHistory();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [arrow, setArrow] = useState<boolean>(true);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/customers');
      setCustomers(response.data);

    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRowClick = (el: any) => {
    history.push({
      pathname: `/customers/${el.customerId}`,
      state: el,
    });
  };

  const sortData = (property: string) => {
    const sortedData = [...customers].sort((a, b) => {
      if (a[property] < b[property]) {
        return -1;
      }
      if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    });
  
    if (arrow) {
      setCustomers(sortedData);
    } else {
      setCustomers(sortedData.reverse());
    }
    setArrow(!arrow);
  };

  return <>
<h1 className="headerTitle">Customers Table</h1>
    <table id="customers">
      <thead>
        <tr>
          <th onClick={() => sortData('customerId')}>Customer Id</th>
          <th onClick={() => sortData('customerName')}>Customer Name</th>
          <th onClick={() => sortData('totalSpent')}>Reward</th>
          <th onClick={() => sortData('totalSpent')}>Total Spent</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((el, index) => <tr key={index} onClick={() => handleRowClick(el)}>
          <td>{el.customerId}</td>
          <td>{el.customerName}</td>
          <td><Tier tier={el.tierName} /></td>
          <td>${el.totalSpent}</td>
        </tr>)}
      </tbody>
    </table>
  </>
}

export default Customers;