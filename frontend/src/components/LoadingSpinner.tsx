import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [displayMessage, setDisplayMessage] = useState(message);

  const steps = [
    { title: 'Establishing connection', duration: 5000 },
    { title: 'Authenticating request', duration: 8000 },
    { title: 'Fetching data', duration: 15000 },
    { title: 'Processing results', duration: 20000 },
  ];

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 1;
      });
    }, 300);

    // Step progression
    const stepTimers = steps.map((step, index) => 
      setTimeout(() => {
        setCurrentStep(index);
        setDisplayMessage(step.title);
      }, step.duration)
    );

    // Patient message after 10 seconds
    const messageTimer = setTimeout(() => {
      setDisplayMessage('Almost there! The backend is warming up...');
    }, 10000);

    return () => {
      clearInterval(progressInterval);
      stepTimers.forEach(timer => clearTimeout(timer));
      clearTimeout(messageTimer);
    };
  }, []);

  return (
    <div 
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '70vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px 15px'
      }}
    >
      <div className="card shadow-lg" style={{ maxWidth: '600px', width: '100%', borderRadius: '16px', border: 'none' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            {/* Animated Spinner */}
            <div 
              className="spinner-border mb-3" 
              role="status"
              style={{
                width: '4rem',
                height: '4rem',
                color: '#667eea',
                borderWidth: '0.3rem'
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>

            {/* Title */}
            <h3 className="fw-bold mb-0" style={{ color: '#667eea' }}>
              <i className="bi bi-database me-2"></i>
              Loading Your Data
            </h3>
          </div>

          {/* Current Message */}
          <div className="alert alert-info d-flex align-items-center" role="alert">
            <i className="bi bi-info-circle-fill me-2"></i>
            <div>{displayMessage}</div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
            <div className="text-center mt-2">
              <small className="text-muted">
                {progress < 95 ? 'Loading...' : 'Finalizing...'}
              </small>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="mb-3">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="d-flex align-items-center mb-2"
                style={{
                  opacity: index <= currentStep ? 1 : 0.5
                }}
              >
                {index < currentStep ? (
                  <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '1rem' }}></i>
                ) : index === currentStep ? (
                  <div 
                    className="spinner-border spinner-border-sm me-2" 
                    role="status"
                    style={{ 
                      width: '1rem', 
                      height: '1rem',
                      color: '#667eea'
                    }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <i className="bi bi-circle me-2 text-secondary" style={{ fontSize: '1rem' }}></i>
                )}
                <span 
                  className={index === currentStep ? 'fw-bold' : ''}
                  style={{ 
                    color: index <= currentStep ? '#000' : '#999',
                    fontSize: '0.9rem'
                  }}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Information Card */}
          <div 
            className="p-3 rounded"
            style={{ background: '#f6f8fb' }}
          >
            <p className="mb-1 fw-semibold" style={{ color: '#667eea', fontSize: '0.9rem' }}>
              <i className="bi bi-lightbulb me-2"></i>
              Did you know?
            </p>
            <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
              Our backend is hosted on a free-tier cloud service. 
              It may take <strong>30-50 seconds</strong> to wake up from sleep mode. 
              Thank you for your patience! ☕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
