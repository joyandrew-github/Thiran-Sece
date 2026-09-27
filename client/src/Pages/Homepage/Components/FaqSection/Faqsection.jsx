import { useMemo, useState } from 'react';
import { FAQ_DATA } from '../../../../constants/faqData';
import './Faqsection.css';

export { FAQ_DATA };

const CATEGORIES = ['All', ...Array.from(new Set(FAQ_DATA.map((f) => f.category)))];

function FAQItem({ item, index, isOpen, onToggle }) {
    return (
        <div className={`faq-item${isOpen ? ' is-open' : ''}`}>
            <button
                type="button"
                className="faq-item__trigger"
                aria-expanded={isOpen}
                onClick={onToggle}>
                <span className="faq-item__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="faq-item__question">{item.q}</span>
                <span
                    className="faq-item__icon"
                    aria-hidden="true">
                    <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            <div className="faq-item__answer">
                <div>
                    <p>{item.a}</p>
                </div>
            </div>
        </div>
    );
}

export default function FAQSection({ faqs = FAQ_DATA }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [query, setQuery] = useState('');
    const [openIds, setOpenIds] = useState(() => new Set());

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        return faqs
            .map((item, i) => ({ ...item, _id: i }))
            .filter((item) => {
                const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
                const matchesQuery = q.length === 0 || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
                return matchesCategory && matchesQuery;
            });
    }, [faqs, activeCategory, query]);

    const toggle = (id) => {
        setOpenIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <section className="faq-section">
            <div className="container faq-section__inner">
                <div className="faq-header">
                    <span className="eyebrow">Need to know</span>
                    <h2>
                        Frequently Asked <span>Questions</span>
                    </h2>
                    <p>Everything about registering, competing, and getting around campus during Thiran 2026.</p>
                </div>

                <div className="faq-controls">
                    <div className="faq-search">
                        <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            aria-hidden="true">
                            <circle
                                cx="11"
                                cy="11"
                                r="7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <line
                                x1="21"
                                y1="21"
                                x2="16.65"
                                y2="16.65"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search a question…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="Search FAQs"
                        />
                    </div>

                    <div
                        className="faq-tabs"
                        role="tablist">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                role="tab"
                                aria-selected={activeCategory === cat}
                                className={`faq-tab${activeCategory === cat ? ' is-active' : ''}`}
                                onClick={() => setActiveCategory(cat)}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="faq-list">
                    {filtered.length === 0 && <p className="faq-empty">No questions match "{query}". Try a different search or category.</p>}

                    {filtered.map((item) => (
                        <FAQItem
                            key={item._id}
                            item={item}
                            index={item._id}
                            isOpen={openIds.has(item._id)}
                            onToggle={() => toggle(item._id)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
