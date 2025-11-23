import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import JsonField from './components/JsonField';
import StatusMessage from './components/StatusMessage';
import { FormData, JsonValidation, Status, Lesson } from './types';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    id: '',
    title: '',
    curriculum_group_id: '',
    subject: '',
    target_audience: '',
    level: '',
    learning_objectives: '',
    materials: '',
    teaching_activities: '',
    application: '',
    assessment: '',
    refs: '',
    uploaded_by: ''
  });

  const [jsonValidation, setJsonValidation] = useState<JsonValidation>({
    learning_objectives: true,
    materials: true,
    teaching_activities: true
  });

  const [status, setStatus] = useState<Status>({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJsonChange = (fieldName: keyof JsonValidation, value: string, isValid: boolean) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    setJsonValidation(prev => ({
      ...prev,
      [fieldName]: isValid
    }));
  };

  const generateUuid = () => {
    const newId = uuidv4();
    setFormData(prev => ({
      ...prev,
      id: newId
    }));
  };

  const handleIdFocus = () => {
    if (!formData.id.trim()) {
      generateUuid();
    }
  };

  const validateJson = (jsonString: string): { valid: boolean; parsed: any } => {
    if (!jsonString.trim()) return { valid: true, parsed: null };
    try {
      const parsed = JSON.parse(jsonString);
      return { valid: true, parsed };
    } catch (e) {
      return { valid: false, parsed: null };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!supabase) {
      setStatus({
        type: 'error',
        message: 'Supabase configuration is missing. Please check your environment variables.'
      });
      return;
    }

    // Validate required fields
    if (!formData.id || !formData.title) {
      setStatus({
        type: 'error',
        message: 'Please fill in all required fields (ID and Title).'
      });
      return;
    }

    // Validate all JSON fields
    const allJsonValid = Object.values(jsonValidation).every(v => v);
    if (!allJsonValid) {
      setStatus({
        type: 'error',
        message: 'Please fix invalid JSON fields before submitting.'
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Prepare data for submission
      const submitData: Partial<Lesson> = {
        id: formData.id,
        title: formData.title
      };

      // Add optional fields (convert empty strings to undefined)
      const optionalFields: Array<keyof FormData> = [
        'curriculum_group_id', 'subject', 'target_audience',
        'level', 'application', 'assessment', 'refs', 'uploaded_by'
      ];

      optionalFields.forEach(field => {
        const value = formData[field];
        if (value?.trim()) {
          (submitData as any)[field] = value;
        }
      });

      // Parse and add JSON fields
      const jsonFields: Array<keyof JsonValidation> = ['learning_objectives', 'materials', 'teaching_activities'];
      jsonFields.forEach(field => {
        const value = formData[field];
        if (value?.trim()) {
          const { parsed } = validateJson(value);
          if (parsed !== null) {
            (submitData as any)[field] = parsed;
          }
        }
      });

      // Insert data into Supabase
      const { data, error } = await supabase
        .from('lessons')
        .insert([submitData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        setStatus({
          type: 'error',
          message: `Error: ${error.message}`
        });
      } else {
        setStatus({
          type: 'success',
          message: 'Lesson added successfully!'
        });

        // Clear form
        setFormData({
          id: '',
          title: '',
          curriculum_group_id: '',
          subject: '',
          target_audience: '',
          level: '',
          learning_objectives: '',
          materials: '',
          teaching_activities: '',
          application: '',
          assessment: '',
          refs: '',
          uploaded_by: ''
        });

        console.log('Successfully inserted:', data);
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      id: '',
      title: '',
      curriculum_group_id: '',
      subject: '',
      target_audience: '',
      level: '',
      learning_objectives: '',
      materials: '',
      teaching_activities: '',
      application: '',
      assessment: '',
      refs: '',
      uploaded_by: ''
    });
    setStatus({ type: '', message: '' });
  };

  if (!supabase) {
    return (
      <div className="app">
        <div className="container">
          <div className="card">
            <h1>Supabase Configuration Missing</h1>
            <div className="error-message">
              <p>Please set the following environment variables:</p>
              <ul>
                <li>REACT_APP_SUPABASE_URL</li>
                <li>REACT_APP_SUPABASE_ANON_KEY</li>
              </ul>
              <p>Create a <code>.env.local</code> file in the project root with these variables.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <div className="card">
          <h1>Supabase Lessons Data Entry</h1>

          <form onSubmit={handleSubmit}>
            {/* Required Fields */}
            <div className="section">
              <h2>Required Fields</h2>
              <div className="form-group">
                <label htmlFor="id">
                  ID (UUID) <span className="required">*</span>
                </label>
                <div className="input-with-button">
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    onFocus={handleIdFocus}
                    placeholder="UUID v4 (e.g., 550e8400-e29b-41d4-a716-446655440000)"
                    required
                  />
                  <button type="button" onClick={generateUuid} className="generate-btn">
                    Generate UUID
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">
                  Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter lesson title"
                  required
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="section">
              <h2>Optional Fields</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="curriculum_group_id">Curriculum Group ID</label>
                  <input
                    type="text"
                    id="curriculum_group_id"
                    name="curriculum_group_id"
                    value={formData.curriculum_group_id}
                    onChange={handleInputChange}
                    placeholder="UUID from curriculum_groups table"
                  />
                  <small className="hint">Foreign key to curriculum_groups.id</small>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Mathematics, Science, History"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="target_audience">Target Audience</label>
                  <input
                    type="text"
                    id="target_audience"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleInputChange}
                    placeholder="e.g., High School Students, College Freshmen"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="level">Level</label>
                  <input
                    type="text"
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    placeholder="e.g., Beginner, Intermediate, Advanced"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="uploaded_by">Uploaded By (User ID)</label>
                  <input
                    type="text"
                    id="uploaded_by"
                    name="uploaded_by"
                    value={formData.uploaded_by}
                    onChange={handleInputChange}
                    placeholder="UUID from users table (e.g., 20c35422-07b3-4b87-b7f5-fa54c0e9fe23)"
                  />
                  <small className="hint">Foreign key to users.id - The user 'Sejal' has ID: 20c35422-07b3-4b87-b7f5-fa54c0e9fe23</small>
                </div>
              </div>
            </div>

            {/* Text Fields */}
            <div className="section">
              <h2>Content Fields</h2>
              <div className="form-group">
                <label htmlFor="application">Application</label>
                <textarea
                  id="application"
                  name="application"
                  value={formData.application}
                  onChange={handleInputChange}
                  placeholder="How can this lesson be applied in real-world scenarios?"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="assessment">Assessment</label>
                <textarea
                  id="assessment"
                  name="assessment"
                  value={formData.assessment}
                  onChange={handleInputChange}
                  placeholder="Describe assessment methods and criteria"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="refs">References</label>
                <textarea
                  id="refs"
                  name="refs"
                  value={formData.refs}
                  onChange={handleInputChange}
                  placeholder="List references, citations, or external resources"
                  rows={2}
                />
              </div>
            </div>

            {/* JSON Fields */}
            <div className="section">
              <h2>JSON Data Fields</h2>

              <JsonField
                label="Learning Objectives"
                name="learning_objectives"
                value={formData.learning_objectives}
                onChange={handleJsonChange}
                placeholder={`[
  "Understand basic concepts",
  "Apply knowledge to real-world scenarios",
  "Develop critical thinking skills"
]`}
              />

              <JsonField
                label="Materials"
                name="materials"
                value={formData.materials}
                onChange={handleJsonChange}
                placeholder={`{
  "required": ["Textbook", "Calculator", "Notebook"],
  "optional": ["Computer", "Reference guides"],
  "resources": {
    "online": ["Website links", "Videos"],
    "offline": ["Handouts", "Worksheets"]
  }
}`}
              />

              <JsonField
                label="Teaching Activities"
                name="teaching_activities"
                value={formData.teaching_activities}
                onChange={handleJsonChange}
                placeholder={`[
  {
    "activity": "Introduction",
    "duration": "10 minutes",
    "description": "Brief overview of the topic"
  },
  {
    "activity": "Main Content",
    "duration": "30 minutes",
    "description": "Detailed explanation with examples"
  },
  {
    "activity": "Practice",
    "duration": "15 minutes",
    "description": "Hands-on exercises"
  }
]`}
              />
            </div>

            {/* Status Message */}
            <StatusMessage type={status.type} message={status.message} />

            {/* Action Buttons */}
            <div className="button-group">
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Lesson'}
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="clear-btn"
                disabled={isSubmitting}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;