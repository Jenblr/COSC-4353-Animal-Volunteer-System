import React, { useState } from 'react';
import { volunteerData } from '../data/mockData';

const VolunteerHistoryTable = () => {
  const [data, setData] = useState(volunteerData);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'ascending' });
  const [filterStatus, setFilterStatus] = useState('All');

  // Sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Filter
  const filteredData = sortedData.filter((volunteer) => {
    if (filterStatus === 'All') return true;
    return volunteer.status === filterStatus;
  });

  return (
    <div>
      <h2>Volunteer History</h2>

      {/* Filter Options */}
      <label htmlFor="statusFilter">Filter by Status:</label>
      <select id="statusFilter" onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
        <option value="All">All</option>
        <option value="Attended">Attended</option>
        <option value="Missed">Missed</option>
      </select>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('event')}>Event</th>
            <th onClick={() => handleSort('status')}>Status</th>
            <th onClick={() => handleSort('date')}>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((volunteer) => (
            <tr key={volunteer.id}>
              <td>{volunteer.name}</td>
              <td>{volunteer.event}</td>
              <td>{volunteer.status}</td>
              <td>{volunteer.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerHistoryTable;