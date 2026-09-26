import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBookmarks } from '../../hooks/useFilters';
import { articles } from '../../data/articles.json';
import { characters } from '../../data/characters.json';
import { events } from '../../data/events.json';
import { polls } from '../../data/polls.json';
import { videos } from '../../data/videos.json';
import './Navbar.css';

const CATEGORIES = [
  { id: "anime", name: "Anime", link: "/category/anime" },
  { id: "manga", name: "Manga", link: "/category/manga" },
  { id: "gaming", name: "Games", link: "/category/gaming" },
  { id: "movies", name: "Movies", link: "/category/movies" },
  { id: "tvshows", name: "TV Shows", link: "/category/tvshows" },
  { id: "kpop", name: "K-pop", link: "/category/kpop" },
  { id: "comics", name: "Comics", link: "/category/comics" },
];

const EXTRA_LINKS = [
  { name: "Categories", link: "/categories" },
  { name: "Store", link: "/store" },
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
const ChatIcon = (p) => (
    <Svg {...p}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
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
    const navigate = useNavigate();
    const { bookmarks, has: hasBookmark } = useBookmarks();
    
    // Total bookmark count for the bookmark icon
    const totalBookmarks = useMemo(() => {
        return bookmarks.size;
    }, [bookmarks]);
    
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
            // Don't close if clicking on the dropdown menu or its children
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
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
        const category = CATEGORIES.find(c => c.id === id);
        if (category) {
            navigate(category.link);
        }
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

    const renderCategoryLinks = () => (
        <>
            {CATEGORIES.map((c) => (
                <a
                    key={c.id}
                    href={c.link}
                    className="cat-link"
                    onClick={(e) => { e.preventDefault(); handleCategoryClick(c.id); }}
                >
                    {c.name}
                </a>
            ))}
            {EXTRA_LINKS.map((l) => (
                <Link key={l.name} to={l.link} className="cat-link">
                    {l.name}
                </Link>
            ))}
        </>
    );



    const renderIconButtons = () => (
        <div className="icon-group">
            <button className="icon-btn" title="Bookmarks" onClick={() => navigate('/bookmarks')} aria-label="Bookmarks">
                <BookmarkIcon size={18} />
                {totalBookmarks > 0 && <span className="bookmark-count">{totalBookmarks}</span>}
            </button>
            <button className="icon-btn" title="Chatbot" onClick={onChatbotClick} aria-label="Open chatbot">
                <ChatIcon size={18} />
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
                    <Link to="/about" className="util-link">About Us</Link>
                    <span className="util-sep">|</span>
                    <Link to="/contact" className="util-link">Contact</Link>
                </div>
            </div>

            <nav className={`navbar${isMenuOpen ? ' menu-open' : ''}`}>
                <Link to="/" className="logo-section" aria-label="FandomVerse Home">
                    <div className="logo-icon">Fv</div>
                    <span className="logo-brand">FandomVerse</span>
                </Link>

                <div className="nav-center">
                    <div className="categories">{renderCategoryLinks()}</div>
                </div>

                <div className="navbar-right">
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