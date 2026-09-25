import React from 'react';
import './Footer.css';

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

const XIcon = (p) => (
    <Svg {...p}>
        <path d="M4 4l7 8-7 8" /><path d="M20 4l-7 8 7 8" />
    </Svg>
);
const DiscordIcon = (p) => (
    <Svg {...p}>
        <path d="M8.5 8.5c-.5 1.5-1 3.5-1 6.5 1 .5 2 .8 3 .8h3c1 0 2-.3 3-.8 0-3-.5-5-1-6.5" />
        <path d="M10.5 12h3" />
    </Svg>
);
const YouTubeIcon = (p) => (
    <Svg {...p}>
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
    </Svg>
);
const RedditIcon = (p) => (
    <Svg {...p}>
        <circle cx="12" cy="14" r="6" />
        <circle cx="9" cy="13.5" r=".8" fill="currentColor" stroke="none" />
        <circle cx="15" cy="13.5" r=".8" fill="currentColor" stroke="none" />
        <path d="M9.5 16.5c1.5 1 3.5 1 5 0" />
        <circle cx="19" cy="8" r="1.5" />
        <path d="m17.5 9.5-4-1" />
        <path d="m13.5 8.5.5-4" />
    </Svg>
);
const InstagramIcon = (p) => (
    <Svg {...p}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </Svg>
);
const TwitchIcon = (p) => (
    <Svg {...p}>
        <path d="M4 4h16v10l-4 4h-4l-3 3v-3H4Z" />
        <path d="M11 8v4M15 8v4" />
    </Svg>
);
const MailIcon = (p) => (
    <Svg {...p}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
    </Svg>
);
const HeartIcon = (p) => (
    <Svg {...p}>
        <path
            d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 6a4.5 4.5 0 0 0-10 2.5C2 10.7 3.5 12.5 5 14l7 7Z"
            fill="currentColor" stroke="none"
        />
    </Svg>
);

const LINK_GROUPS = [
    {
        title: 'Explore',
        links: [
            { label: 'Anime', href: '/anime' },
            { label: 'Manga', href: '/manga' },
            { label: 'Games', href: '/games' },
            { label: 'Movies', href: '/movies' },
            { label: 'TV Shows', href: '/tvshows' },
            { label: 'K-pop', href: '/kpop' },
            { label: 'Comics', href: '/comics' },
        ],
    },
    {
        title: 'Community',
        links: [
            { label: 'Discord Server', href: '#discord' },
            { label: 'Forums', href: '#forums' },
            { label: 'Events', href: '#events' },
            { label: 'Fan Art', href: '#fanart' },
            { label: 'Cosplay', href: '#cosplay' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About Us', href: '#about' },
            { label: 'Careers', href: '#careers' },
            { label: 'Press Kit', href: '#press' },
            { label: 'Blog', href: '#blog' },
            { label: 'Contact', href: '#contact' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Terms of Service', href: '#terms' },
            { label: 'Privacy Policy', href: '#privacy' },
            { label: 'Cookie Policy', href: '#cookies' },
            { label: 'DMCA', href: '#dmca' },
            { label: 'Community Guidelines', href: '#guidelines' },
        ],
    },
];

const SOCIALS = [
    { label: 'X (Twitter)', href: '#x',         Icon: XIcon },
    { label: 'Discord',     href: '#discord',   Icon: DiscordIcon },
    { label: 'YouTube',     href: '#youtube',   Icon: YouTubeIcon },
    { label: 'Reddit',      href: '#reddit',    Icon: RedditIcon },
    { label: 'Instagram',   href: '#instagram', Icon: InstagramIcon },
    { label: 'Twitch',      href: '#twitch',    Icon: TwitchIcon },
];

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-accent" aria-hidden="true" />

            <div className="footer-inner">
                <div className="footer-brand">
                    <a href="/" className="footer-logo" aria-label="FandomVerse home">
                        <div className="footer-logo-mark"><span>Fv</span></div>
                        <div className="footer-logo-word">
                            <span>Fandom</span><span className="accent">Verse</span>
                        </div>
                    </a>

                    <p className="footer-tagline">
                        Your universe of fandoms — anime, manga, games, movies,
                        TV shows, K-pop, and comics. All in one place.
                    </p>

                    <a href="mailto:hello@fandomverse.app" className="footer-contact">
                        <MailIcon size={16} />
                        <span>hello@fandomverse.app</span>
                    </a>

                    <div className="footer-socials">
                        {SOCIALS.map((s) => {
                            const SIcon = s.Icon;
                            return (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    className="social-btn"
                                    aria-label={s.label}
                                    title={s.label}
                                >
                                    <SIcon size={18} />
                                </a>
                            );
                        })}
                    </div>
                </div>

                <div className="footer-links">
                    {LINK_GROUPS.map((group) => (
                        <div key={group.title} className="footer-col">
                            <h4 className="footer-col-title">{group.title}</h4>
                            <ul className="footer-col-list">
                                {group.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="footer-link"
                                            onClick={(e) => {
                                                if (link.href.startsWith('#')) e.preventDefault();
                                            }}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-inner">
                    <span className="footer-copy">
                        © {year} FandomVerse. All rights reserved.
                    </span>
                    <span className="footer-made">
                        Made with <HeartIcon size={12} className="heart" /> by fans, for fans.
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;