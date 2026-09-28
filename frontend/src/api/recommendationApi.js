/**
 * recommendationApi.js
 * =====================
 * API client for communicating with the backend.
 * Handles student profiles and career recommendations.
 * 
 * Endpoints:
 * - POST /api/students - Create a new student profile
 * - GET /api/students/:id - Get a student profile
 * - POST /api/recommendations - Get career recommendations
 * 
 * Author: Thimira (Student Profile & Career Recommendation Module)
 */

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Create a new student profile in MongoDB
 * @param {Object} profileData - Student profile data
 * @returns {Promise<Object>} - Created profile with MongoDB _id
 */
export const createStudentProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data.studentProfile; // Return the created profile with _id
  } catch (error) {
    console.error("Error creating student profile:", error);
    throw error;
  }
};

/**
 * Get career recommendations for a student profile
 * @param {Object} profileData - Student profile data
 * @returns {Promise<Array>} - Array of career recommendations
 */
export const getRecommendations = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.statusText}`);
    }

    const data = await response.json();
    const recommendations = (data.recommendations || []).map((rec) => ({
      ...rec,
      relatedSkills: rec.relatedSkills || rec.requiredSkills || [],
      id: rec.id || rec._id || "",
    }));
    return recommendations; // Return normalized recommendations array
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

/**
 * Get a student profile by ID
 * @param {string} studentId - MongoDB student document ID
 * @returns {Promise<Object>} - Student profile
 */
export const getStudentProfile = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`);

    if (!response.ok) {
      throw new Error(`Failed to get profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data.studentProfile;
  } catch (error) {
    console.error("Error fetching student profile:", error);
    throw error;
  }
};

/**
 * Update a student profile
 * @param {string} studentId - MongoDB student document ID
 * @param {Object} updates - Updated profile data
 * @returns {Promise<Object>} - Updated profile
 */
export const updateStudentProfile = async (studentId, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data.studentProfile;
  } catch (error) {
    console.error("Error updating student profile:", error);
    throw error;
  }
};

/**
 * Delete a student profile
 * @param {string} studentId - MongoDB student document ID
 * @returns {Promise<Object>} - Deletion response
 */
export const deleteStudentProfile = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting student profile:", error);
    throw error;
  }
};
