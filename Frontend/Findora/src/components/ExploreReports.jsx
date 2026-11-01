import Navbar from "./Navbar";

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
    {/* RESULTS HEADING */}
    <div className="results-heading">
      <div>
        <h3>Campus item reports</h3>
        <p>Browse the latest lost and found items.</p>
      </div>
      <select
        id="sort-reports"
        className="sort-select"
        aria-label="Sort reports"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="az">Name: A to Z</option>
      </select>
    </div>
    {/* REPORT CARDS */}
    <div className="reports-grid" id="reports-grid">
      {/* JavaScript renders reports here */}
    </div>
    <div className="empty-state" id="empty-state" hidden="">
      <span>🔎</span>
      <h3>No matching reports found</h3>
      <p>Try changing your search or resetting the filters.</p>
      <button type="button" id="empty-reset" className="secondary-button">
        Reset search
      </button>
    </div>
  </section>
  {/* BOTTOM MESSAGE */}
  <section className="bottom-banner">
    <span>💜</span>
    <div>
      <h3>Be someone's reason to smile.</h3>
      <p>
        If you find something, reporting it could reunite someone with something
        important.
      </p>
    </div>
  </section>
</>

    )
}

export default ExploreReports;