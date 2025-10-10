import React, { useState } from 'react';

const CalculatorForm = () => {
  const [formData, setFormData] = useState({
    income: '',
    age: '',
    familySize: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple calculation example: Eligibility score (customize as needed)
    const score = (parseFloat(formData.income) || 0) / (parseInt(formData.familySize) || 1) * (parseInt(formData.age) || 0);
    setResult(`Eligibility Score: ${score.toFixed(2)} (Higher score means better fit for schemes)`);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Scheme Eligibility Calculator</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="income">Annual Income ($):</label>
        <input
          type="number"
          id="income"
          name="income"
          value={formData.income}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="familySize">Family Size:</label>
        <input
          type="number"
          id="familySize"
          name="familySize"
          value={formData.familySize}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          padding: '0.75rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Calculate
      </button>

      {result && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {result}
        </div>
      )}
    </form>
  );
};

export default CalculatorForm;
