import React, { useState, useEffect } from 'react';
import './Navbar.css';

const CATEGORIES = [
    { id: 'anime', name: 'Anime', link: '/anime' },
    { id: 'manga', name: 'Manga', link: '/manga' },
    { id: 'games', name: 'Games', link: '/games' },
    { id: 'movies', name: 'Movies', link: '/movies' },
    { id: 'tvshows', name: 'TV Shows', link: '/tvshows' },
    { id: 'kpop', name: 'K-pop', link: '/kpop' },
    { id: 'comics', name: 'Comics', link: '/comics' },
];

const Navbar = ({
    onSearch,
    onFilterClick,
    onSortClick,
    onBookmarksClick,
    // onChatbotClick,
    breadcrumbs = [],
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [visitorCount, setVisitorCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        try {
            const hasVisited = sessionStorage.getItem('fv_visited');
            const stored = localStorage.getItem('visitorCount');
            let count = stored ? parseInt(stored, 10) : 0;

            if (!hasVisited) {
                count += 1;
                localStorage.setItem('visitorCount', count.toString());
                sessionStorage.setItem('fv_visited', '1');
            }
            setVisitorCount(count);
        } catch (e) {
            setVisitorCount(0);
        }
    }, []);

    const formatTime = (date) =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        if (onSearch) onSearch(query);
    };

    const handleCategoryClick = (categoryId) => {
        console.log('Category clicked:', categoryId);
        setIsMenuOpen(false);
    };

    const handleLoginClick = () => console.log('Login clicked');
    const handleSignupClick = () => console.log('Signup clicked');
    const handleAboutClick = () => console.log('About clicked');
    const handleContactClick = () => console.log('Contact clicked');
    const toggleMenu = () => setIsMenuOpen((open) => !open);

    const renderCategoryLinks = () =>
        CATEGORIES.map((category) => (
            <a
                key={category.id}
                href={category.link}
                className="cat-link"
                onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category.id);
                }}
            >
                {category.name}
            </a>
        ));

    const renderSearch = () => (
        <div className="search-container">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
                type="text"
                className="search-bar"
                placeholder="Search fandoms, articles..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search content"
            />
        </div>
    );

    const renderIconButtons = () => (
        <div className="icon-group">
            <button className="icon-btn" title="Filter" onClick={onFilterClick} aria-label="Filter content">
                ▤
            </button>
            <button className="icon-btn" title="Sort" onClick={onSortClick} aria-label="Sort content">
                ↕
            </button>
            <button className="icon-btn" title="Bookmarks" onClick={onBookmarksClick} aria-label="Bookmarks">
                ☆
            </button>
        </div>
    );

    const renderAuthButtons = () => (
        <div className="btn-group">
            <button className="btn btn-ghost" onClick={handleLoginClick}>Login</button>
            <button className="btn btn-primary" onClick={handleSignupClick}>Sign Up</button>
        </div>
    );

    const renderLogo = () => (
        <a href="/" className="logo-section" aria-label="FandomVerse home">
            <div className="logo-mark">
                <span className="logo-mark-text">Fv</span>
                <div className="logo-orbit" aria-hidden="true">
                    <i></i><i></i><i></i>
                </div>
            </div>
            <div className="logo-word">
                <span>F</span><span>a</span><span>n</span><span>d</span><span>o</span><span>m</span>
                <span className="accent">V</span><span className="accent">e</span><span className="accent">r</span><span className="accent">s</span><span className="accent">e</span>
            </div>
        </a>
    );

    return (
        <div className="navbar-wrapper">
            <div className="util-bar">
                <div className="util-left">
                    <div className="util-item">
                        <span className="dot" aria-hidden="true"></span>
                        {visitorCount.toLocaleString()} online
                    </div>
                    <div className="util-item">{formatTime(currentTime)}</div>
                </div>
                <div className="util-right">
                    <a href="#about" onClick={(e) => { e.preventDefault(); handleAboutClick(); }}>
                        About Us
                    </a>
                    <span className="util-sep">|</span>
                    <a href="#contact" onClick={(e) => { e.preventDefault(); handleContactClick(); }}>
                        Contact
                    </a>
                </div>
            </div>

            <nav className={`navbar${isMenuOpen ? ' menu-open' : ''}`}>
                {renderLogo()}

                <div className="nav-center">
                    <div className="categories">{renderCategoryLinks()}</div>
                </div>

                <div className="navbar-right">
                    {renderSearch()}
                    {renderIconButtons()}
                    {renderAuthButtons()}
                </div>

                <button
                    className="hamburger"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            </nav>

            <div className="mobile-menu">
                <div className="mobile-menu-inner">
                    <div className="nav-center">
                        <div className="categories">{renderCategoryLinks()}</div>
                        {renderSearch()}
                    </div>
                    <div className="navbar-right">
                        {renderIconButtons()}
                        {renderAuthButtons()}
                    </div>
                </div>
            </div>

            {breadcrumbs.length > 0 && (
                <div className="navbar-breadcrumb">
                    <ul className="breadcrumb-list">
                        <li className="breadcrumb-item">
                            <a href="/" className="crumb">Home</a>
                        </li>
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                <li className="breadcrumb-separator" aria-hidden="true">›</li>
                                <li className={`breadcrumb-item${crumb.active ? ' active' : ''}`}>
                                    {crumb.active ? (
                                        <span className="crumb active">{crumb.label}</span>
                                    ) : (
                                        <a href={crumb.href} className="crumb">{crumb.label}</a>
                                    )}
                                </li>
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Navbar;