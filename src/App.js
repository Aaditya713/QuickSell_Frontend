import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      const data = await response.json();
      setTickets(data.tickets);
      setUserData(data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const groupAndOrderTickets = (tickets, grouping, ordering) => {
    const groupedTickets = {};

    tickets.forEach((ticket) => {
      const groupKey = grouping === 'userId' ? ticket.userId : ticket[grouping];
      if (!groupedTickets[groupKey]) {
        groupedTickets[groupKey] = [];
      }
      groupedTickets[groupKey].push(ticket);
    });

    Object.keys(groupedTickets).forEach((groupKey) => {
      const orderCriteria = ordering === 'title' ? 'title' : 'priority';
      groupedTickets[groupKey].sort((a, b) => b[orderCriteria] - a[orderCriteria]);
    });

    return groupedTickets;
  };

  const groupedTickets = groupAndOrderTickets(tickets, grouping, ordering);

  const handleAddTask = () => {
    const newTask = {
      id: `NEW-${Math.random().toString(36).substr(2, 5)}`,
      title: 'New Task',
      tag: ['Feature Request'],
      userId: 'usr-1', // Default user
      status: 'Todo', // Default status
      priority: 0,    // Default priority
    };

    setTickets([...tickets, newTask]);
  };

  const priorityLevels = {
    4: 'Urgent',
    3: 'High',
    2: 'Medium',
    1: 'Low',
    0: 'No priority',
  };

  return (
    <div className="app">
      <header>
       
        <div className="cursor-container">
          <span>Display:</span>
          {/* <span className="cursor" onClick={() => fetchData()}>{grouping}</span> */}
          

          <span>Grouping:</span>
          <select className="dropdown" value={grouping} onChange={(e) => setGrouping(e.target.value)}>
            <option value="status">Status</option>
            <option value="userId">User</option>
            <option value="property">Property</option>
          </select>

          <span>Ordering:</span>
          <select className="dropdown" value={grouping} onChange={(e) => setGrouping(e.target.value)}>
            <option value="status">Priority</option>
            <option value="userId">Title</option>
          </select>

        </div>
      </header>
      <div className="board">
        {Object.keys(groupedTickets).map((group, index) => (
          <div key={index} className="column">
            <h2>{group}</h2>
            {groupedTickets[group].map((ticket) => (
              <div key={ticket.id} className="card">
                <div className="card-header">{ticket.id}</div>
                <div className="card-body">
                  <h5 className="card-title">{ticket.title}</h5>
                  <p className="card-text">{ticket.tag.join(', ')}</p>
                  <p className="card-text">Priority: {priorityLevels[ticket.priority]}</p>
                  <p className="card-text">Assigned User: {userData.find(user => user.id === ticket.userId)?.name}</p>
                </div>
              </div>
            ))}
            <button className="add-button" onClick={handleAddTask}>+</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;