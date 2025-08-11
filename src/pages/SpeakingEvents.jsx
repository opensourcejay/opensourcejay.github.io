import React, { useState } from 'react';

function SpeakingEvents() {
    const [selectedEngagement, setSelectedEngagement] = useState(null);

    const engagements = {
        'black-in-tech': {
            title: 'Black is Tech',
            speech: 'Developing CAMEO: An In-Browser AI Media Studio with React and JavaScript',
            date: '2025',
            description: 'CAMEO (Creative AI Media Engine Orchestrator) is a browser-based app that turns text prompts into stunning images and videos using Azure’s GPT-Image-1, DALL·E-3, and SORA models. Built with JavaScript and React, it’s fully local, privacy-first, and requires zero backend. In this talk, I’ll show how I built it, how you can run it, and what’s possible when AI and creativity meet in code.',
            audience: 'Tech professionals, students, and entrepreneurs',
            website: 'https://blackistechconference.com/'
        }
    };

    const openModal = (engagementId, e) => {
        e.preventDefault();
        setSelectedEngagement(engagements[engagementId]);
    };

    const closeModal = () => {
        setSelectedEngagement(null);
    };
    return (
        <section className="section-speaking">
            <div className="container">
                <h1>Speaking Events</h1>
                <div className="speaking-content">
                    <p className="speaking-description">
                        I am available for public speaking engagements on AI and Cloud technology,
                        sharing expertise to inspire and educate audiences on leveraging these tools
                        to grow careers and businesses. Whether at conferences, seminars, or corporate
                        events, I deliver engaging, tailored presentations that meet your audience's needs.
                    </p>

                    <div className="speaking-topics">
                        <h2>Speaking Topics</h2>
                        <div className="topics-grid">
                            <div className="topic-card">
                                <h3>AI & Machine Learning</h3>
                                <p>Practical applications of AI in business, ethical considerations, and future trends in artificial intelligence.</p>
                            </div>
                            <div className="topic-card">
                                <h3>Cloud Technology</h3>
                                <p>Azure development, cloud migration strategies, and best practices for scalable cloud architectures.</p>
                            </div>
                            <div className="topic-card">
                                <h3>Career Development</h3>
                                <p>Building a career in tech, open source contributions, and leveraging technology for professional growth.</p>
                            </div>
                            <div className="topic-card">
                                <h3>Innovation & Entrepreneurship</h3>
                                <p>Using technology to drive business innovation and creating pathways for future innovators.</p>
                            </div>
                        </div>
                    </div>

                    <div className="past-engagements">
                        <h2>Past Speaking Engagements</h2>
                        <div className="engagements-timeline">
                            <div className="engagement-year">
                                <h3>2025</h3>
                                <div className="engagement-list">
                                    <div className="engagement-item">
                                        <button
                                            onClick={(e) => openModal('black-in-tech', e)}
                                            className="engagement-button"
                                        >
                                            <h4>Black in Tech</h4>
                                            <span className="engagement-subtitle">Click to see what I spoke about</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-section">
                        <h2>Book a Speaking Engagement</h2>
                        <p>
                            Interested in having me speak at your event? I'd love to hear from you and
                            discuss how we can create an engaging and valuable experience for your audience.
                        </p>
                        <div className="contact-info">
                            <a href="mailto:jcode116@gmail.com" className="contact-button">
                                Get in Touch
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedEngagement && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedEngagement.title}</h3>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <h4 className="engagement-description">{selectedEngagement.speech}</h4>
                            <p className="engagement-description">{selectedEngagement.description}</p>

                            <div className="engagement-details">
                                <p><strong>Audience:</strong> {selectedEngagement.audience}</p>
                                <p><strong>Year:</strong> {selectedEngagement.date}</p>
                            </div>

                            <div className="modal-footer">
                                <a
                                    href={selectedEngagement.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="website-link"
                                >
                                    Visit Conference Website
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default SpeakingEvents;
