import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    User, Mail, MapPin, Phone, FileText, Camera, Lock, Eye, EyeOff, ArrowLeft, Check, AlertCircle, Link as LinkIcon, IdCard
} from 'lucide-react';

const InputField = React.memo(({
    icon,
    label,
    name,
    type = 'text',
    required = false,
    options = null,
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
            {options ? (
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
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
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
                        accept="image/*"
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
                            {value ? value.name : 'Choose profile image'}
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

const ModeratorSignup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const fieldRefs = React.useRef({});
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        district: '',
        nic: '',
        address: '',
        phoneNumber: '',
        profileImage: null,
        password: '',
        confirmPassword: '',
        skillUrls: [''],
        workerIds: [''],
        skillDescription: '', // Optional description for skill demonstration
    });
    const [errors, setErrors] = useState({});
    const districts = [
        'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
        'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
        'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
        'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
    ];
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
    // For dynamic skill URLs and worker IDs
    const handleArrayChange = (type, idx, val) => {
        setFormData(prev => {
            const arr = [...prev[type]];
            arr[idx] = val;
            return { ...prev, [type]: arr };
        });
    };
    const addArrayField = (type) => {
        setFormData(prev => ({ ...prev, [type]: [...prev[type], ''] }));
    };
    const removeArrayField = (type, idx) => {
        setFormData(prev => {
            const arr = [...prev[type]];
            arr.splice(idx, 1);
            return { ...prev, [type]: arr.length ? arr : [''] };
        });
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        if (!formData.district) newErrors.district = 'District is required';
        if (!formData.nic?.trim()) newErrors.nic = 'NIC is required';
        if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        // At least one skill URL
        if (!formData.skillUrls.some(url => url && url.trim())) newErrors.skillUrls = 'At least one skill URL is required';
        // Validate URLs
        formData.skillUrls.forEach((url, idx) => {
            if (url && !/^https?:\/\//.test(url)) {
                newErrors[`skillUrls_${idx}`] = 'Enter a valid URL (http/https)';
            }
        });
        // Validate worker IDs (optional, but if present, must be non-empty)
        formData.workerIds.forEach((id, idx) => {
            if (id && !/^\w+$/.test(id)) {
                newErrors[`workerIds_${idx}`] = 'Worker ID must be alphanumeric';
            }
        });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
        const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
        if (formData.nic && !nicRegex.test(formData.nic)) newErrors.nic = 'Please enter a valid NIC number';
        const phoneRegex = /^[0-9]{10}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        if (formData.password && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        // No validation for skillDescription (optional)
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            const firstErrorField = Object.keys(newErrors)[0];
            if (fieldRefs.current[firstErrorField] && fieldRefs.current[firstErrorField].scrollIntoView) {
                fieldRefs.current[firstErrorField].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        if (!validateForm()) return;
        setIsLoading(true);
        // Map frontend fields to backend expected fields
        const mappedData = {
            full_name: formData.fullName?.trim() || '',
            email: formData.email?.trim() || '',
            password: formData.password,
            phone_number: formData.phoneNumber?.trim() || '',
            district: formData.district?.trim() || '',
            nic: formData.nic?.trim() || '',
            address: formData.address ?? null,
            profile_image: formData.profileImage ?? null,
            // Skill demonstration fields
            skill_urls: formData.skillUrls.filter(url => url && url.trim()),
            worker_ids: formData.workerIds.filter(id => id && id.trim()),
            skill_description: formData.skillDescription?.trim() || '',
        };

        // Only append fields that are required and non-empty for backend validation
        const requiredFields = [
            'full_name', 'email', 'password', 'phone_number', 'district', 'nic'
        ];
        const data = new FormData();
        Object.entries(mappedData).forEach(([key, value]) => {
            if (['skill_urls', 'worker_ids'].includes(key)) {
                // Send arrays as repeated fields (backend should expect skill_urls[], worker_ids[])
                value.forEach((v) => data.append(`${key}[]`, v));
            } else if (requiredFields.includes(key)) {
                data.append(key, value);
            } else {
                if (value !== undefined && value !== null && value !== '') {
                    data.append(key, value);
                }
            }
        });

        try {
            // Register moderator (backend now handles disable_accounts logic)
            const response = await axios.post('http://localhost:5000/api/v1/auth/register/moderator', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const result = response.data;
            if (!result.success) {
                let msg = result.message || 'Registration failed. Please try again.';
                setErrorMessage(msg);
                setIsLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            if (result.data && result.data.user) {
                localStorage.setItem('user', JSON.stringify(result.data.user));
                window.dispatchEvent(new Event('userChanged'));
            }
            setSuccessMessage('Registration successful! Your account will be reviewed and activated as appropriate. You will be able to log in once your account is approved. Redirecting to login page...');
            setErrorMessage("");
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => navigate('/login'), 20000);
        } catch (error) {
            let msg = 'Registration failed. Please try again.';
            if (error.response && error.response.data) {
                let backendMsg = typeof error.response.data === 'string' ? error.response.data : (error.response.data.message || JSON.stringify(error.response.data));
                msg += backendMsg ? (' ' + backendMsg) : '';
            } else if (error.message) {
                msg += ' ' + error.message;
            }
            setErrorMessage(msg.trim());
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/signup')}
                        className="inline-flex bg-green-100 items-center space-x-2 text-green-600 hover:text-green-800 mb-4 transition-colors duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Role Selection</span>
                    </button>
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <User className="w-4 h-4" />
                        <span>Moderator Registration</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent mb-4">
                        Join as a Content Moderator
                    </h1>
                    <p className="text-green-700 max-w-2xl mx-auto">
                        Register to help manage and create content for the Agrovia platform. Please provide links to your previous work and any worker IDs if available.
                    </p>
                </div>
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
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span>{errorMessage}</span>
                            </div>
                        )}
                    </div>
                )}
                <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                            <User className="w-6 h-6" />
                            <span>Moderator Registration Form</span>
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Personal Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={User} label="Full Name" name="fullName" type="text" required placeholder="Enter your full name" value={formData.fullName} error={errors.fullName} onChange={handleInputChange} inputRef={el => fieldRefs.current['fullName'] = el} />
                                <InputField icon={Mail} label="Email Address" name="email" type="email" required placeholder="Enter your email address" value={formData.email} error={errors.email} onChange={handleInputChange} inputRef={el => fieldRefs.current['email'] = el} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={MapPin} label="District" name="district" required options={districts} value={formData.district} error={errors.district} onChange={handleInputChange} inputRef={el => fieldRefs.current['district'] = el} />
                                <InputField icon={FileText} label="NIC Number" name="nic" required placeholder="Enter NIC number" value={formData.nic} error={errors.nic} onChange={handleInputChange} inputRef={el => fieldRefs.current['nic'] = el} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Phone} label="Phone Number" name="phoneNumber" required placeholder="Enter 10-digit phone number" value={formData.phoneNumber} error={errors.phoneNumber} onChange={handleInputChange} inputRef={el => fieldRefs.current['phoneNumber'] = el} />
                            </div>
                            <InputField icon={FileText} label="Address" name="address" type="textarea" placeholder="Enter your complete address" value={formData.address} error={errors.address} onChange={handleInputChange} inputRef={el => fieldRefs.current['address'] = el} />
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Camera} label="Profile Image" name="profileImage" type="file" value={formData.profileImage} error={errors.profileImage} onChange={handleInputChange} inputRef={el => fieldRefs.current['profileImage'] = el} />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Skill Demonstration</h3>
                            {/* Optional description section */}
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-green-800">
                                    <FileText className="w-4 h-4" />
                                    <span>Skill Demonstration Description <span className="text-gray-400">(optional)</span></span>
                                </label>
                                <textarea
                                    name="skillDescription"
                                    value={formData.skillDescription}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Describe your content writing, moderation, or other relevant skills..."
                                    className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 resize-none bg-slate-100 border-green-200 focus:border-green-400"
                                    ref={el => fieldRefs.current['skillDescription'] = el}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-green-800">
                                    <LinkIcon className="w-4 h-4" />
                                    <span>Previous Work URLs <span className="text-red-500">*</span></span>
                                </label>
                                {formData.skillUrls.map((url, idx) => (
                                    <div key={idx} className="flex items-center gap-2 mb-2">
                                        <input
                                            type="url"
                                            name={`skillUrls_${idx}`}
                                            value={url}
                                            onChange={e => handleArrayChange('skillUrls', idx, e.target.value)}
                                            placeholder="https://your-portfolio-or-article.com"
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100 ${errors[`skillUrls_${idx}`] || errors.skillUrls ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'}`}
                                            ref={el => fieldRefs.current[`skillUrls_${idx}`] = el}
                                        />
                                        {formData.skillUrls.length > 1 && (
                                            <button type="button" onClick={() => removeArrayField('skillUrls', idx)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addArrayField('skillUrls')} className="text-green-700 hover:underline text-sm">+ Add another URL</button>
                                {(errors.skillUrls || formData.skillUrls.some((_, idx) => errors[`skillUrls_${idx}`])) && (
                                    <div className="flex items-center space-x-1 text-red-500 text-sm mt-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.skillUrls || formData.skillUrls.map((_, idx) => errors[`skillUrls_${idx}`]).filter(Boolean).join(', ')}</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 text-sm font-medium text-green-800">
                                    <IdCard className="w-4 h-4" />
                                    <span>Worker IDs (if any)</span>
                                </label>
                                {formData.workerIds.map((id, idx) => (
                                    <div key={idx} className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            name={`workerIds_${idx}`}
                                            value={id}
                                            onChange={e => handleArrayChange('workerIds', idx, e.target.value)}
                                            placeholder="Enter worker ID"
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100 ${errors[`workerIds_${idx}`] ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'}`}
                                            ref={el => fieldRefs.current[`workerIds_${idx}`] = el}
                                        />
                                        {formData.workerIds.length > 1 && (
                                            <button type="button" onClick={() => removeArrayField('workerIds', idx)} className="text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={() => addArrayField('workerIds')} className="text-green-700 hover:underline text-sm">+ Add another Worker ID</button>
                                {formData.workerIds.some((_, idx) => errors[`workerIds_${idx}`]) && (
                                    <div className="flex items-center space-x-1 text-red-500 text-sm mt-1">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{formData.workerIds.map((_, idx) => errors[`workerIds_${idx}`]).filter(Boolean).join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Security Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Lock} label="Password" name="password" type="password" required placeholder="Enter password (min 8 characters)" value={formData.password} error={errors.password} onChange={handleInputChange} showPassword={showPassword} onTogglePassword={() => setShowPassword(p => !p)} inputRef={el => fieldRefs.current['password'] = el} />
                                <InputField icon={Lock} label="Confirm Password" name="confirmPassword" type="password" required placeholder="Confirm your password" value={formData.confirmPassword} error={errors.confirmPassword} onChange={handleInputChange} showPassword={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(p => !p)} inputRef={el => fieldRefs.current['confirmPassword'] = el} />
                            </div>
                        </div>
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        <span>Create Moderator Account</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModeratorSignup;
