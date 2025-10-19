import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// 💡 Add axios for API calls
import axios from 'axios'; 
import { Bug, AlertTriangle, Eye, Calendar, ArrowLeft, Plus, Trash2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ViewPestAlerts = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user } = useAuth();
	const [alerts, setAlerts] = useState([]);
	const [selectedAlert, setSelectedAlert] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null); // Added state for API errors
	const [readAlerts, setReadAlerts] = useState(new Set()); // Track which alerts have been read
	const [notificationHandled, setNotificationHandled] = useState(false);

	// Create a mapping system for notification ID to alert ID
	const createNotificationAlertMapping = (notificationId, alertId) => {
		try {
			const mappings = JSON.parse(localStorage.getItem('notificationAlertMappings') || '{}');
			mappings[notificationId] = alertId;
			localStorage.setItem('notificationAlertMappings', JSON.stringify(mappings));
			console.log(`📝 Stored mapping: notification ${notificationId} → alert ${alertId}`);
		} catch (error) {
			console.warn('Failed to store notification-alert mapping:', error);
		}
	};

	const getAlertIdFromMapping = (notificationId) => {
		try {
			const mappings = JSON.parse(localStorage.getItem('notificationAlertMappings') || '{}');
			const alertId = mappings[notificationId];
			if (alertId) {
				console.log(`📖 Found stored mapping: notification ${notificationId} → alert ${alertId}`);
			}
			return alertId;
		} catch (error) {
			console.warn('Failed to retrieve notification-alert mapping:', error);
			return null;
		}
	};

	// --- API Configuration ---
	const API_ENDPOINT = 'http://localhost:5000/api/pest-alert';

	// Check if current user can delete this alert (only owns it)
	const canDeleteAlert = (alert) => {
		if (!user) return false;
    
		// All users (including moderators) can only delete their own alerts
		const currentUserId = user.id || user._id;
		const alertOwnerId = alert.postedByUserId || alert.userId || alert.createdBy || alert.moderatorId;
    
		return currentUserId && alertOwnerId && currentUserId.toString() === alertOwnerId.toString();
	};

	// Check if current user can create new pest alert reports
	// Only admin (type 0) and moderators (type 5, 5.1) can create new reports
	const canCreateReport = () => {
		if (!user) return false;
    
		const userType = user.user_type || user.type;
		// Convert to string for consistent comparison
		const typeStr = userType ? userType.toString() : '';
    
		// Allow admin (0) and moderators (5, 5.1) to create reports
		return typeStr === '0' || typeStr === '5' || typeStr === '5.1';
	};

	// Function to handle fetching pest alerts from the backend
	const fetchAlerts = async () => {
		setLoading(true);
		setError(null); // Clear previous errors

		// 1. AUTHENTICATION & TOKEN CHECK
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			setError('❌ Not authenticated. Please login to view alerts.');
			setLoading(false);
			// Optional: navigate('/login'); 
			return;
		}

		try {
			// 2. SET HEADERS with Authorization token
			const headers = {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${authToken}`,
			};

			console.log('📤 Fetching pest alerts from:', API_ENDPOINT);

			// 3. API GET Call to retrieve data
			const response = await axios.get(API_ENDPOINT, { headers });
      
			// Assuming the backend returns the array of alerts in response.data
			setAlerts(response.data);
      
			// Initialize unread count based on alerts that haven't been viewed yet
			// For new sessions, all alerts start as unread
			const currentReadAlerts = JSON.parse(localStorage.getItem('readPestAlerts') || '[]');
			const currentReadSet = new Set(currentReadAlerts);
			setReadAlerts(currentReadSet);
      
			console.log('✅ Alerts fetched successfully:', response.data.length);

		} catch (err) {
			console.error('Data Retrieval Error:', err);
			// Handle error status codes, especially 401 Unauthorized
			if (err.response && err.response.status === 401) {
				setError('Session expired. Please log in again.');
				navigate('/login');
			} else {
				setError('Error fetching pest alerts: ' + (err.response?.data?.error || err.message || 'Server connection failed.'));
			}
			setAlerts([]); // Clear alerts on error
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteAlert = async (alertId) => {
		if (!window.confirm('Are you sure you want to delete this pest alert?')) {
			return;
		}

		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			alert('❌ Not authenticated. Please login to delete alerts.');
			return;
		}

		try {
			const headers = {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${authToken}`,
			};

			await axios.delete(`${API_ENDPOINT}/${alertId}`, { headers });
      
			// Remove from local state after successful deletion
			setAlerts(alerts.filter(alert => (alert.id || alert._id) !== alertId));
			setSelectedAlert(null);
			alert('✅ Pest alert deleted successfully!');
      
		} catch (err) {
			console.error('Delete Error:', err);
			if (err.response && err.response.status === 401) {
				alert('Session expired. Please log in again.');
				navigate('/login');
			} else {
				alert('Error deleting pest alert: ' + (err.response?.data?.error || err.message));
			}
		}
	};

	// Handle clicking on an alert to view details
	const handleAlertClick = async (alert, fromNotification = false, matchType = 'manual') => {
		const alertId = alert.id || alert._id;
    
		// Check if this alert has not been read before
		if (!readAlerts.has(alertId)) {
			// Mark as read locally
			const newReadAlerts = new Set([...readAlerts, alertId]);
			setReadAlerts(newReadAlerts);
      
			// Persist to localStorage
			localStorage.setItem('readPestAlerts', JSON.stringify([...newReadAlerts]));
      
			// Optionally, you can make an API call here to track this on the backend
			try {
				const authToken = localStorage.getItem('authToken');
				if (authToken) {
					const headers = {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${authToken}`,
					};
          
					// API call to mark alert as read/viewed (if backend supports this)
					await axios.post(`${API_ENDPOINT}/${alertId}/view`, {}, { headers });
					console.log('✅ Alert marked as viewed on backend');
				}
			} catch (err) {
				console.warn('Failed to mark alert as viewed on backend:', err.message);
				// Don't show error to user, this is optional functionality
			}
		}
    
		// Store match type for display
		if (fromNotification) {
			setSelectedAlert({ ...alert, _matchType: matchType });
		} else {
			setSelectedAlert(alert);
		}
    
		// If opened from notification, show a brief success message
		if (fromNotification) {
			console.log(`📢 Opened from notification via ${matchType} - Alert details displayed`);
		}
	};

	// 1. REPLACED MOCK DATA WITH ACTUAL API CALL
	useEffect(() => {
		fetchAlerts();
	}, []);  // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		setNotificationHandled(false);
	}, [location.key]);

	useEffect(() => {
		// Auto-open the correct alert when a notification navigates here
		if (
			notificationHandled ||
			!location.state?.fromNotification ||
			(location.state?.alertCategory && location.state.alertCategory !== 'pest') ||
			!location.state?.openAlertId ||
			alerts.length === 0
		) {
			return;
		}

		const targetId = String(location.state.openAlertId);
		const targetAlert = alerts.find((alert) => {
			const alertId = alert.id || alert._id;
			return alertId && String(alertId) === targetId;
		});

		if (targetAlert) {
			handleAlertClick(targetAlert, true, 'notification direct match');
			setNotificationHandled(true);
			window.history.replaceState({}, document.title);
		}
	}, [alerts, location.state, notificationHandled]); // eslint-disable-line react-hooks/exhaustive-deps

	// Handle auto-opening specific alert when navigated from notification
	useEffect(() => {
		if (location.state?.openAlertId && location.state?.fromNotification && alerts.length > 0) {
			console.log('🔍 === NOTIFICATION TO ALERT MATCHING DEBUG ===');
			console.log('🔍 Looking for alert with ID:', location.state.openAlertId);
			console.log('📋 Available alerts:', alerts.map(a => ({ 
				id: a.id || a._id, 
				name: a.pestName,
				dateSubmitted: a.dateSubmitted || a.createdAt 
			})));
			console.log('📱 Notification data:', location.state.notificationData);
			console.log('🔤 Search terms:', location.state.searchTerms);
      
			let targetAlert = null;
			let matchMethod = 'none';
      
			// Method 0: Check stored mappings first
			const notificationId = location.state.debugInfo?.notificationId || location.state.notificationData?.id;
			if (notificationId) {
				const storedAlertId = getAlertIdFromMapping(notificationId);
				if (storedAlertId) {
					targetAlert = alerts.find(alert => 
						(alert.id || alert._id) === storedAlertId || 
						String(alert.id || alert._id) === String(storedAlertId)
					);
					if (targetAlert) {
						matchMethod = 'stored mapping';
						console.log('✅ Method 0 - Stored mapping match found:', storedAlertId);
					}
				}
			}
      
			// Method 1: Exact ID matching
			if (!targetAlert && location.state.openAlertId) {
				targetAlert = alerts.find(alert => {
					const alertId = alert.id || alert._id;
					const isMatch = alertId === location.state.openAlertId || 
								 alertId === String(location.state.openAlertId) ||
								 String(alertId) === String(location.state.openAlertId);
					if (isMatch) {
						matchMethod = 'exact ID match';
						console.log('✅ Method 1 - Exact ID match found:', alertId);
					}
					return isMatch;
				});
			}
      
			// Method 2: Content-based matching using search terms
			if (!targetAlert && location.state.searchTerms) {
				const searchTerms = location.state.searchTerms;
				console.log('🔍 Method 2 - Trying content matching with terms:', searchTerms);
        
				targetAlert = alerts.find(alert => {
					const alertTitle = (alert.pestName || '').toLowerCase();
					const alertSymptoms = (alert.symptoms || '').toLowerCase();
          
					const isMatch = searchTerms.some(term => {
						const searchTerm = term.toLowerCase().trim();
						if (searchTerm.length < 3) return false;
            
						const titleMatch = alertTitle.includes(searchTerm) || searchTerm.includes(alertTitle);
						const symptomMatch = alertSymptoms.includes(searchTerm) || searchTerm.includes(alertSymptoms);
						const wordMatch = alertTitle.split(' ').some(word => 
							word.includes(searchTerm) || searchTerm.includes(word)
						);
            
						if (titleMatch || symptomMatch || wordMatch) {
							console.log(`✅ Content match found: "${searchTerm}" matches "${alertTitle}"`);
							return true;
						}
						return false;
					});
          
					if (isMatch) {
						matchMethod = 'content match';
					}
					return isMatch;
				});
			}
      
			// Method 3: Fuzzy matching for partial names
			if (!targetAlert && location.state.searchTerms?.length > 0) {
				const mainSearchTerm = location.state.searchTerms[0].toLowerCase().trim();
				console.log('🔍 Method 3 - Trying fuzzy matching with term:', mainSearchTerm);
        
				if (mainSearchTerm.length >= 3) {
					targetAlert = alerts.find(alert => {
						const alertTitle = (alert.pestName || '').toLowerCase();
            
						// Try different fuzzy matching strategies
						const strategies = [
							// Strategy 1: Common prefix
							() => alertTitle.startsWith(mainSearchTerm.substring(0, 3)),
							// Strategy 2: Contains substring
							() => alertTitle.includes(mainSearchTerm.substring(0, 4)),
							// Strategy 3: Similar length and common characters
							() => {
								if (Math.abs(alertTitle.length - mainSearchTerm.length) <= 3) {
									const commonChars = [...mainSearchTerm].filter(char => alertTitle.includes(char)).length;
									return commonChars >= Math.min(4, mainSearchTerm.length * 0.6);
								}
								return false;
							}
						];
            
						for (let i = 0; i < strategies.length; i++) {
							if (strategies[i]()) {
								console.log(`✅ Fuzzy match found using strategy ${i + 1}: "${mainSearchTerm}" ~ "${alertTitle}"`);
								matchMethod = `fuzzy match (strategy ${i + 1})`;
								return true;
							}
						}
						return false;
					});
				}
			}
      
			// Method 4: Date-based matching (if notification has timestamp)
			if (!targetAlert && location.state.notificationData?.created_at) {
				console.log('🔍 Method 4 - Trying date-based matching');
				const notificationDate = new Date(location.state.notificationData.created_at);
        
				// Find alerts created around the same time (within 24 hours)
				const timeWindow = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
				targetAlert = alerts.find(alert => {
					const alertDate = new Date(alert.dateSubmitted || alert.createdAt);
					const timeDiff = Math.abs(notificationDate - alertDate);
          
					if (timeDiff <= timeWindow) {
						console.log(`✅ Date-based match found: notification (${notificationDate.toISOString()}) ~ alert (${alertDate.toISOString()})`);
						matchMethod = 'date-based match';
						return true;
					}
					return false;
				});
			}
      
			// Method 5: Fallback to most recent alert
			if (!targetAlert && alerts.length > 0) {
				console.log('🔍 Method 5 - Using most recent alert as fallback');
				targetAlert = [...alerts].sort((a, b) => {
					const dateA = new Date(a.dateSubmitted || a.createdAt || 0);
					const dateB = new Date(b.dateSubmitted || b.createdAt || 0);
					return dateB - dateA;
				})[0];
				matchMethod = 'most recent (fallback)';
			}
      
			if (targetAlert) {
				console.log(`✅ FINAL RESULT: Found target alert "${targetAlert.pestName}" using ${matchMethod}`);
				console.log('🎯 Opening alert details...');
        
				// Store the mapping for future use (if we have notification ID)
				if (notificationId && matchMethod !== 'stored mapping') {
					createNotificationAlertMapping(notificationId, targetAlert.id || targetAlert._id);
				}
        
				// Auto-open the specific alert with notification flag
				handleAlertClick(targetAlert, true, matchMethod);
        
				// Clear the navigation state to prevent reopening on re-renders
				window.history.replaceState({}, document.title);
			} else {
				console.error('❌ FAILED: No suitable alert found for notification');
				console.log('💡 Consider checking:');
				console.log('   - Notification ID format and pest alert ID format');
				console.log('   - Notification content matches pest alert names');
				console.log('   - Database relationships between notifications and alerts');
        
				// Show a user-friendly message and still try to show something
				if (alerts.length > 0) {
					console.log('🆘 Emergency fallback: Opening first available alert');
					handleAlertClick(alerts[0], true, 'emergency fallback');
				} else {
					console.log('🆘 No alerts available at all');
					// Show an error message to the user
					alert('No pest alerts found. Please check if there are any pest alerts created in the system.');
				}
        
				// Clear the navigation state
				window.history.replaceState({}, document.title);
			}
      
			console.log('🔍 === END DEBUG SESSION ===');
		}
	}, [alerts, location.state]); // eslint-disable-line react-hooks/exhaustive-deps

	const getSeverityColor = (severity) => {
		switch (severity?.toLowerCase()) {
			case 'high':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'low':
				return 'bg-green-100 text-green-800 border-green-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	// 2. REMOVED the handleSubmit function entirely as it was incorrect for viewing data.
	// The original component had a handleSubmit function trying to fetch data, 
	// but it was using submission logic which is wrong for viewing/retrieving.

	const formatDate = (dateString) => {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
					<h3 className="text-xl font-medium text-gray-900 mb-2">Loading Pest Alerts...</h3>
					<p className="text-gray-500">Connecting to server to fetch reports...</p>
				</div>
			</div>
		);
	}
  
	// 3. ADDED Error Display
	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
				<div className="text-center bg-white p-8 rounded-2xl shadow-xl">
						<AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
						<h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Data</h3>
						<p className="text-red-600 mb-4">{error}</p>
						<button 
								onClick={fetchAlerts}
								className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
						>
								Try Again
						</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header (UI remains the same) */}
				<div className="bg-white rounded-3xl shadow-xl border border-green-100 p-8 mb-8">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center space-x-4">
							<button
								onClick={() => navigate('/')}
								className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
							>
								<ArrowLeft className="w-6 h-6 text-gray-600" />
							</button>
							<div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
								<Bug className="h-8 w-8 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">Pest Alert Reports</h1>
								<p className="text-gray-600">
									View and manage community pest reports
                  
								</p>
							</div>
						</div>
						{canCreateReport() && (
							<div className="flex gap-3">
								<Link
									to="/pestalert/upload"
									className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
								>
									<Plus className="w-4 h-4" />
									<span>New Report</span>
								</Link>
                
								{/* Debug test button for notification simulation */}
								
							</div>
						)}
					</div>
				</div>

				{/* Alert Cards */}
				<div className="space-y-6">
					{alerts.length === 0 ? (
						<div className="bg-white rounded-3xl shadow-xl border border-green-100 p-12 text-center">
							<Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No Pest Alerts Found</h3>
							<p className="text-gray-500 mb-6">
								{canCreateReport() 
									? "No pest reports have been submitted yet."
									: "No pest alerts have been reported by moderators yet. Check back later for updates."
								}
							</p>
							{canCreateReport() && (
								<Link
									to="/pestalert/upload"
									className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
								>
									<Plus className="w-5 h-5" />
									Submit First Report
								</Link>
							)}
						</div>
					) : (
						alerts.map((alert) => (
							<div
								key={alert.id || alert._id} // Use a robust key check
								className={`bg-white rounded-3xl shadow-xl border p-8 hover:shadow-2xl transition-all duration-300 ${
									readAlerts.has(alert.id || alert._id) 
										? 'border-green-100 opacity-90' 
										: 'border-blue-200 ring-2 ring-blue-100'
								}`}
							>
								<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
									{/* Main Content */}
									<div className="flex-1">
										<div className="flex items-start justify-between mb-4">
											<div>
												<h3 className="text-2xl font-bold text-gray-900 mb-2">{alert.pestName}</h3>
												<div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
													<div className="flex items-center space-x-1">
														<Calendar className="w-4 h-4" />
														<span>Reported: {formatDate(alert.dateSubmitted || alert.createdAt)}</span>
													</div>
													<div className="flex items-center space-x-1">
														<User className="w-4 h-4" />
														<span>By: {alert.authorName || 'Anonymous'}</span>
													</div>
												</div>
											</div>
											<div className="flex flex-col items-end gap-2">
												<span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(alert.severity)}`}>
													{alert.severity?.toUpperCase() || 'UNKNOWN'} PRIORITY
												</span>
												{!readAlerts.has(alert.id || alert._id) && (
													<span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-bold animate-pulse">
														NEW
													</span>
												)}
												{canDeleteAlert(alert) && (
													<span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
														Your Alert
													</span>
												)}
											</div>
										</div>

										{/* Symptoms Preview */}
										<div className="mb-6">
											<h4 className="font-semibold text-gray-800 mb-2">Symptoms Observed:</h4>
											<p className="text-gray-700 leading-relaxed">
												{alert.symptoms?.length > 150 
													? `${alert.symptoms.substring(0, 150)}...` 
													: alert.symptoms}
											</p>
										</div>

										{/* Recommendations Preview */}
										<div className="mb-6">
											<h4 className="font-semibold text-gray-800 mb-3">Recommendations:</h4>
											<div className="space-y-2">
												{Array.isArray(alert.recommendations) && alert.recommendations.slice(0, 2).map((rec, idx) => (
													<div key={idx} className="flex items-start gap-3">
														<span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
															{idx + 1}
														</span>
														<span className="text-gray-700 text-sm">{rec}</span>
													</div>
												))}
												{Array.isArray(alert.recommendations) && alert.recommendations.length > 2 && (
													<p className="text-sm text-gray-500 ml-9">
														+{alert.recommendations.length - 2} more recommendations
													</p>
												)}
											</div>
										</div>
									</div>

									{/* Actions */}
									<div className="flex flex-col gap-3 lg:min-w-[150px]">
										<button
											onClick={() => handleAlertClick(alert)}
											className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
										>
											<Eye className="w-4 h-4" />
											View Details
										</button>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{/* Modal for Alert Details */}
				{selectedAlert && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
							<div className="p-8">
								<div className="flex items-center justify-between mb-8">
									<div className="flex items-center gap-4">
										<div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
											<Bug className="w-8 h-8 text-white" />
										</div>
										<div>
											<h2 className="text-3xl font-bold text-gray-900">{selectedAlert.pestName}</h2>
											{location.state?.fromNotification && (
												<div className="space-y-2 mt-2">
                          
                          
                          
													{/* Debug information for troubleshooting */}
													{location.state?.debugInfo && (
														<details className="mt-2 text-xs">
															<summary className="cursor-pointer text-blue-600 hover:text-blue-800">
																🔧 Debug Info (Click to expand)
															</summary>
															<div className="mt-1 p-2 bg-gray-50 rounded text-gray-600 font-mono text-xs">
																<div>Notification ID: {location.state.debugInfo.notificationId}</div>
																<div>Alert ID: {selectedAlert.id || selectedAlert._id}</div>
																<div>Search Terms: {location.state.searchTerms?.join(', ') || 'None'}</div>
																<div>Match Method: {selectedAlert._matchType || 'Unknown'}</div>
																<div>Clicked at: {location.state.debugInfo.timestamp}</div>
															</div>
														</details>
													)}
												</div>
											)}
											<p className="text-gray-600">Reported on {formatDate(selectedAlert.dateSubmitted || selectedAlert.createdAt)}</p>
											<p className="text-gray-500 text-sm">By: {selectedAlert.authorName || 'Anonymous'}</p>
										</div>
									</div>
									<button
										onClick={() => setSelectedAlert(null)}
										className="text-gray-400 hover:text-gray-600 transition-colors"
									>
										{/* Replaced AlertTriangle with a standard close icon for better UX */}
										<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
									</button>
								</div>

								<div className="space-y-8">
									{/* Priority */}
									<div className="flex flex-wrap gap-4">
										<span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getSeverityColor(selectedAlert.severity)}`}>
											{selectedAlert.severity?.toUpperCase() || 'UNKNOWN'} PRIORITY
										</span>
									</div>

									{/* Full Symptoms */}
									<div>
										<h4 className="font-semibold text-gray-800 mb-3 text-lg">Symptoms Observed</h4>
										<div className="bg-gray-50 p-6 rounded-2xl">
											<p className="text-gray-700 leading-relaxed">{selectedAlert.symptoms}</p>
										</div>
									</div>

									{/* Full Recommendations */}
									<div>
										<h4 className="font-semibold text-gray-800 mb-3 text-lg">Recommended Actions</h4>
										<div className="space-y-4">
											{Array.isArray(selectedAlert.recommendations) && selectedAlert.recommendations.map((rec, index) => (
												<div key={index} className="flex items-start gap-4 bg-green-50 p-4 rounded-2xl">
													<div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
														{index + 1}
													</div>
													<p className="text-gray-700">{rec}</p>
												</div>
											))}
											{!Array.isArray(selectedAlert.recommendations) && (
													<p className="text-gray-500">No specific recommendations provided.</p>
											)}
										</div>
									</div>

									{/* Actions */}
									<div className="flex gap-4 pt-6 border-t">
										<button
											onClick={() => setSelectedAlert(null)}
											className={`${canDeleteAlert(selectedAlert) ? 'flex-1' : 'w-full'} bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold transition-colors`}
										>
											Close
										</button>
										{canDeleteAlert(selectedAlert) && (
											<button 
												onClick={() => handleDeleteAlert(selectedAlert.id || selectedAlert._id)}
												className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
											>
												<Trash2 className="w-4 h-4" />
												Delete Alert
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ViewPestAlerts;

