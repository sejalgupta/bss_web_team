import React, { useState, useEffect } from 'react';
import { JsonValidation } from '../types';

interface JsonFieldProps {
  label: string;
  name: keyof JsonValidation;
  value: string;
  onChange: (fieldName: keyof JsonValidation, value: string, isValid: boolean) => void;
  placeholder: string;
}

const JsonField: React.FC<JsonFieldProps> = ({ label, name, value, onChange, placeholder }) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [localValue, setLocalValue] = useState<string>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const validateJson = (jsonString: string): boolean => {
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        rows={8}
        spellCheck={false}
      />
    </div>
  );
};

export default JsonField;