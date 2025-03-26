import React, { useState, useEffect } from 'react';
import { Search, Warehouse } from 'lucide-react';
import { read, utils } from 'xlsx';
import { ClothingItem, Rack } from './types';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [searchResults, setSearchResults] = useState<ClothingItem[]>([]);

  useEffect(() => {
    const rackLayout: Rack[] = [
      { id: 'A1', name: 'A1', items: [] },
      { id: 'A2', name: 'A2', items: [] },
      { id: 'A3', name: 'A3', items: [] },
      { id: 'B1', name: 'B1', items: [] },
      { id: 'B2', name: 'B2', items: [] },
      { id: 'C1', name: 'C1', items: [] },
      { id: 'C2', name: 'C2', items: [] },
      { id: 'C3', name: 'C3', items: [] },
      { id: 'C4', name: 'C4', items: [] },
      { id: 'D1', name: 'D1', items: [] },
      { id: 'D2', name: 'D2', items: [] },
      { id: 'D3', name: 'D3', items: [] },
      { id: 'D4', name: 'D4', items: [] },
      { id: 'E1', name: 'E1', items: [] },
      { id: 'E2', name: 'E2', items: [] },
      { id: 'E3', name: 'E3', items: [] },
      { id: 'E4', name: 'E4', items: [] },
      { id: 'F1', name: 'F1', items: [] },
      { id: 'F2', name: 'F2', items: [] },
      { id: 'F3', name: 'F3', items: [] },
      { id: 'F4', name: 'F4', items: [] },
      { id: 'G1', name: 'G1', items: [] },
      { id: 'G2', name: 'G2', items: [] },
      { id: 'G3', name: 'G3', items: [] },
      { id: 'G4', name: 'G4', items: [] },
      { id: 'H1', name: 'H1', items: [] },
      { id: 'H2', name: 'H2', items: [] },
      { id: 'H3', name: 'H3', items: [] },
      { id: 'H4', name: 'H4', items: [] },
      { id: 'I1', name: 'I1', items: [] },
      { id: 'I2', name: 'I2', items: [] },
      { id: 'I3', name: 'I3', items: [] },
      { id: 'I4', name: 'I4', items: [] },
      { id: 'I5', name: 'I5', items: [] },
    ];

    const sampleItems: ClothingItem[] = [
      { id: '1', name: 'Blue Dress Shirt', type: 'shirt', color: 'blue', location: 'D4', size: 'M' },
      { id: '2', name: 'Black Suit', type: 'suit', color: 'black', location: 'E4' },
      { id: '3', name: 'Summer Dress', type: 'dress', color: 'floral', location: 'D4' },
    ];

    setRacks(rackLayout);
    setItems(sampleItems);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = items.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase()) ||
      item.color.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const handleRackClick = (rack: Rack) => {
    const rackItems = items.filter(item => item.location === rack.id);
    setSelectedRack({ ...rack, items: rackItems });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-indigo-600" />
            <h1 className="text-lg font-semibold text-slate-900">Warehouse Map</h1>
          </div>
          <div className="w-72">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-md bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto p-4">
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-4 bg-white rounded-lg shadow-sm border border-slate-200 p-3">
            <h2 className="text-sm font-medium text-slate-500 mb-2">Search Results</h2>
            <div className="grid grid-cols-2 gap-2">
              {searchResults.map((item) => (
                <div key={item.id} className="p-2 bg-slate-50 rounded border border-slate-200">
                  <h3 className="font-medium text-slate-900 text-sm">{item.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-500">{item.color} • {item.type}</span>
                    <span className="text-xs font-medium text-indigo-600">Rack {item.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floor Plan */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-9 gap-2 text-center text-xs font-medium text-slate-500 mb-4">
            <div>A</div>
            <div>B</div>
            <div>C</div>
            <div>D</div>
            <div>E</div>
            <div>F</div>
            <div>G</div>
            <div>H</div>
            <div>I</div>
          </div>
          
          <div className="grid grid-cols-9 gap-2">
            {/* Column A */}
            <div className="space-y-2">
              {['A3', 'A2', 'A1'].map(id => (
                <div
                  key={id}
                  className={`aspect-square ${
                    selectedRack?.id === id 
                      ? 'bg-indigo-50 border-indigo-500' 
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                  } border rounded cursor-pointer transition-all
                  flex items-center justify-center text-xs font-medium text-slate-700`}
                  onClick={() => handleRackClick(racks.find(r => r.id === id)!)}
                >
                  {id}
                </div>
              ))}
            </div>

            {/* Column B */}
            <div className="space-y-2">
              {['B2', 'B1'].map(id => (
                <div
                  key={id}
                  className={`aspect-square ${
                    selectedRack?.id === id 
                      ? 'bg-indigo-50 border-indigo-500' 
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                  } border rounded cursor-pointer transition-all
                  flex items-center justify-center text-xs font-medium text-slate-700`}
                  onClick={() => handleRackClick(racks.find(r => r.id === id)!)}
                >
                  {id}
                </div>
              ))}
            </div>

            {/* Columns C through I */}
            {['C', 'D', 'E', 'F', 'G', 'H', 'I'].map(column => (
              <div key={column} className="space-y-2">
                {Array.from({ length: column === 'I' ? 5 : 4 }).map((_, index) => {
                  const id = `${column}${column === 'I' ? 5 - index : 4 - index}`;
                  return (
                    <div
                      key={id}
                      className={`aspect-square ${
                        selectedRack?.id === id 
                          ? 'bg-indigo-50 border-indigo-500' 
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                      } border rounded cursor-pointer transition-all
                      flex items-center justify-center text-xs font-medium text-slate-700`}
                      onClick={() => handleRackClick(racks.find(r => r.id === id)!)}
                    >
                      {id}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal for rack contents */}
      {selectedRack && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-slate-900">Rack {selectedRack.name}</h2>
              <button
                onClick={() => setSelectedRack(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>
            {selectedRack.items.length > 0 ? (
              <ul className="space-y-2">
                {selectedRack.items.map((item) => (
                  <li key={item.id} className="border-b border-slate-100 pb-2">
                    <h3 className="font-medium text-slate-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-slate-500">
                      {item.color} • {item.type} • {item.size || 'No size'}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No items in this rack</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;