
import React, { useState } from 'react';
import './TrainTable.css';

interface Station {
  code: string;
  name: string;
  lat: number;
  lon: number;
}

interface Train {
  number: string;
  name: string;
  route: string;
  distance: number;
  avgDelay: number;
  stations: { code: string; milepost: number }[];
}

interface TrainTableProps {
  trains: Train[];
  stations: { [key: string]: Station };
}

const TrainTable: React.FC<TrainTableProps> = ({ trains, stations }) => {
  const [sortKey, setSortKey] = useState<string>('number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedTrains = [...trains].sort((a, b) => {
    let aValue: string | number = a[sortKey as keyof Train] as string | number;
    let bValue: string | number = b[sortKey as keyof Train] as string | number;

    if (sortKey === 'stations') {
      aValue = a.stations.length;
      bValue = b.stations.length;
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <table className="train-table">
      <thead>
        <tr>
          <th onClick={() => handleSort('number')} style={{ cursor: 'pointer' }}>
            Number {sortKey === 'number' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
            Name {sortKey === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => handleSort('route')}>Route</th>
          <th onClick={() => handleSort('distance')} style={{ cursor: 'pointer' }}>
            Distance (mi) {sortKey === 'distance' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => handleSort('avgDelay')} style={{ cursor: 'pointer' }}>
            Avg Delay {sortKey === 'avgDelay' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => handleSort('stations')} style={{ cursor: 'pointer' }}>
            Stations Count {sortKey === 'stations' && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
          <th>Route</th>
        </tr>
      </thead>
      <tbody>
        {sortedTrains.map((train) => (
          <tr key={train.number}>
            <td>{train.number}</td>
            <td>{train.name}</td>
            <td>{train.route}</td>
            <td>{train.distance}</td>
            <td>{train.avgDelay}</td>
            <td>{train.stations.length}</td>
            <td>
              {train.stations
                .map((s) => stations[s.code]?.name || s.code)
                .join(' → ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TrainTable;
