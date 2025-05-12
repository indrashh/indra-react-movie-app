import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="text-dark-100">
      <div className="search">
        <div>
          <img src="search.svg" alt="" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a Movies.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
