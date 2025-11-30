
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import Search from './Search';
import TrainTable from './TrainTable';
import { persistence } from '../../utils/persistence';
import './TrainTracker.css';

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

interface Route {
  name: string;
  trains: Train[];
}

const TrainTracker: React.FC = () => {
  const [stations, setStations] = useState<{ [key: string]: Station }>({});
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationsResponse = await fetch('https://raw.githubusercontent.com/mgwalker/amtrak-api/main/data/stations.json');
        const stationsData = await stationsResponse.json();
        setStations(stationsData);

        const trainsResponse = await fetch('https://raw.githubusercontent.com/mgwalker/amtrak-api/main/data/trains.json');
        const routesData: Route[] = await trainsResponse.json();
        setRoutes(routesData);

        // Flatten all trains for full list, initial display
        const allTrains = routesData.flatMap(route => route.trains);
        setFilteredTrains(allTrains);
      } catch (err) {
        setError('Failed to load train data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query: string, type: string) => {
    let filtered: Train[] = [];
    if (type === 'number') {
      filtered = routes.flatMap(route => route.trains).filter(train => train.number.includes(query));
    } else if (type === 'line') {
      filtered = routes.filter(route => route.name.toLowerCase().includes(query.toLowerCase())).flatMap(route => route.trains);
    } else if (type === 'station') {
      const stationCodes = Object.keys(stations).filter(code => stations[code].name.toLowerCase().includes(query.toLowerCase()));
      filtered = routes.flatMap(route => route.trains.filter(train => train.stations.some(station => stationCodes.includes(station.code))));
    }
    setFilteredTrains(filtered);
  };

  const loadPreset = async (presetName: string) => {
    const preset = await persistence.getItem(`preset-${presetName}`);
    if (preset) {
      const { query, type } = JSON.parse(preset);
      handleSearch(query, type);
    }
  };

  const savePreset = async (presetName: string, query: string, type: string) => {
    await persistence.setItem(`preset-${presetName}`, JSON.stringify({ query, type }));
  };

  if (loading) return <div className="loading">Loading train data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="train-tracker">
      <div className="search-section">
        <Search onSearch={handleSearch} onLoadPreset={loadPreset} onSavePreset={savePreset} />
      </div>
      <div className="content">
        <div className="map-container">
          <MapContainer center={[39.8283, -98.5795]} zoom={5} style={{ height: '500px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.values(stations).map((station) => (
              <Marker key={station.code} position={[station.lat, station.lon]}>
                <Popup>{station.name} ({station.code})</Popup>
              </Marker>
            ))}
            {routes.map((route) =>
              route.trains.filter(train => filteredTrains.includes(train)).map((train) => {
                const positions = train.stations
                  .map((s) => stations[s.code])
                  .filter((s): s is Station => !!s)
                  .map((s) => [s.lat, s.lon] as [number, number]);
                return positions.length > 1 ? <Polyline key={`${route.name}-${train.number}`} positions={positions} color="red" /> : null;
              })
            )}
          </MapContainer>
        </div>
        <div className="table-container">
          <TrainTable trains={filteredTrains} stations={stations} />
        </div>
      </div>
    </div>
  );
};

export default TrainTracker;
