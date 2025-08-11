import React, { useState, useEffect } from 'react';

function SpeakingEvents() {
    const [selectedEngagement, setSelectedEngagement] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showLinkedInModal, setShowLinkedInModal] = useState(false);
    const [password, setPassword] = useState('');
    const [keysPressed, setKeysPressed] = useState(new Set());
    const [secretSequence, setSecretSequence] = useState('');

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

    // Secret modal functions
    const openPasswordModal = () => {
        setShowPasswordModal(true);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setPassword('');
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === 'Jay Scott') {
            setShowPasswordModal(false);
            setShowLinkedInModal(true);
            setPassword('');
        } else {
            alert('Incorrect password');
            setPassword('');
        }
    };

    const closeLinkedInModal = () => {
        setShowLinkedInModal(false);
    };

    // Key combination detection
    useEffect(() => {
        const handleKeyDown = (e) => {
            // If Shift + J is pressed, start the sequence
            if (e.shiftKey && e.key.toLowerCase() === 'j') {
                setSecretSequence('j');
                return;
            }
            
            // If we have started the sequence, continue building it
            if (secretSequence.length > 0) {
                const newSequence = secretSequence + e.key.toLowerCase();
                setSecretSequence(newSequence);
                
                // Check if we've completed "joshua"
                if (newSequence === 'joshua') {
                    openPasswordModal();
                    setSecretSequence(''); // Reset sequence
                }
                
                // If sequence is getting too long or doesn't match, reset
                if (newSequence.length > 6 || !'joshua'.startsWith(newSequence)) {
                    setSecretSequence('');
                }
            }
        };

        const handleKeyUp = (e) => {
            // Reset sequence if shift is released or if too much time passes
            if (e.key === 'Shift') {
                setTimeout(() => {
                    setSecretSequence('');
                }, 2000); // Reset after 2 seconds of inactivity
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [secretSequence]);
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

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={closePasswordModal}>
                    <div className="modal-content secret-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Secret Access</h3>
                            <button className="modal-close" onClick={closePasswordModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handlePasswordSubmit}>
                                <p>Enter the secret password:</p>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="password-input"
                                    autoFocus
                                />
                                <button type="submit" className="password-submit">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* LinkedIn Modal */}
            {showLinkedInModal && (
                <div className="modal-overlay" onClick={closeLinkedInModal}>
                    <div className="modal-content secret-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🎉 Access Granted!</h3>
                            <button className="modal-close" onClick={closeLinkedInModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Welcome! Here's my private LinkedIn profile:</p>
                            <div className="linkedin-section">
                                <a
                                    href="https://www.linkedin.com/in/jayscott89/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="linkedin-button"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    Connect on LinkedIn
                                </a>
                            </div>
                            <p className="secret-note">
                                <small>🤫 You found the secret! This was triggered by typing Shift + J + oshua.</small>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default SpeakingEvents;
