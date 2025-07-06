import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import {
    User,
    Mail,
    MapPin,
    Phone,
    Calendar,
    Home,
    FileText,
    Camera,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    Check,
    AlertCircle,
    Building2,
    Users,
    Sprout,
    Award,
    Leaf,
    Clock
} from 'lucide-react';


// --- Corrected InputField Component (Moved Outside) ---
const InputField = React.memo(({
    icon,
    label,
    name,
    type = 'text',
    required = false,
    options = null,
    isSearchable = false,
    value,
    error,
    onChange,
    onTogglePassword,
    showPassword,
    inputRef,
    ...props
}) => {
    return (
        <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-green-800">
                {icon && React.createElement(icon, { className: "w-4 h-4" })}
                <span>{label} {required && <span className="text-red-500">*</span>}</span>
            </label>
            {options && isSearchable ? (
                <Select
                    name={name}
                    value={options.find(opt => opt.value === value) || null}
                    onChange={selected => onChange({ target: { name, value: selected ? selected.value : '' } })}
                    options={options}
                    placeholder={`Search ${label}`}
                    classNamePrefix="react-select"
                    isSearchable
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            borderColor: error ? '#ef4444' : '#bbf7d0',
                            backgroundColor: error ? '#fef2f2' : '#f1f5f9',
                            borderRadius: '0.75rem',
                            minHeight: '48px',
                            boxShadow: state.isFocused ? '0 0 0 2px #22c55e' : undefined,
                        }),
                    }}
                    ref={inputRef}
                />
            ) : options ? (
                <select
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100 ${
                        error ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'
                    }`}
                    ref={inputRef}
                    {...props}
                >
                    <option value="">Select {label}</option>
                    {options.map(option =>
                        typeof option === 'object' && option !== null
                            ? (<option key={option.value} value={option.value}>{option.label}</option>)
                            : (<option key={option} value={option}>{option}</option>)
                    )}
                </select>
            ) : type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    rows={4}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 resize-none bg-slate-100 ${
                        error ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'
                    }`}
                    ref={inputRef}
                    {...props}
                />
            ) : type === 'file' ? (
                <div className="relative">
                    <input
                        type="file"
                        name={name}
                        onChange={onChange}
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        id={name}
                        ref={inputRef}
                        {...props}
                    />
                    <label
                        htmlFor={name}
                        className={`w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-green-50 bg-slate-100 ${
                            error ? 'border-red-500 bg-red-50' : 'border-green-300 hover:border-green-400'
                        }`}
                    >
                        <Camera className="w-5 h-5 text-green-600" />
                        <span className="text-green-700">
                            {value ? value.name : `Choose ${label.toLowerCase()}`}
                        </span>
                    </label>
                </div>
            ) : (
                <div className="relative">
                    <input
                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        autoComplete={type === 'password' ? 'new-password' : 'off'}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100 ${
                            type === 'password' ? 'pr-12' : ''
                        } ${error ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'}`}
                        ref={inputRef}
                        {...props}
                    />
                    {type === 'password' && (
                        <button
                            type="button"
                            onClick={onTogglePassword}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    )}
                </div>
            )}
            {error && (
                <div className="flex items-center space-x-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
});


