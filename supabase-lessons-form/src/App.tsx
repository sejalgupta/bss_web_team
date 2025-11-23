import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import JsonField from './components/JsonField';
import StatusMessage from './components/StatusMessage';
import { FormData, JsonValidation, Status, Lesson, CurriculumGroup, User } from './types';

// Initialize Supabase client
const supabaseUrl = 'https://cycfjdvszpctjxoosspf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5Y2ZqZHZzenBjdGp4b29zc3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODc2NzUsImV4cCI6MjA3NDY2MzY3NX0.9VBTKLLkoaDx3Z6g7iyohsjmJHAK6xCzrE7cX1E8ftk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    id: uuidv4(), // Auto-generate ID on load
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
    uploaded_by: '',
    user_name: '',
    user_email: ''
  });

  const [jsonValidation, setJsonValidation] = useState<JsonValidation>({
    learning_objectives: true,
    materials: true,
    teaching_activities: true
  });

  const [status, setStatus] = useState<Status>({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [curriculumGroups, setCurriculumGroups] = useState<CurriculumGroup[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [existingUserId, setExistingUserId] = useState<string>('');
  const [userMode, setUserMode] = useState<'existing' | 'new'>('existing');

  // Fetch curriculum groups and users on component mount
  useEffect(() => {
    fetchCurriculumGroups();
    fetchUsers();
  }, []);

  const fetchCurriculumGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('curriculum_groups')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching curriculum groups:', error);
      } else {
        setCurriculumGroups(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch curriculum groups:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 10) {
      setStatus({
        type: 'error',
        message: 'Maximum 10 files allowed'
      });
      return;
    }
    setFiles(selectedFiles);
  };

  const uploadFiles = async (lessonId: string) => {
    const uploadPromises = files.map(async (file, index) => {
      try {
        // Create a simple, clean file path
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop() || 'bin';
        // Very simple sanitization - just alphanumeric and dash
        const sanitizedName = file.name
          .replace(/\.[^/.]+$/, '') // Remove extension
          .replace(/[^a-zA-Z0-9]/g, '-') // Replace all non-alphanumeric with dash
          .replace(/-+/g, '-') // Replace multiple dashes with single
          .replace(/^-|-$/g, '') // Remove leading/trailing dashes
          .substring(0, 50); // Shorter limit

        // Simple file path without subfolder initially to test
        const fileName = `${timestamp}_${index}_${sanitizedName}.${fileExt}`;

        console.log(`Attempting to upload file: ${file.name} as ${fileName}`);

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('lesson-files') // Using 'lesson-files' bucket
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error(`Error uploading file ${file.name} to storage:`, uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        console.log(`File uploaded successfully: ${fileName}`);
        console.log('Upload response:', uploadData);

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('lesson-files')
          .getPublicUrl(fileName);

        console.log(`Public URL: ${urlData.publicUrl}`);

        // Store file reference in database with original filename in file_type
        const { error: dbError } = await supabase
          .from('lesson_files')
          .insert({
            lesson_id: lessonId,
            file_url: urlData.publicUrl,
            file_type: file.type || 'application/octet-stream' // Simplified - just store MIME type
          });

        if (dbError) {
          console.error('Error storing file reference in database:', dbError);
          // Try to delete the uploaded file if database insert fails
          await supabase.storage
            .from('lesson-files')
            .remove([fileName]);
          throw dbError;
        }

        return true;
      } catch (err) {
        console.error('Error in file upload process:', err);
        throw err;
      }
    });

    await Promise.all(uploadPromises);
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

    // Validate required fields
    if (!formData.title) {
      setStatus({
        type: 'error',
        message: 'Please fill in the title field.'
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
      let userId = existingUserId;

      // Handle user creation or selection
      if (userMode === 'new') {
        // Create new user if needed
        if (formData.user_name && formData.user_email) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
              name: formData.user_name,
              email: formData.user_email
            })
            .select()
            .single();

          if (userError) {
            // Check if user already exists
            if (userError.code === '23505') {
              const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', formData.user_email)
                .single();

              if (existingUser) {
                userId = existingUser.id;
              }
            } else {
              throw userError;
            }
          } else if (userData) {
            userId = userData.id;
          }
        }
      }

      // Prepare data for submission
      const submitData: Partial<Lesson> = {
        id: formData.id,
        title: formData.title
      };

      // Add optional fields
      if (formData.curriculum_group_id) submitData.curriculum_group_id = formData.curriculum_group_id;
      if (formData.subject?.trim()) submitData.subject = formData.subject;
      if (formData.target_audience) submitData.target_audience = formData.target_audience;
      if (formData.level) submitData.level = formData.level; // Don't trim - must match exact values
      if (formData.application?.trim()) submitData.application = formData.application;
      if (formData.assessment?.trim()) submitData.assessment = formData.assessment;
      // Handle refs as array - split by newlines or commas
      if (formData.refs?.trim()) {
        submitData.refs = formData.refs.split(/[\n,]/).map(ref => ref.trim()).filter(ref => ref.length > 0) as any;
      }
      if (userId) submitData.uploaded_by = userId;

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

      // Insert lesson data
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
        // Upload files if any
        if (files.length > 0) {
          try {
            setStatus({
              type: '',
              message: 'Uploading files...'
            });
            await uploadFiles(formData.id);
            setStatus({
              type: 'success',
              message: `Lesson added successfully! ${files.length} file(s) uploaded.`
            });
          } catch (fileError: any) {
            console.error('File upload error details:', fileError);
            setStatus({
              type: 'error',
              message: `Lesson saved but file upload failed: ${fileError.message}. Please run the setup_storage.sql script in Supabase SQL Editor to configure storage policies.`
            });
          }
        } else {
          setStatus({
            type: 'success',
            message: 'Lesson added successfully!'
          });
        }

        // Clear form and generate new ID
        setFormData({
          id: uuidv4(),
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
          uploaded_by: '',
          user_name: '',
          user_email: ''
        });
        setFiles([]);
        setExistingUserId('');

        // Refresh users list
        fetchUsers();

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
      id: uuidv4(),
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
      uploaded_by: '',
      user_name: '',
      user_email: ''
    });
    setFiles([]);
    setStatus({ type: '', message: '' });
    setExistingUserId('');
  };

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
                  ID (UUID) - Auto-generated
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  readOnly
                  disabled
                  style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                />
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

            {/* User Selection */}
            <div className="section">
              <h2>User Information</h2>
              <div className="form-group">
                <label>User Mode</label>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                  <label>
                    <input
                      type="radio"
                      value="existing"
                      checked={userMode === 'existing'}
                      onChange={(e) => setUserMode(e.target.value as 'existing' | 'new')}
                    />
                    Select Existing User
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="new"
                      checked={userMode === 'new'}
                      onChange={(e) => setUserMode(e.target.value as 'existing' | 'new')}
                    />
                    Create New User
                  </label>
                </div>
              </div>

              {userMode === 'existing' ? (
                <div className="form-group">
                  <label htmlFor="existing_user">Select User</label>
                  <select
                    id="existing_user"
                    value={existingUserId}
                    onChange={(e) => setExistingUserId(e.target.value)}
                  >
                    <option value="">-- Select a user --</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="user_name">Name</label>
                    <input
                      type="text"
                      id="user_name"
                      name="user_name"
                      value={formData.user_name}
                      onChange={handleInputChange}
                      placeholder="Enter user name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="user_email">Email</label>
                    <input
                      type="email"
                      id="user_email"
                      name="user_email"
                      value={formData.user_email}
                      onChange={handleInputChange}
                      placeholder="Enter user email"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Optional Fields */}
            <div className="section">
              <h2>Optional Fields</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="curriculum_group_id">Curriculum Group</label>
                  <select
                    id="curriculum_group_id"
                    name="curriculum_group_id"
                    value={formData.curriculum_group_id}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select a curriculum group --</option>
                    {curriculumGroups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  {curriculumGroups.length === 0 && (
                    <small className="hint">No curriculum groups found. Create them in Supabase first.</small>
                  )}
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
                  <select
                    id="target_audience"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select target audience --</option>
                    <option value="Elementary">Elementary</option>
                    <option value="Middle">Middle</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="level">Level</label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select level --</option>
                    <option value="Foundational">Foundational</option>
                    <option value="Developing">Developing</option>
                    <option value="Applied/Transformational">Applied/Transformational</option>
                  </select>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="section">
              <h2>File Attachments</h2>
              <div className="form-group">
                <label htmlFor="files">Upload Files (Max 10)</label>
                <input
                  type="file"
                  id="files"
                  multiple
                  onChange={handleFileChange}
                  accept="*/*"
                />
                {files.length > 0 && (
                  <small className="hint">
                    {files.length} file(s) selected: {files.map(f => f.name).join(', ')}
                  </small>
                )}
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
                  placeholder="List references (one per line or comma-separated)"
                  rows={3}
                />
                <small className="hint">Enter multiple references separated by commas or new lines</small>
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
                placeholder={`[
  "Textbook",
  "Calculator",
  "Notebook",
  "Handouts",
  "Worksheets"
]`}
              />

              <JsonField
                label="Teaching Activities"
                name="teaching_activities"
                value={formData.teaching_activities}
                onChange={handleJsonChange}
                placeholder={`[
  "Introduction - 10 minutes",
  "Main Content - 30 minutes",
  "Practice exercises - 15 minutes",
  "Q&A and Discussion - 10 minutes"
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