import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_FORM = {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSeLlTdEBSMlQKPwBO3jPwgRhOLHjQuXK9Hr7QqONL2RkQJkxQ/formResponse',
    fields: {
        name: 'entry.1899369965',
        email: 'entry.890512391',
        message: 'entry.1277408418',
    },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactModal({ isOpen, onClose }) {
    const dialogRef = useRef(null);
    const formRef = useRef(null);
    const nameInputRef = useRef(null);
    const submissionPendingRef = useRef(false);
    const submissionTimeoutRef = useRef(null);
    const [submissionStatus, setSubmissionStatus] = useState('idle');
    const [validationErrors, setValidationErrors] = useState({});

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
        setValidationErrors({});
        onClose();
    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        const nameInput = form.elements[GOOGLE_FORM.fields.name];
        const emailInput = form.elements[GOOGLE_FORM.fields.email];
        const messageInput = form.elements[GOOGLE_FORM.fields.message];
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        const errors = {};

        if (name.length < 2) {
            errors.name = 'Enter your name using at least 2 characters.';
        } else if (name.length > 80) {
            errors.name = 'Keep your name under 80 characters.';
        }

        if (!email) {
            errors.email = 'Enter your email address.';
        } else if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
            errors.email = 'Enter a valid email address.';
        }

        if (message.length < 10) {
            errors.message = 'Enter a message using at least 10 characters.';
        } else if (message.length > 2000) {
            errors.message = 'Keep your message under 2,000 characters.';
        }

        if (Object.keys(errors).length > 0) {
            event.preventDefault();
            setSubmissionStatus('idle');
            setValidationErrors(errors);
            const firstInvalidField = ['name', 'email', 'message'].find((field) => errors[field]);
            requestAnimationFrame(() => form.querySelector(`[data-field="${firstInvalidField}"]`)?.focus());
            return;
        }

        nameInput.value = name;
        emailInput.value = email;
        messageInput.value = message;
        setValidationErrors({});
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
        setValidationErrors({});
        setSubmissionStatus('submitted');
    };

    const clearFieldError = (event) => {
        const field = event.currentTarget.dataset.field;
        if (!validationErrors[field]) return;
        setValidationErrors((currentErrors) => {
            const nextErrors = { ...currentErrors };
            delete nextErrors[field];
            return nextErrors;
        });
    };

    const handleBackdropClick = (event) => {
        if (event.target === dialogRef.current) handleClose();
    };

    const handleDialogCancel = (event) => {
        event.preventDefault();
        handleClose();
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
                            noValidate
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
                                    minLength="2"
                                    maxLength="80"
                                    data-field="name"
                                    aria-invalid={Boolean(validationErrors.name)}
                                    aria-describedby={validationErrors.name ? 'contact-name-error' : undefined}
                                    onInput={clearFieldError}
                                    required
                                />
                                {validationErrors.name && (
                                    <p id="contact-name-error" className="contact-field-error" role="alert">
                                        {validationErrors.name}
                                    </p>
                                )}
                            </div>

                            <div className="contact-form-field">
                                <label htmlFor="contact-email">Email</label>
                                <input
                                    id="contact-email"
                                    name={GOOGLE_FORM.fields.email}
                                    type="email"
                                    autoComplete="email"
                                    maxLength="254"
                                    data-field="email"
                                    aria-invalid={Boolean(validationErrors.email)}
                                    aria-describedby={validationErrors.email ? 'contact-email-error' : undefined}
                                    onInput={clearFieldError}
                                    required
                                />
                                {validationErrors.email && (
                                    <p id="contact-email-error" className="contact-field-error" role="alert">
                                        {validationErrors.email}
                                    </p>
                                )}
                            </div>

                            <div className="contact-form-field">
                                <label htmlFor="contact-message">Message</label>
                                <textarea
                                    id="contact-message"
                                    name={GOOGLE_FORM.fields.message}
                                    rows="5"
                                    minLength="10"
                                    maxLength="2000"
                                    data-field="message"
                                    aria-invalid={Boolean(validationErrors.message)}
                                    aria-describedby={validationErrors.message ? 'contact-message-error' : undefined}
                                    onInput={clearFieldError}
                                    required
                                />
                                {validationErrors.message && (
                                    <p id="contact-message-error" className="contact-field-error" role="alert">
                                        {validationErrors.message}
                                    </p>
                                )}
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