// --- Corrected OrgInputField Component (Moved Outside) ---
const OrgInputField = React.memo(({
    icon,
    label,
    name,
    type = 'text',
    required = false,
    value,
    error,
    onChange,
    ...props
}) => {
    return (
        <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-green-800">
                {icon && React.createElement(icon, { className: "w-4 h-4" })}
                <span>{label} {required && <span className="text-red-500">*</span>}</span>
            </label>
            {type === 'file' ? (
                 <div className="relative">
                    <input
                        type="file"
                        name={name}
                        onChange={onChange}
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        id={name}
                        {...props}
                    />
                    <label
                        htmlFor={name}
                        className={`w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-green-50 bg-slate-100 ${
                            error ? 'border-red-500 bg-red-50' : 'border-green-300 hover:border-green-400'
                        }`}
                    >
                        <FileText className="w-5 h-5 text-green-600" />
                        <span className="text-green-700">
                            {value ? value.name : `Upload ${label.toLowerCase()}`}
                        </span>
                    </label>
                </div>
            ) : type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    rows={3}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 resize-none bg-slate-100 ${
                        error ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'
                    }`}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    autoComplete="off"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100 ${
                        error ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'
                    }`}
                    {...props}
                />
            )}
            {error && (
                <div className="flex items-center space-x-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
});


const FarmerSignup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOrgForm, setShowOrgForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Refs for each field for error scrolling
    const fieldRefs = React.useRef({});

    // Main farmer form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        district: '',
        landSize: '',
        nic: '',
        birthDate: '',
        address: '',
        phoneNumber: '',
        description: '',
        profileImage: null,
        password: '',
        confirmPassword: '',
        divisionGramasewaNumber: '',
        organizationId: '', // selected org id
        farmingExperience: '',
        cultivatedCrops: '',
        irrigationSystem: '',
        soilType: '',
        farmingCertifications: ''
    });

    // For organization search
    const [orgSearch, setOrgSearch] = useState('');
    const [orgOptions, setOrgOptions] = useState([]);
    const [orgSearchLoading, setOrgSearchLoading] = useState(false);
    // Track if org was just registered in this session
    const [orgRegistered, setOrgRegistered] = useState(false);
    const [orgRegisteredData, setOrgRegisteredData] = useState(null);

    // Organization committee form data
    const [orgFormData, setOrgFormData] = useState({
        organizationName: '',
        area: '',
        govijanasewaniladariname: '',
        govijanasewaniladariContact: '',
        letterofProof: null,
        establishedDate: '',
        organizationDescription: ''
    });
    // Helper to check if org form is complete
    const isOrgFormComplete = () => {
        return (
            orgFormData.organizationName?.trim() &&
            orgFormData.area?.trim() &&
            orgFormData.govijanasewaniladariname?.trim() &&
            orgFormData.govijanasewaniladariContact?.trim() &&
            orgFormData.letterofProof &&
            orgFormData.establishedDate &&
            true
        );
    };

    const [errors, setErrors] = useState({});
    const [orgErrors, setOrgErrors] = useState({});

    const districts = [ 'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya' ];
    const experienceOptions = [ 'Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10-20 years', 'More than 20 years' ];
    const cultivatedCropsOptions = [ 'Vegetables', 'Grains' ];
    const irrigationOptions = [ 'Rain-fed', 'Drip Irrigation', 'Sprinkler System', 'Flood Irrigation', 'Canal Irrigation', 'Well Water', 'Mixed Systems', 'Other' ];
    const soilTypeOptions = [ 'Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty', 'Chalky', 'Mixed', 'Other' ];
    const gramasewaDivisions = [ { value: 'Colombo 01', label: 'Colombo 01' }, { value: 'Kaduwela', label: 'Kaduwela' }, { value: 'Maharagama', label: 'Maharagama' }, { value: 'Gampaha', label: 'Gampaha' }, { value: 'Negombo', label: 'Negombo' } ];

    const handleInputChange = useCallback((e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    // Organization search handler
    const handleOrgSearchChange = async (e) => {
        // If orgRegistered, do not allow editing
        if (orgRegistered) return;
        const value = e.target.value;
        setOrgSearch(value);
        setFormData(prev => ({ ...prev, organizationId: '' }));
        if (value.length < 2) {
            setOrgOptions([]);
            return;
        }
        setOrgSearchLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/organizations/search?name=${encodeURIComponent(value)}`);
            if (Array.isArray(res.data)) {
                setOrgOptions(res.data);
            } else if (Array.isArray(res.data.organizations)) {
                setOrgOptions(res.data.organizations);
            } else {
                setOrgOptions([]);
            }
        } catch (err) {
            setOrgOptions([]);
        } finally {
            setOrgSearchLoading(false);
        }
    };

    const handleOrgInputChange = useCallback((e) => {
        const { name, value, files } = e.target;
        setOrgFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        if (orgErrors[name]) {
            setOrgErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [orgErrors]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = 'Full name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        if (!formData.district) newErrors.district = 'District is required';
        if (!formData.nic?.trim()) newErrors.nic = 'NIC is required';
        if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        if (!formData.divisionGramasewaNumber) newErrors.divisionGramasewaNumber = 'Division of Gramasewa Niladari is required';
        // Only require organizationId if not orgRegistered
        if (!orgRegistered && !formData.organizationId) newErrors.organizationId = 'Organization selection is required';
        if (!formData.farmingExperience) newErrors.farmingExperience = 'Farming experience is required';
        if (!formData.cultivatedCrops) newErrors.cultivatedCrops = 'Cultivated crops information is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';

        // Enhanced NIC validation
        // New NIC: 12 digits, starts with 19xx or 20xx (birth year)
        // Old NIC: 9 digits + V/v/X/x, starts with 2 digits (birth year)
        const newNICRegex = /^(19|20)\d{2}\d{8}$/;
        const oldNICRegex = /^\d{2}\d{7}[vVxX]$/;
        if (formData.nic) {
            if (newNICRegex.test(formData.nic)) {
                // New NIC: check year is reasonable (1900-2099)
                const year = parseInt(formData.nic.substring(0, 4), 10);
                if (year < 1900 || year > new Date().getFullYear()) {
                    newErrors.nic = 'New NIC: Invalid birth year.';
                }
            } else if (oldNICRegex.test(formData.nic)) {
                // Old NIC: check year is reasonable (assume 19xx)
                const year = parseInt(formData.nic.substring(0, 2), 10);
                const fullYear = year > 30 ? 1900 + year : 2000 + year; // crude cutoff for 2-digit year
                if (fullYear < 1900 || fullYear > new Date().getFullYear()) {
                    newErrors.nic = 'Old NIC: Invalid birth year.';
                }
            } else {
                newErrors.nic = 'NIC must be 12 digits (e.g., 200212345678) or 9 digits + V/X (e.g., 68xxxxxxxV)';
            }
        }

        // Phone number must start with 0 and have 10 digits
        const phoneRegex = /^0[0-9]{9}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number must start with 0 and have 10 digits';
        if (formData.password && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (formData.landSize && (isNaN(formData.landSize) || parseFloat(formData.landSize) <= 0)) newErrors.landSize = 'Please enter a valid land size';
        setErrors(newErrors);

        // Scroll to first error field if any
        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            if (fieldRefs.current[firstErrorField] && fieldRefs.current[firstErrorField].scrollIntoView) {
                fieldRefs.current[firstErrorField].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        return Object.keys(newErrors).length === 0;
    };

    const validateOrgForm = () => {
        const newErrors = {};
        if (!orgFormData.organizationName?.trim()) newErrors.organizationName = 'Organization name is required';
        if (!orgFormData.area?.trim()) newErrors.area = 'Area is required';
        if (!orgFormData.govijanasewaniladariname?.trim()) newErrors.govijanasewaniladariname = 'Govijanasewa Niladari name is required';
        if (!orgFormData.govijanasewaniladariContact?.trim()) newErrors.govijanasewaniladariContact = 'Govijanasewa Niladari contact is required';
        if (!orgFormData.letterofProof) newErrors.letterofProof = 'Letter of proof is required';
        if (!orgFormData.establishedDate) newErrors.establishedDate = 'Established date is required';
        const phoneRegex = /^[0-9]{10}$/;
        if (orgFormData.govijanasewaniladariContact && !phoneRegex.test(orgFormData.govijanasewaniladariContact)) newErrors.govijanasewaniladariContact = 'Please enter a valid 10-digit phone number';
        // removed memberCount validation
        setOrgErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (isOrgFormComplete() && !validateOrgForm()) return;
        setIsLoading(true);
        try {
            let organizationIdToUse = formData.organizationId;
            // If orgRegistered, first register the org and get its id
            if (orgRegistered && orgFormData.organizationName && orgFormData.area) {
                try {
                    const orgData = new FormData();
                    orgData.append('organizationName', orgFormData.organizationName);
                    orgData.append('area', orgFormData.area);
                    orgData.append('govijanasewaniladariname', orgFormData.govijanasewaniladariname);
                    orgData.append('govijanasewaniladariContact', orgFormData.govijanasewaniladariContact);
                    orgData.append('letterofProof', orgFormData.letterofProof);
                    orgData.append('establishedDate', orgFormData.establishedDate);
                    orgData.append('organizationDescription', orgFormData.organizationDescription);
                    // No contactperson_id yet, will be set after farmer is created
                    const orgRes = await axios.post('http://localhost:5000/api/v1/organizations', orgData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    if (orgRes.data && orgRes.data.organization && orgRes.data.organization.id) {
                        organizationIdToUse = orgRes.data.organization.id;
                        setFormData(prev => ({ ...prev, organizationId: organizationIdToUse }));
                    } else if (orgRes.data && orgRes.data.id) {
                        organizationIdToUse = orgRes.data.id;
                        setFormData(prev => ({ ...prev, organizationId: organizationIdToUse }));
                    } else {
                        setErrorMessage('Organization registration failed. Please try again.');
                        setIsLoading(false);
                        return;
                    }
                } catch (orgErr) {
                    setErrorMessage('Organization registration failed. Please try again.');
                    setIsLoading(false);
                    return;
                }
            }
            // Map frontend fields to backend expected fields and ensure required fields are present and valid
            const mappedData = {
                name: formData.name?.trim() || '',
                email: formData.email?.trim() || '',
                password: formData.password,
                contact_number: formData.phoneNumber?.trim() || '',
                district: formData.district?.trim() || '',
                land_size: formData.landSize !== '' && formData.landSize !== null && formData.landSize !== undefined ? Number(formData.landSize) : null,
                nic_number: formData.nic?.trim() || '',
                address: formData.address ?? null,
                profile_image: formData.profileImage ?? null,
                birth_date: formData.birthDate ?? null,
                description: formData.description ?? null,
                division_gramasewa_number: formData.divisionGramasewaNumber ?? null,
                farming_experience: formData.farmingExperience ?? null,
                cultivated_crops: formData.cultivatedCrops ?? null,
                irrigation_system: formData.irrigationSystem ?? null,
                soil_type: formData.soilType ?? null,
                farming_certifications: formData.farmingCertifications ?? null
            };

            // Only append fields that are required and non-empty for backend validation
            const requiredFields = [
                'name', 'email', 'password', 'contact_number', 'district', 'land_size', 'nic_number'
            ];
            for (const field of requiredFields) {
                if (
                    mappedData[field] === undefined ||
                    mappedData[field] === null ||
                    mappedData[field] === ''
                ) {
                    alert(`Field "${field}" is required and missing or invalid.`);
                    setIsLoading(false);
                    return;
                }
            }

            // Prepare form data for file upload, ensuring no undefined/null/empty string values for required fields
            const data = new FormData();
            Object.entries(mappedData).forEach(([key, value]) => {
                // For required fields, always send a value (never undefined/null/empty string)
                if (requiredFields.includes(key)) {
                    data.append(key, value);
                } else {
                    // For optional fields, skip undefined/null/empty string
                    if (value !== undefined && value !== null && value !== '') {
                        data.append(key, value);
                    }
                }
            });
            if (organizationIdToUse) {
                data.append('organization_id', organizationIdToUse);
            }
            let result = null;
            try {
                const response = await axios.post('http://localhost:5000/api/v1/auth/register/farmer', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                result = response.data;
            } catch (err) {
                let text = '';
                if (err.response && err.response.data) {
                    text = typeof err.response.data === 'string' ? err.response.data : (err.response.data.message || JSON.stringify(err.response.data));
                } else if (err.message) {
                    text = err.message;
                }
                setErrorMessage('Registration failed. Please try again. ' + (text || ''));
                setIsLoading(false);
                return;
            }
            if (!result.success) {
                setErrorMessage('Registration failed. Please try again. ' + (result?.message || ''));
                setIsLoading(false);
                return;
            }
            // If orgRegistered, update the org's contactperson_id to the new farmer's user id
            if (orgRegistered && organizationIdToUse && result.data && result.data.user && result.data.user.id) {
                try {
                    await axios.patch(`http://localhost:5000/api/v1/organizations/${organizationIdToUse}/contactperson`, {
                        contactperson_id: result.data.user.id
                    });
                } catch (patchErr) {
                    // Not critical, but log or show warning if needed
                    console.warn('Failed to update organization contact person:', patchErr);
                }
            }
            if (result.data && result.data.user) {
                if (typeof result.data.user === 'object' && result.data.user !== null) {
                    localStorage.setItem('user', JSON.stringify(result.data.user));
                    window.dispatchEvent(new Event('userChanged'));
                }
            }
            setSuccessMessage('Farmer registration successful! Redirecting to Home page...');
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 50);
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error('Registration failed:', error);
            let msg = 'Registration failed. Please try again.';
            if (error.response && error.response.data) {
                let backendMsg = typeof error.response.data === 'string' ? error.response.data : (error.response.data.message || JSON.stringify(error.response.data));
                msg += backendMsg ? (' ' + backendMsg) : '';
            } else if (error.message) {
                msg += ' ' + error.message;
            }
            setErrorMessage(msg.trim());
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to generate random string
    function randomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }



    // No handleOrgSubmit: org registration is now handled after farmer registration

    // Success and error message state
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    if (showOrgForm) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-purple-50 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Building2 className="w-4 h-4" />
                            <span>Organization Committee Registration</span>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-800 to-green-800 bg-clip-text text-transparent mb-4">
                            Register Organization Committee
                        </h1>
                        <p className="text-green-700 max-w-2xl mx-auto">
                            Register your farmer organization committee to continue farmer registration.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                                <Users className="w-6 h-6" />
                                <span>Organization Details</span>
                            </h2>
                        </div>
                        <form className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <OrgInputField icon={Building2} label="Organization Name" name="organizationName" required placeholder="Enter organization name" value={orgFormData.organizationName} error={orgErrors.organizationName} onChange={handleOrgInputChange} />
                                <OrgInputField icon={MapPin} label="Area" name="area" required placeholder="Enter area" value={orgFormData.area} error={orgErrors.area} onChange={handleOrgInputChange} />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <OrgInputField icon={User} label="Govijanasewa Niladari Name" name="govijanasewaniladariname" required placeholder="Enter Govijanasewa Niladari name" value={orgFormData.govijanasewaniladariname} error={orgErrors.govijanasewaniladariname} onChange={handleOrgInputChange} />
                                <OrgInputField icon={Phone} label="Govijanasewa Niladari Contact" name="govijanasewaniladariContact" required placeholder="Enter 10-digit phone number" value={orgFormData.govijanasewaniladariContact} error={orgErrors.govijanasewaniladariContact} onChange={handleOrgInputChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <OrgInputField icon={FileText} label="Letter of Proof" name="letterofProof" type="file" required value={orgFormData.letterofProof} error={orgErrors.letterofProof} onChange={handleOrgInputChange} />
                                <OrgInputField icon={Calendar} label="Established Date" name="establishedDate" type="date" required value={orgFormData.establishedDate} error={orgErrors.establishedDate} onChange={handleOrgInputChange} />
                            </div>
                            {/* removed Member Count field */}
                            <OrgInputField icon={FileText} label="Organization Description" name="organizationDescription" type="textarea" placeholder="Describe your organization's activities and goals" value={orgFormData.organizationDescription} error={orgErrors.organizationDescription} onChange={handleOrgInputChange} />
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Clear org form and go back
                                        setOrgFormData({
                                            organizationName: '',
                                            area: '',
                                            govijanasewaniladariname: '',
                                            govijanasewaniladariContact: '',
                                            letterofProof: null,
                                            establishedDate: '',
                                            organizationDescription: ''
                                        });
                                        setOrgErrors({});
                                        setShowOrgForm(false);
                                    }}
                                    className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span>Back (Clear All)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isOrgFormComplete() && validateOrgForm()) {
                                            // Set orgRegistered and fill orgSearch, lock field
                                            setShowOrgForm(false);
                                            setOrgErrors({});
                                            setOrgRegistered(true);
                                            setOrgRegisteredData({
                                                org_name: orgFormData.organizationName,
                                                org_area: orgFormData.area
                                            });
                                            setOrgSearch(orgFormData.organizationName);
                                            setFormData(prev => ({ ...prev, organizationId: '' }));
                                            setOrgOptions([]);
                                        } else {
                                            setOrgErrors({ ...orgErrors, form: 'Please fill all required fields correctly before confirming.' });
                                        }
                                    }}
                                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
                                >
                                    <Check className="w-5 h-5" />
                                    <span>Confirm</span>
                                </button>
                            </div>
                            {orgErrors.form && (
                                <div className="flex items-center space-x-1 text-red-500 text-sm mt-2">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{orgErrors.form}</span>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <button onClick={() => navigate('/signup')} className="inline-flex bg-green-100 items-center space-x-2 text-green-600 px-4 py-2 rounded-full text-sm hover:text-green-800 mb-4 transition-colors duration-300">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Role Selection</span>
                    </button>
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Sprout className="w-4 h-4" />
                        <span>Farmer Registration</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent mb-4">
                        Join as a Farmer
                    </h1>
                    <p className="text-green-700 max-w-2xl mx-auto">
                        Create your farmer account to access AI-powered farming solutions, crop planning, and marketplace features.
                    </p>
                </div>

                {/* Success and error messages */}
                {(successMessage || errorMessage) && (
                    <div className="max-w-xl mx-auto mb-6">
                        {successMessage && (
                            <div className="flex items-center space-x-2 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl text-center justify-center font-semibold">
                                <Check className="w-5 h-5 text-green-600" />
                                <span>{successMessage}</span>
                            </div>
                        )}
                        {errorMessage && (
                            <div className="flex items-center space-x-2 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl text-center justify-center font-semibold mt-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <span>{errorMessage}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                            <User className="w-6 h-6" />
                            <span>Farmer Registration Form</span>
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* ...existing code... */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Personal Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                        <InputField icon={User} label="Full Name" name="name" type="text" required placeholder="Enter your full name" value={formData.name} error={errors.name} onChange={handleInputChange} inputRef={el => fieldRefs.current['name'] = el} />
                        <InputField icon={Mail} label="Email Address" name="email" type="email" required placeholder="Enter your email address" value={formData.email} error={errors.email} onChange={handleInputChange} inputRef={el => fieldRefs.current['email'] = el} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={MapPin} label="District" name="district" required options={districts} value={formData.district} error={errors.district} onChange={handleInputChange} inputRef={el => fieldRefs.current['district'] = el} />
                                <InputField icon={FileText} label="NIC Number" name="nic" required placeholder="Enter NIC number" value={formData.nic} error={errors.nic} onChange={handleInputChange} inputRef={el => fieldRefs.current['nic'] = el} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Phone} label="Phone Number" name="phoneNumber" required placeholder="Enter 10-digit phone number" value={formData.phoneNumber} error={errors.phoneNumber} onChange={handleInputChange} inputRef={el => fieldRefs.current['phoneNumber'] = el} />
                            </div>
                            <InputField icon={Home} label="Address" name="address" type="textarea" placeholder="Enter your complete address" value={formData.address} error={errors.address} onChange={handleInputChange} inputRef={el => fieldRefs.current['address'] = el} />
                            <div className="grid md:grid-cols-2 gap-6">
                            <InputField icon={Camera} label="Profile Image" name="profileImage" type="file" value={formData.profileImage} error={errors.profileImage} onChange={handleInputChange} inputRef={el => fieldRefs.current['profileImage'] = el} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Farming Experience & Background</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Clock} label="Farming Experience" name="farmingExperience" required options={experienceOptions} value={formData.farmingExperience} error={errors.farmingExperience} onChange={handleInputChange} inputRef={el => fieldRefs.current['farmingExperience'] = el} />
                                <InputField icon={Sprout} label="Land Size (acres)" name="landSize" type="number" step="0.01" placeholder="Enter land size in acres" value={formData.landSize} error={errors.landSize} onChange={handleInputChange} inputRef={el => fieldRefs.current['landSize'] = el} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Leaf} label="Cultivated Crops" name="cultivatedCrops" required options={cultivatedCropsOptions} value={formData.cultivatedCrops} error={errors.cultivatedCrops} onChange={handleInputChange} inputRef={el => fieldRefs.current['cultivatedCrops'] = el} />
                                <InputField icon={MapPin} label="Irrigation System" name="irrigationSystem" options={irrigationOptions} value={formData.irrigationSystem} error={errors.irrigationSystem} onChange={handleInputChange} inputRef={el => fieldRefs.current['irrigationSystem'] = el} />
                            </div>
                            <InputField icon={Leaf} label="Soil Type" name="soilType" options={soilTypeOptions} value={formData.soilType} error={errors.soilType} onChange={handleInputChange} inputRef={el => fieldRefs.current['soilType'] = el} />
                            <InputField icon={FileText} label="Farming Description" name="description" type="textarea" placeholder="Tell us about your farming experience, interests, and current practices" value={formData.description} error={errors.description} onChange={handleInputChange} inputRef={el => fieldRefs.current['description'] = el} />
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Professional Development</h3>
                            <InputField icon={Award} label="Farming Certifications" name="farmingCertifications" placeholder="e.g., Organic certification, GAP certification" value={formData.farmingCertifications} error={errors.farmingCertifications} onChange={handleInputChange} inputRef={el => fieldRefs.current['farmingCertifications'] = el} />
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Security Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Lock} label="Password" name="password" type="password" required placeholder="Enter password (min 8 characters)" value={formData.password} error={errors.password} onChange={handleInputChange} showPassword={showPassword} onTogglePassword={() => setShowPassword(p => !p)} inputRef={el => fieldRefs.current['password'] = el} />
                                <InputField icon={Lock} label="Confirm Password" name="confirmPassword" type="password" required placeholder="Confirm your password" value={formData.confirmPassword} error={errors.confirmPassword} onChange={handleInputChange} showPassword={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(p => !p)} inputRef={el => fieldRefs.current['confirmPassword'] = el} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Administrative Details</h3>
                            <InputField icon={MapPin} label="Division of Gramasewa Niladari" name="divisionGramasewaNumber" required placeholder="Search your Gramasewa Niladari division" options={gramasewaDivisions} isSearchable={true} value={formData.divisionGramasewaNumber} error={errors.divisionGramasewaNumber} onChange={handleInputChange} inputRef={el => fieldRefs.current['divisionGramasewaNumber'] = el} />
                        <div className="space-y-2">
                            {/* Organization search field */}
                            <label className="flex items-center space-x-2 text-sm font-medium text-green-800">
                                <Users className="w-4 h-4" />
                                <span>Organization <span className="text-red-500">*</span></span>
                            </label>
                            <input
                                type="text"
                                name="organizationSearch"
                                value={orgSearch}
                                onChange={handleOrgSearchChange}
                                placeholder="Search organization by name..."
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100 ${errors.organizationId ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'}`}
                                autoComplete="off"
                                readOnly={orgRegistered}
                            />
                            {orgSearchLoading && <div className="text-green-700 text-xs">Searching...</div>}
                            {!orgRegistered && orgOptions.length > 0 && (
                                <div className="border border-green-200 rounded-xl bg-white shadow-md mt-1 max-h-56 overflow-y-auto z-10 relative">
                                    {orgOptions.map(org => (
                                        <div
                                            key={org.id}
                                            className={`px-4 py-2 cursor-pointer hover:bg-green-50 ${formData.organizationId === org.id ? 'bg-green-100' : ''}`}
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, organizationId: org.id }));
                                                setOrgSearch(org.org_name);
                                                setOrgOptions([]);
                                                if (errors.organizationId) setErrors(prev => ({ ...prev, organizationId: '' }));
                                            }}
                                        >
                                            <div className="font-semibold text-green-900">{org.org_name}</div>
                                            <div className="text-xs text-green-700">
                                                Area: {org.org_area}
                                                {org.contactperson_name && (
                                                    <>
                                                        {" | Contact Person: "}
                                                        <span className="font-medium">{org.contactperson_name}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {formData.organizationId && orgSearch && (
                                <div className="text-green-700 text-xs mt-1">Selected: {orgSearch}</div>
                            )}
                            {errors.organizationId && (
                                <div className="flex items-center space-x-1 text-red-500 text-sm mt-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{errors.organizationId}</span>
                                </div>
                            )}
                            <div className="text-center mt-2">
                                <button type="button" onClick={() => setShowOrgForm(true)} className="text-green-600 hover:text-green-800 text-sm font-medium underline transition-colors duration-300">
                                    Can't find your organization? Register here
                                </button>
                            </div>
                        </div>
                        </div>

                        <div className="pt-6">
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50">
                                {isLoading ? ( <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Creating Account...</span></> ) : ( <><Check className="w-5 h-5" /><span>Create Farmer Account</span></> )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FarmerSignup;