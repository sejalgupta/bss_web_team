import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import StatusMessage from './components/StatusMessage';
import { FormData, Status, Lesson, CurriculumGroup, User, Topic, MaterialType } from './types';

// Initialize Supabase client
const supabaseUrl = 'https://cycfjdvszpctjxoosspf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5Y2ZqZHZzenBjdGp4b29zc3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODc2NzUsImV4cCI6MjA3NDY2MzY3NX0.9VBTKLLkoaDx3Z6g7iyohsjmJHAK6xCzrE7cX1E8ftk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    id: uuidv4(), // Auto-generate ID on load
    title: '',
    topic: '',
    curriculum_group_id: '',
    subject: '',
    target_audience: '',
    level: '',
    learning_objectives: '',
    refs: '',
    uploaded_by: '',
    user_name: '',
    user_email: '',
    lesson_number: '',
    new_topic_name: ''
  });

  const [status, setStatus] = useState<Status>({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [curriculumGroups, setCurriculumGroups] = useState<CurriculumGroup[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [lessonPlanFile, setLessonPlanFile] = useState<File | null>(null);
  const [powerpointFile, setPowerpointFile] = useState<File | null>(null);
  const [existingUserId, setExistingUserId] = useState<string>('');
  const [userMode, setUserMode] = useState<'existing' | 'new'>('existing');
  const [topicMode, setTopicMode] = useState<'existing' | 'new'>('existing');
  const [formKey, setFormKey] = useState<number>(0);

  // Fetch curriculum groups, topics, and users on component mount
  useEffect(() => {
    fetchCurriculumGroups();
    fetchTopics();
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

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('id, name, relevant_unit, topic_number, created_at')
        .order('topic_number');

      if (error) {
        console.error('Error fetching topics:', error);
      } else {
        setTopics(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch topics:', err);
    }
  };

  // Get filtered topics based on selected curriculum group
  const getFilteredTopics = (): Topic[] => {
    if (!formData.curriculum_group_id) return [];
    return topics.filter(topic => topic.relevant_unit === formData.curriculum_group_id);
  };

  // Get next topic number for the selected curriculum group
  const getNextTopicNumber = (): number => {
    const filteredTopics = getFilteredTopics();
    if (filteredTopics.length === 0) return 1;
    const maxNumber = Math.max(...filteredTopics.map(t => t.topic_number || 0));
    return maxNumber + 1;
  };

  // Map target audience to number
  const getTargetAudienceNumber = (audience: string): string => {
    const mapping: Record<string, string> = {
      'Elementary': '1',
      'Middle': '2',
      'High': '3'
    };
    return mapping[audience] || '';
  };

  // Compute the composite lesson number (unit.topic.lesson.target_audience)
  const getCompositeLessonNumber = (): string => {
    const selectedGroup = curriculumGroups.find(g => g.id === formData.curriculum_group_id);
    const unitNumber = selectedGroup?.unit || '';

    // Get topic number
    let topicNumber = '';
    if (topicMode === 'existing' && formData.topic) {
      const selectedTopic = topics.find(t => t.id === formData.topic);
      topicNumber = selectedTopic?.topic_number?.toString() || '';
    } else if (topicMode === 'new' && formData.curriculum_group_id) {
      topicNumber = getNextTopicNumber().toString();
    }

    const lessonNumber = formData.lesson_number || '';
    const targetAudienceNumber = getTargetAudienceNumber(formData.target_audience);

    if (unitNumber && topicNumber && lessonNumber && targetAudienceNumber) {
      return `${unitNumber}.${topicNumber}.${lessonNumber}.${targetAudienceNumber}`;
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLearningObjectivesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      learning_objectives: value
    }));
  };

  const handleLessonPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLessonPlanFile(file);
  };

  const handlePowerpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPowerpointFile(file);
  };

  const uploadFiles = async (lessonId: string) => {
    const filesToUpload: Array<{ file: File; materialType: MaterialType }> = [];

    if (lessonPlanFile) {
      filesToUpload.push({ file: lessonPlanFile, materialType: 'LESSON_PLAN' });
    }
    if (powerpointFile) {
      filesToUpload.push({ file: powerpointFile, materialType: 'LESSON_PPT' });
    }

    const uploadPromises = filesToUpload.map(async ({ file, materialType }) => {
      try {
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop() || 'bin';
        const sanitizedName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-zA-Z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 50);

        const fileName = `${timestamp}_${materialType}_${sanitizedName}.${fileExt}`;

        console.log(`Attempting to upload file: ${file.name} as ${fileName} (${materialType})`);

        const { error: uploadError } = await supabase.storage
          .from('lesson-files')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error(`Error uploading file ${file.name} to storage:`, uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        console.log(`File uploaded successfully: ${fileName}`);

        const { data: urlData } = supabase.storage
          .from('lesson-files')
          .getPublicUrl(fileName);

        console.log(`Public URL: ${urlData.publicUrl}`);

        const { error: dbError } = await supabase
          .from('lesson_files')
          .insert({
            lesson_id: lessonId,
            file_url: urlData.publicUrl,
            file_type: file.type || 'application/octet-stream',
            material_type: materialType
          });

        if (dbError) {
          console.error('Error storing file reference in database:', dbError);
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

    // Validate that at least lesson plan is uploaded
    if (!lessonPlanFile) {
      setStatus({
        type: 'error',
        message: 'Please upload a lesson plan file.'
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

      // Handle topic creation if needed
      let topicId = formData.topic;
      if (topicMode === 'new' && formData.new_topic_name && formData.curriculum_group_id) {
        const nextTopicNumber = getNextTopicNumber();
        const newTopicId = uuidv4();
        const { data: topicData, error: topicError } = await supabase
          .from('topics')
          .insert({
            id: newTopicId,
            name: formData.new_topic_name,
            relevant_unit: formData.curriculum_group_id,
            topic_number: nextTopicNumber
          })
          .select()
          .single();

        if (topicError) {
          // Check if topic already exists by name
          if (topicError.code === '23505') {
            const { data: existingTopic } = await supabase
              .from('topics')
              .select('id')
              .eq('name', formData.new_topic_name)
              .eq('relevant_unit', formData.curriculum_group_id)
              .single();

            if (existingTopic) {
              topicId = existingTopic.id;
            }
          } else {
            throw topicError;
          }
        } else if (topicData) {
          topicId = topicData.id;
          // Refresh topics list
          await fetchTopics();
        }
      }

      // Prepare data for submission
      const submitData: Partial<Lesson> = {
        id: formData.id,
        title: formData.title
      };

      // Add optional fields
      if (topicId) submitData.topic = topicId;
      if (formData.lesson_number) submitData.lesson_number = parseInt(formData.lesson_number);
      if (formData.subject?.trim()) submitData.subject = formData.subject;
      if (formData.target_audience) submitData.target_audience = formData.target_audience;
      if (formData.level) submitData.level = formData.level;

      // Handle learning objectives - convert from textarea (line-separated) to JSONB array
      if (formData.learning_objectives?.trim()) {
        const objectives = formData.learning_objectives
          .split('\n')
          .map(obj => obj.trim())
          .filter(obj => obj.length > 0);
        if (objectives.length > 0) {
          submitData.learning_objectives = objectives;
        }
      }

      // Handle refs as array - split by newlines or commas
      if (formData.refs?.trim()) {
        submitData.refs = formData.refs.split(/[\n,]/).map(ref => ref.trim()).filter(ref => ref.length > 0);
      }

      if (userId) submitData.uploaded_by = userId;

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
        // Upload files
        try {
          setStatus({
            type: '',
            message: 'Uploading files...'
          });
          await uploadFiles(formData.id);
          const fileCount = (lessonPlanFile ? 1 : 0) + (powerpointFile ? 1 : 0);
          setStatus({
            type: 'success',
            message: `Lesson added successfully! ${fileCount} file(s) uploaded.`
          });
        } catch (fileError: any) {
          console.error('File upload error details:', fileError);
          setStatus({
            type: 'error',
            message: `Lesson saved but file upload failed: ${fileError.message}. Please run the setup_storage.sql script in Supabase SQL Editor to configure storage policies.`
          });
        }

        // Clear form and generate new ID
        setFormData({
          id: uuidv4(),
          title: '',
          topic: '',
          curriculum_group_id: '',
          subject: '',
          target_audience: '',
          level: '',
          learning_objectives: '',
          refs: '',
          uploaded_by: '',
          user_name: '',
          user_email: '',
          lesson_number: '',
          new_topic_name: ''
        });
        setLessonPlanFile(null);
        setPowerpointFile(null);
        setExistingUserId('');
        setFormKey(prev => prev + 1);

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
      topic: '',
      curriculum_group_id: '',
      subject: '',
      target_audience: '',
      level: '',
      learning_objectives: '',
      refs: '',
      uploaded_by: '',
      user_name: '',
      user_email: '',
      lesson_number: '',
      new_topic_name: ''
    });
    setLessonPlanFile(null);
    setPowerpointFile(null);
    setStatus({ type: '', message: '' });
    setExistingUserId('');
    setFormKey(prev => prev + 1);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="card">
          <h1>Supabase Lessons Data Entry</h1>

          <form onSubmit={handleSubmit} key={formKey}>
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

              {/* Composite Lesson Number Display */}
              {getCompositeLessonNumber() && (
                <div style={{
                  padding: '15px',
                  backgroundColor: '#e8f5e9',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '2px solid #4caf50'
                }}>
                  <strong style={{ fontSize: '18px', color: '#2e7d32' }}>
                    Lesson Number: {getCompositeLessonNumber()}
                  </strong>
                  <div style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>
                    (Unit.Topic.Lesson.Grade) - Elementary=1, Middle=2, High=3
                  </div>
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="curriculum_group_id">Curriculum Group (Unit)</label>
                  <select
                    id="curriculum_group_id"
                    name="curriculum_group_id"
                    value={formData.curriculum_group_id}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select a curriculum group --</option>
                    {curriculumGroups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name} (Unit {group.unit})
                      </option>
                    ))}
                  </select>
                  {curriculumGroups.length === 0 && (
                    <small className="hint">No curriculum groups found. Create them in Supabase first.</small>
                  )}
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Topic Mode</label>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                    <label>
                      <input
                        type="radio"
                        value="existing"
                        checked={topicMode === 'existing'}
                        onChange={(e) => setTopicMode(e.target.value as 'existing' | 'new')}
                      />
                      Select Existing Topic
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="new"
                        checked={topicMode === 'new'}
                        onChange={(e) => setTopicMode(e.target.value as 'existing' | 'new')}
                      />
                      Create New Topic
                    </label>
                  </div>
                </div>

                {topicMode === 'existing' ? (
                  <div className="form-group">
                    <label htmlFor="topic">Topic</label>
                    <select
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      disabled={!formData.curriculum_group_id}
                    >
                      <option value="">-- Select a topic --</option>
                      {getFilteredTopics().map(topic => (
                        <option key={topic.id} value={topic.id}>
                          {topic.topic_number}. {topic.name || topic.id}
                        </option>
                      ))}
                    </select>
                    {!formData.curriculum_group_id && (
                      <small className="hint">Select a curriculum group first</small>
                    )}
                    {formData.curriculum_group_id && getFilteredTopics().length === 0 && (
                      <small className="hint">No topics for this curriculum group. Create a new one.</small>
                    )}
                  </div>
                ) : (
                  <div className="form-group">
                    <label htmlFor="new_topic_name">New Topic Name</label>
                    <input
                      type="text"
                      id="new_topic_name"
                      name="new_topic_name"
                      value={formData.new_topic_name}
                      onChange={handleInputChange}
                      placeholder="Enter new topic name"
                      disabled={!formData.curriculum_group_id}
                    />
                    {formData.curriculum_group_id && formData.new_topic_name && (
                      <small className="hint" style={{ color: '#4caf50' }}>
                        Will be created as Topic #{getNextTopicNumber()} for this unit
                      </small>
                    )}
                    {!formData.curriculum_group_id && (
                      <small className="hint">Select a curriculum group first</small>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="lesson_number">Lesson Number</label>
                  <input
                    type="number"
                    id="lesson_number"
                    name="lesson_number"
                    value={formData.lesson_number}
                    onChange={handleInputChange}
                    placeholder="e.g., 1, 2, 3..."
                    min="1"
                  />
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
                  <label htmlFor="target_audience">Target Audience (used in numbering)</label>
                  <select
                    id="target_audience"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select target audience --</option>
                    <option value="Elementary">Elementary (1)</option>
                    <option value="Middle">Middle (2)</option>
                    <option value="High">High (3)</option>
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
                <label htmlFor="lesson_plan">
                  Lesson Plan <span className="required">*</span>
                </label>
                <input
                  type="file"
                  id="lesson_plan"
                  onChange={handleLessonPlanChange}
                  accept=".pdf,.doc,.docx,.txt"
                  required
                />
                {lessonPlanFile && (
                  <small className="hint" style={{ color: '#4caf50' }}>
                    Selected: {lessonPlanFile.name}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="powerpoint">PowerPoint (Optional)</label>
                <input
                  type="file"
                  id="powerpoint"
                  onChange={handlePowerpointChange}
                  accept=".ppt,.pptx"
                />
                {powerpointFile && (
                  <small className="hint" style={{ color: '#4caf50' }}>
                    Selected: {powerpointFile.name}
                  </small>
                )}
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="section">
              <h2>Learning Objectives</h2>
              <div className="form-group">
                <label htmlFor="learning_objectives">Learning Objectives</label>
                <textarea
                  id="learning_objectives"
                  name="learning_objectives"
                  value={formData.learning_objectives}
                  onChange={handleLearningObjectivesChange}
                  placeholder="Enter one learning objective per line, e.g.:&#10;Understand basic concepts&#10;Apply knowledge to real-world scenarios&#10;Develop critical thinking skills"
                  rows={6}
                />
                <small className="hint">Enter one objective per line. Will be stored as a list.</small>
              </div>
            </div>

            {/* References */}
            <div className="section">
              <h2>References</h2>
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