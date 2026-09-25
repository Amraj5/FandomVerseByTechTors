import React, { useState, useEffect, useRef } from 'react';
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

/* ===== Inline SVG icons ===== */
const Svg = ({ children, size = 18, strokeWidth = 1.8, ...p }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size} height={size} viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true" {...p}
    >
        {children}
    </svg>
);

const SearchIcon = (p) => (
    <Svg {...p}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </Svg>
);
const FilterIcon = (p) => (
    <Svg {...p}>
        <path d="M4 6h16" /><path d="M7 12h10" /><path d="M10 18h4" />
    </Svg>
);
const SortIcon = (p) => (
    <Svg {...p}>
        <path d="m8 4-4 4 4 4" /><path d="M4 8h12" />
        <path d="m16 20 4-4-4-4" /><path d="M20 16H8" />
    </Svg>
);
const BookmarkIcon = (p) => (
    <Svg {...p}>
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
    </Svg>
);
const MenuIcon = (p) => (
    <Svg {...p}>
        <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
    </Svg>
);
const CloseIcon = (p) => (
    <Svg {...p}>
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </Svg>
);
const ChevronDownIcon = (p) => (
    <Svg {...p}>
        <path d="m6 9 6 6 6-6" />
    </Svg>
);
const LogOutIcon = (p) => (
    <Svg {...p}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
    </Svg>
);

const Navbar = ({
    user,
    onLoginClick,
    onSignupClick,
    onLogout,
    onSearch,
    onFilterClick,
    onSortClick,
    onBookmarksClick,
    onChatbotClick,
    breadcrumbs = [],
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [visitorCount, setVisitorCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

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
        } catch {
            setVisitorCount(0);
        }
    }, []);

    useEffect(() => {
        if (!isUserMenuOpen) return;
        const onClick = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [isUserMenuOpen]);

    useEffect(() => {
        if (!isMenuOpen) setIsUserMenuOpen(false);
    }, [isMenuOpen]);

    /* No seconds — keeps the util bar compact on narrow screens. */
    const formatTime = (date) =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        onSearch?.(query);
    };

    const handleCategoryClick = (id) => {
        console.log('Category clicked:', id);
        setIsMenuOpen(false);
    };

    const handleLoginClick = () => { setIsMenuOpen(false); onLoginClick?.(); };
    const handleSignupClick = () => { setIsMenuOpen(false); onSignupClick?.(); };
    const handleLogoutClick = () => {
        setIsUserMenuOpen(false);
        setIsMenuOpen(false);
        onLogout?.();
    };
    const toggleMenu = () => setIsMenuOpen((v) => !v);

    const initials = user?.name
        ? user.name.trim().split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase()
        : '';

    const renderCategoryLinks = () =>
        CATEGORIES.map((c) => (
            <a
                key={c.id}
                href={c.link}
                className="cat-link"
                onClick={(e) => { e.preventDefault(); handleCategoryClick(c.id); }}
            >
                {c.name}
            </a>
        ));

    const renderSearch = () => (
        <div className="search-container">
            <span className="search-icon" aria-hidden="true"><SearchIcon size={16} /></span>
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
                <FilterIcon size={18} />
            </button>
            <button className="icon-btn" title="Sort" onClick={onSortClick} aria-label="Sort content">
                <SortIcon size={18} />
            </button>
            <button className="icon-btn" title="Bookmarks" onClick={onBookmarksClick} aria-label="Bookmarks">
                <BookmarkIcon size={18} />
            </button>
        </div>
    );

    const renderAuthArea = () => {
        if (!user) {
            return (
                <div className="btn-group">
                    <button className="btn btn-ghost" onClick={handleLoginClick}>Login</button>
                    <button className="btn btn-primary" onClick={handleSignupClick}>Sign Up</button>
                </div>
            );
        }

        return (
            <div className="user-menu" ref={userMenuRef}>
                <button
                    type="button"
                    className="user-trigger"
                    onClick={() => setIsUserMenuOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={isUserMenuOpen}
                >
                    <span className="user-avatar" aria-hidden="true">{initials}</span>
                    <span className="user-name">{user.name}</span>
                    <span className={`user-caret${isUserMenuOpen ? ' open' : ''}`} aria-hidden="true">
                        <ChevronDownIcon size={14} />
                    </span>
                </button>

                {isUserMenuOpen && (
                    <div className="user-dropdown" role="menu">
                        <div className="user-dropdown-header">
                            <span className="user-avatar large" aria-hidden="true">{initials}</span>
                            <div className="user-dropdown-meta">
                                <span className="user-dropdown-name">{user.name}</span>
                                <span className="user-dropdown-email">{user.email}</span>
                            </div>
                        </div>
                        <div className="user-dropdown-sep" />
                        <button
                            className="user-dropdown-item danger"
                            onClick={handleLogoutClick}
                            role="menuitem"
                        >
                            <span className="user-dropdown-icon"><LogOutIcon size={16} /></span>
                            Log out
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="navbar-wrapper">
            <div className="util-bar">
                <div className="util-left">
                    <div className="util-item">
                        <span className="dot" aria-hidden="true" />
                        {visitorCount.toLocaleString()} online
                    </div>
                    <div className="util-item">{formatTime(currentTime)}</div>
                </div>
                <div className="util-right">
                    <a href="#about" onClick={(e) => e.preventDefault()}>About Us</a>
                    <span className="util-sep">|</span>
                    <a href="#contact" onClick={(e) => e.preventDefault()}>Contact</a>
                </div>
            </div>

            <nav className={`navbar${isMenuOpen ? ' menu-open' : ''}`}>
                <div className="logo-section">
                    <div className="logo-icon">Fv</div>
                    <span className="logo-brand">FandomVerse</span>
                </div>

                <div className="nav-center">
                    <div className="categories">{renderCategoryLinks()}</div>
                </div>

                <div className="navbar-right">
                    {renderSearch()}
                    {renderIconButtons()}
                    {renderAuthArea()}
                </div>

                <button
                    className="hamburger"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
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
                        {renderAuthArea()}
                    </div>
                </div>
            </div>

            {breadcrumbs.length > 0 && (
                <div className="navbar-breadcrumb">
                    <ul className="breadcrumb-list">
                        <li className="breadcrumb-item">
                            <a href="/" className="crumb">Home</a>
                        </li>
                        {breadcrumbs.map((crumb, i) => (
                            <React.Fragment key={i}>
                                <li className="breadcrumb-separator" aria-hidden="true">›</li>
                                <li className={`breadcrumb-item${crumb.active ? ' active' : ''}`}>
                                    {crumb.active
                                        ? <span className="crumb active">{crumb.label}</span>
                                        : <a href={crumb.href} className="crumb">{crumb.label}</a>}
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