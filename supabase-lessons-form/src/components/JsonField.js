import React, { useState, useEffect } from 'react';

const JsonField = ({ label, name, value, onChange, placeholder }) => {
  const [isValid, setIsValid] = useState(true);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const validateJson = (jsonString) => {
    if (!jsonString.trim()) {
      setIsValid(true);
      return true;
    }
    try {
      JSON.parse(jsonString);
      setIsValid(true);
      return true;
    } catch (e) {
      setIsValid(false);
      return false;
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    const valid = validateJson(newValue);
    onChange(name, newValue, valid);
  };

  return (
    <div className="json-field">
      <div className="json-header">
        <label htmlFor={name}>{label}</label>
        <span className={`json-status ${isValid ? 'valid' : 'invalid'}`}>
          {localValue.trim() === '' ? 'Empty (Valid)' : isValid ? 'Valid JSON' : 'Invalid JSON'}
        </span>
      </div>
      <textarea
        id={name}
        name={name}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        rows="8"
        spellCheck="false"
      />
    </div>
  );
};

export default JsonField;