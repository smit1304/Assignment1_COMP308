import React from 'react';
import '../styles/App.css';

const SearchBar = ({ value, onChange, placeholder = "Search for games..." }) => {
    return (
        <div className="search-bar-container">
            <input 
                type="text" 
                className="search-input"
                value={value} 
                onChange={onChange} 
                placeholder={placeholder}
            />
            <span className="search-icon">🔍</span>
        </div>
    );
};

export default SearchBar;
