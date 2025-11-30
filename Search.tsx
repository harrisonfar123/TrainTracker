
import React, { useState } from 'react';
import './Search.css';

interface SearchProps {
  onSearch: (query: string, type: string) => void;
  onLoadPreset: (presetName: string) => void;
  onSavePreset: (presetName: string, query: string, type: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch, onLoadPreset, onSavePreset }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('number');
  const [presetName, setPresetName] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, type);
    }
  };

  const handleLoad = () => {
    if (presetName.trim()) {
      onLoadPreset(presetName);
    }
  };

  const handleSave = () => {
    if (presetName.trim() && query.trim()) {
      onSavePreset(presetName, query, type);
      alert(`Preset "${presetName}" saved!`);
    }
  };

  return (
    <div className="search">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="number">Train Number</option>
        <option value="line">Train Line</option>
        <option value="station">Station</option>
      </select>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search by ${type}...`}
      />
      <button onClick={handleSearch}>Search</button>
      <div className="preset">
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="Preset name"
        />
        <button onClick={handleLoad}>Load Preset</button>
        <button onClick={handleSave}>Save Preset</button>
      </div>
    </div>
  );
};

export default Search;
