import Items from "./Items";

function ExploreReports(){
    return(
        <>
  {/* DISCOVER REPORTS */}
  <section className="discover-section" id="discover-section">
    <div className="section-intro">
      <div>
        <span className="eyebrow">CAMPUS COMMUNITY</span>
        <h2>Explore reports</h2>
        <p>Maybe someone has already reported what you're looking for.</p>
      </div>
      <span className="section-number">02 / DISCOVER</span>
    </div>
    {/* SEARCH BAR */}
    <div className="search-panel">
      <div className="search-title">
        <div>
          <h3>Find an item</h3>
          <p>Search by item name, colour, category or location.</p>
        </div>
        <span className="search-decoration">⌕</span>
      </div>
      <div className="search-input-wrap">
        <span className="search-icon">⌕</span>
        <input
          type="search"
          id="search-input"
          placeholder="Try “black backpack” or “library”..."
          aria-label="Search reports"
        />
        <button type="button" id="clear-search" className="clear-search">
          Clear
        </button>
      </div>
      {/* FILTERS */}
      <div className="filters-grid">
        <div className="filter-field">
          <label htmlFor="filter-type">Report type</label>
          <select id="filter-type">
            <option value="All">All reports</option>
            <option value="Lost">Lost items</option>
            <option value="Found">Found items</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-category">Category</label>
          <select id="filter-category">
            <option value="All">All categories</option>
            <option>Bags &amp; Accessories</option>
            <option>Electronics</option>
            <option>Personal Items</option>
            <option>Books &amp; Stationery</option>
            <option>Clothing</option>
            <option>Keys &amp; Cards</option>
            <option>Documents</option>
            <option>Other</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-color">Colour</label>
          <select id="filter-color">
            <option value="All">All colours</option>
            <option>Black</option>
            <option>White</option>
            <option>Blue</option>
            <option>Red</option>
            <option>Green</option>
            <option>Pink</option>
            <option>Brown</option>
            <option>Other</option>
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-location">Location</label>
          <select id="filter-location">
            <option value="All">All locations</option>
            <option>Academic Block</option>
            <option>Library</option>
            <option>Computer Lab</option>
            <option>Cafeteria</option>
            <option>Auditorium</option>
            <option>Sports Area</option>
            <option>Parking Area</option>
            <option>Hostel</option>
            <option>Other / Not sure</option>
          </select>
        </div>
      </div>
      <div className="filter-bottom">
        <span id="results-count" aria-live="polite">
          Showing all reports
        </span>
        <button type="button" id="reset-filters" className="reset-button">
          ↺ Reset filters
        </button>
      </div>
    </div>
  </section>

  <section className="items-section">
    <Items/>
</section>

</>

    )
}

export default ExploreReports;