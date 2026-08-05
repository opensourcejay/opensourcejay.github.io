import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_FORM = {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSeLlTdEBSMlQKPwBO3jPwgRhOLHjQuXK9Hr7QqONL2RkQJkxQ/formResponse',
    fields: {
        name: 'entry.1899369965',
        email: 'entry.890512391',
        message: 'entry.1277408418',
    },
};

function ContactModal({ isOpen, onClose }) {
    const dialogRef = useRef(null);
    const formRef = useRef(null);
    const nameInputRef = useRef(null);
    const submissionPendingRef = useRef(false);
    const submissionTimeoutRef = useRef(null);
    const [submissionStatus, setSubmissionStatus] = useState('idle');

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
            requestAnimationFrame(() => nameInputRef.current?.focus());
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    useEffect(() => () => clearTimeout(submissionTimeoutRef.current), []);

    const handleClose = () => {
        clearTimeout(submissionTimeoutRef.current);
        submissionPendingRef.current = false;
        setSubmissionStatus('idle');
        onClose();
    };

    const handleSubmit = () => {
        clearTimeout(submissionTimeoutRef.current);
        submissionPendingRef.current = true;
        setSubmissionStatus('submitting');
        submissionTimeoutRef.current = setTimeout(() => {
            submissionPendingRef.current = false;
            setSubmissionStatus('error');
        }, 10000);
    };

    const handleFrameLoad = () => {
        if (!submissionPendingRef.current) return;

        clearTimeout(submissionTimeoutRef.current);
        submissionPendingRef.current = false;
        formRef.current?.reset();
        setSubmissionStatus('submitted');
    };

    const handleBackdropClick = (event) => {
        if (event.target === dialogRef.current) handleClose();
    };

    const handleDialogCancel = (event) => {
        event.preventDefault();
        handleClose();
    };

    const sendAnotherMessage = () => {
        setSubmissionStatus('idle');
        requestAnimationFrame(() => formRef.current?.elements[GOOGLE_FORM.fields.name]?.focus());
    };

    return (
        <>
            <dialog
                ref={dialogRef}
                className="contact-dialog"
                aria-labelledby="contact-dialog-title"
                onCancel={handleDialogCancel}
                onClick={handleBackdropClick}
            >
                <div className="contact-dialog-content">
                    <header className="contact-dialog-header">
                        <div>
                            <p className="contact-dialog-kicker">Get in touch</p>
                            <h2 id="contact-dialog-title">Contact me</h2>
                        </div>
                        <button
                            type="button"
                            className="contact-dialog-close"
                            onClick={handleClose}
                            aria-label="Close contact form"
                        >
                            &times;
                        </button>
                    </header>

                    {submissionStatus === 'submitted' ? (
                        <div className="contact-form-success" role="status">
                            <span className="contact-success-mark" aria-hidden="true">✓</span>
                            <h3>Message submitted</h3>
                            <p>Thanks for reaching out. Your response has been sent.</p>
                            <div className="contact-success-actions">
                                <button type="button" className="contact-secondary-button" onClick={sendAnotherMessage}>
                                    Send another
                                </button>
                                <button type="button" className="contact-submit-button" onClick={handleClose}>
                                    Done
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form
                            ref={formRef}
                            className="contact-form"
                            action={GOOGLE_FORM.action}
                            method="POST"
                            target="contact-form-response"
                            onSubmit={handleSubmit}
                        >
                            <p className="contact-form-intro">Send a note and I’ll get back to you as soon as I can.</p>

                            <div className="contact-form-field">
                                <label htmlFor="contact-name">Name</label>
                                <input
                                    ref={nameInputRef}
                                    id="contact-name"
                                    name={GOOGLE_FORM.fields.name}
                                    type="text"
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="contact-form-field">
                                <label htmlFor="contact-email">Email</label>
                                <input
                                    id="contact-email"
                                    name={GOOGLE_FORM.fields.email}
                                    type="email"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div className="contact-form-field">
                                <label htmlFor="contact-message">Message</label>
                                <textarea
                                    id="contact-message"
                                    name={GOOGLE_FORM.fields.message}
                                    rows="5"
                                    required
                                />
                            </div>

                            <div className="contact-form-footer">
                                <button
                                    type="submit"
                                    className="contact-submit-button"
                                    disabled={submissionStatus === 'submitting'}
                                >
                                    {submissionStatus === 'submitting' ? 'Sending…' : submissionStatus === 'error' ? 'Try again' : 'Send message'}
                                </button>
                            </div>

                            <p
                                className={`contact-form-status ${submissionStatus === 'error' ? 'is-error' : ''}`}
                                aria-live="polite"
                            >
                                {submissionStatus === 'submitting' && 'Submitting your message.'}
                                {submissionStatus === 'error' && 'The response could not be confirmed. Please try again.'}
                            </p>
                        </form>
                    )}
                </div>
            </dialog>

            <iframe
                className="contact-response-frame"
                name="contact-form-response"
                title="Contact form submission response"
                onLoad={handleFrameLoad}
            />
        </>
    );
}

export default ContactModal;