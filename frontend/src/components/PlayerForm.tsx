'use client';

import { useState, FormEvent } from 'react';

// Define the player data structure
interface PlayerData {
  age: number;
  position: string;
  weight: number; // in kg
  height: number; // in cm
}

// Define props for the component
interface PlayerFormProps {
  onSubmit: (data: PlayerData) => void;
  isLoading?: boolean;
}

export default function PlayerForm({ onSubmit, isLoading = false }: PlayerFormProps) {
  // Form state
  const [formData, setFormData] = useState<PlayerData>({
    age: 18,
    position: '',
    weight: 80,
    height: 180,
  });

  // Rugby positions
  const rugbyPositions = [
    'Prop', 'Hooker', 'Lock', 'Flanker', 'Number 8',
    'Scrum-half', 'Fly-half', 'Center', 'Wing', 'Full-back'
  ];

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'position' ? value : Number(value),
    });
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Player Information</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Age Field */}
        <div className="mb-4">
          <label htmlFor="age" className="block text-gray-700 font-medium mb-2">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="5"
            max="80"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Position Field */}
        <div className="mb-4">
          <label htmlFor="position" className="block text-gray-700 font-medium mb-2">
            Position
          </label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Select a position</option>
            {rugbyPositions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>
        </div>
        
        {/* Weight Field */}
        <div className="mb-4">
          <label htmlFor="weight" className="block text-gray-700 font-medium mb-2">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            min="40"
            max="150"
            step="0.1"
            value={formData.weight}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Height Field */}
        <div className="mb-6">
          <label htmlFor="height" className="block text-gray-700 font-medium mb-2">
            Height (cm)
          </label>
          <input
            type="number"
            id="height"
            name="height"
            min="120"
            max="220"
            value={formData.height}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
} 