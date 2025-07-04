import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

// --- Corrected InputField Component (Moved Outside) ---
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
const OrgInputField = React.memo(({ icon, label, name, type = 'text', required = false, value, error, onChange, ...props }) => {
    return (
        <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-blue-800">
                {icon && React.createElement(icon, { className: "w-4 h-4" })}
                <span>{label} {required && <span className="text-red-500">*</span>}</span>
            </label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    rows={3}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none bg-slate-100 ${
                        error ? 'border-red-500 bg-red-50' : 'border-blue-200 focus:border-blue-400'
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
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-slate-100 ${
                        error ? 'border-red-500 bg-red-50' : 'border-blue-200 focus:border-blue-400'
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

const BuyerSignup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOrgForm, setShowOrgForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        district: '',
        companyName: '',
        companyType: '',
        companyAddress: '',
        phoneNumber: '',
        profileImage: null,
        password: '',
        confirmPassword: '',
        organizationCommitteeNumber: '',
        paymentOffer: '',
    });

    // Organization committee form data
    const [orgFormData, setOrgFormData] = useState({
        organizationName: '', registrationNumber: '', chairpersonName: '',
        chairpersonContact: '', secretaryName: '', secretaryContact: '',
        treasurerName: '', treasurerContact: '', organizationAddress: '',
        establishedDate: '', memberCount: '', organizationDescription: ''
    });

    const [errors, setErrors] = useState({});
    const [orgErrors, setOrgErrors] = useState({});

    const districts = [
        'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
        'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
        'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
        'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
    ];

    const companyTypes = [
        'Retailer', 'Wholesaler', 'Exporter', 'Processor', 'Supermarket', 'Restaurant', 'Other'
    ];

    const handleInputChange = useCallback((e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    }, [errors]);

    const handleOrgInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setOrgFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (orgErrors[name]) {
            setOrgErrors(prev => ({ ...prev, [name]: null }));
        }
    }, [orgErrors]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
        if (!formData.district) newErrors.district = 'District is required';
        if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
        else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        if (showOrgForm && !formData.organizationCommitteeNumber?.trim()) newErrors.organizationCommitteeNumber = 'Organization committee number is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        }
        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOrgForm = () => {
        const newErrors = {};
        if (!orgFormData.organizationName?.trim()) newErrors.organizationName = 'Organization name is required';
        if (!orgFormData.registrationNumber?.trim()) newErrors.registrationNumber = 'Registration number is required';
        if (!orgFormData.chairpersonName?.trim()) newErrors.chairpersonName = 'Chairperson name is required';
        if (!orgFormData.chairpersonContact?.trim()) newErrors.chairpersonContact = 'Chairperson contact is required';
        if (!orgFormData.secretaryName?.trim()) newErrors.secretaryName = 'Secretary name is required';
        if (!orgFormData.secretaryContact?.trim()) newErrors.secretaryContact = 'Secretary contact is required';
        if (!orgFormData.organizationAddress?.trim()) newErrors.organizationAddress = 'Organization address is required';
        if (!orgFormData.establishedDate) newErrors.establishedDate = 'Established date is required';
        const phoneRegex = /^[0-9]{10}$/;
        if (orgFormData.chairpersonContact && !phoneRegex.test(orgFormData.chairpersonContact)) {
            newErrors.chairpersonContact = 'Please enter a valid 10-digit phone number';
        }
        if (orgFormData.secretaryContact && !phoneRegex.test(orgFormData.secretaryContact)) {
            newErrors.secretaryContact = 'Please enter a valid 10-digit phone number';
        }
        if (orgFormData.treasurerContact && orgFormData.treasurerContact && !phoneRegex.test(orgFormData.treasurerContact)) {
            newErrors.treasurerContact = 'Please enter a valid 10-digit phone number';
        }
        if (orgFormData.memberCount && (isNaN(orgFormData.memberCount) || parseInt(orgFormData.memberCount) <= 0)) {
            newErrors.memberCount = 'Please enter a valid member count';
        }
        setOrgErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Buyer registration data:', formData);
            alert('Buyer registration successful!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOrgSubmit = async (e) => {
        e.preventDefault();
        if (!validateOrgForm()) return;
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Organization registration data:', orgFormData);
            const newCommitteeNumber = `ORG${Date.now()}`;
            setFormData(prev => ({ ...prev, organizationCommitteeNumber: newCommitteeNumber }));
            alert(`Organization registered successfully! Your committee number is: ${newCommitteeNumber}`);
            setShowOrgForm(false);
        } catch (error) {
            console.error('Organization registration failed:', error);
            alert('Organization registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (showOrgForm) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Building2 className="w-4 h-4" />
                            <span>Organization Committee Registration</span>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                            Register Organization Committee
                        </h1>
                        <p className="text-blue-700 max-w-2xl mx-auto">
                            Register your buyer organization committee to get a committee number for buyer registration.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-blue-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                                <Users className="w-6 h-6" />
                                <span>Organization Details</span>
                            </h2>
                        </div>
                        <form onSubmit={handleOrgSubmit} className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <OrgInputField icon={Building2} label="Organization Name" name="organizationName" required placeholder="Enter organization name" value={orgFormData.organizationName} error={orgErrors.organizationName} onChange={handleOrgInputChange} />
                                <OrgInputField icon={FileText} label="Registration Number" name="registrationNumber" required placeholder="Enter registration number" value={orgFormData.registrationNumber} error={orgErrors.registrationNumber} onChange={handleOrgInputChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <OrgInputField icon={User} label="Chairperson Name" name="chairpersonName" required placeholder="Enter chairperson name" value={orgFormData.chairpersonName} error={orgErrors.chairpersonName} onChange={handleOrgInputChange} />
                                <OrgInputField icon={Phone} label="Chairperson Contact" name="chairpersonContact" required placeholder="Enter 10-digit phone number" value={orgFormData.chairpersonContact} error={orgErrors.chairpersonContact} onChange={handleOrgInputChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <OrgInputField icon={User} label="Secretary Name" name="secretaryName" required placeholder="Enter secretary name" value={orgFormData.secretaryName} error={orgErrors.secretaryName} onChange={handleOrgInputChange} />
                                <OrgInputField icon={Phone} label="Secretary Contact" name="secretaryContact" required placeholder="Enter 10-digit phone number" value={orgFormData.secretaryContact} error={orgErrors.secretaryContact} onChange={handleOrgInputChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <OrgInputField icon={User} label="Treasurer Name" name="treasurerName" placeholder="Enter treasurer name (optional)" value={orgFormData.treasurerName} error={orgErrors.treasurerName} onChange={handleOrgInputChange} />
                                <OrgInputField icon={Phone} label="Treasurer Contact" name="treasurerContact" placeholder="Enter 10-digit phone number (optional)" value={orgFormData.treasurerContact} error={orgErrors.treasurerContact} onChange={handleOrgInputChange} />
                            </div>
                            <OrgInputField icon={Home} label="Organization Address" name="organizationAddress" type="textarea" required placeholder="Enter complete organization address" value={orgFormData.organizationAddress} error={orgErrors.organizationAddress} onChange={handleOrgInputChange} />
                            <div className="grid md:grid-cols-2 gap-6">
                                <OrgInputField icon={Calendar} label="Established Date" name="establishedDate" type="date" required value={orgFormData.establishedDate} error={orgErrors.establishedDate} onChange={handleOrgInputChange} />
                                <OrgInputField icon={Users} label="Member Count" name="memberCount" type="number" placeholder="Enter number of members" value={orgFormData.memberCount} error={orgErrors.memberCount} onChange={handleOrgInputChange} />
                            </div>
                            <OrgInputField icon={FileText} label="Organization Description" name="organizationDescription" type="textarea" placeholder="Describe your organization's activities and goals" value={orgFormData.organizationDescription} error={orgErrors.organizationDescription} onChange={handleOrgInputChange} />
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button type="button" onClick={() => setShowOrgForm(false)} className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                                    <ArrowLeft className="w-5 h-5" />
                                    <span>Back to Buyer Registration</span>
                                </button>
                                <button type="submit" disabled={isLoading} className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50">
                                    {isLoading ? (
                                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Registering Organization...</span></>
                                    ) : (
                                        <><Check className="w-5 h-5" /><span>Register Organization</span></>
                                    )}
                                </button>
                            </div>
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
                    <button onClick={() => navigate('/signup')} className="inline-flex bg-green-100 items-center space-x-2 text-green-600 hover:text-green-800 mb-4 transition-colors duration-300">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Role Selection</span>
                    </button>
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Sprout className="w-4 h-4" />
                        <span>Buyer Registration</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent mb-4">
                        Join as a Buyer
                    </h1>
                    <p className="text-green-700 max-w-2xl mx-auto">
                        Create your buyer account to access the marketplace, connect with farmers, and make payment offers.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                            <User className="w-6 h-6" />
                            <span>Buyer Registration Form</span>
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">
                                Personal & Company Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={User} label="Full Name" name="fullName" type="text" required placeholder="Enter your full name" value={formData.fullName} error={errors.fullName} onChange={handleInputChange} />
                                <InputField icon={Mail} label="Email Address" name="email" type="email" required placeholder="Enter your email address" value={formData.email} error={errors.email} onChange={handleInputChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={MapPin} label="District" name="district" required options={districts} value={formData.district} error={errors.district} onChange={handleInputChange} />
                                <InputField icon={FileText} label="Company Name" name="companyName" placeholder="Enter your company name" value={formData.companyName} error={errors.companyName} onChange={handleInputChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Building2} label="Company Type" name="companyType" options={companyTypes} value={formData.companyType} error={errors.companyType} onChange={handleInputChange} />
                                <InputField icon={Phone} label="Phone Number" name="phoneNumber" required placeholder="Enter 10-digit phone number" value={formData.phoneNumber} error={errors.phoneNumber} onChange={handleInputChange} />
                            </div>
                            <InputField icon={Home} label="Company Address" name="companyAddress" type="textarea" placeholder="Enter your complete company address" value={formData.companyAddress} error={errors.companyAddress} onChange={handleInputChange} />
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Camera} label="Profile Image" name="profileImage" type="file" value={formData.profileImage} error={errors.profileImage} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">
                                Security Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Lock} label="Password" name="password" type="password" required placeholder="Enter password (min 8 characters)" value={formData.password} error={errors.password} onChange={handleInputChange} showPassword={showPassword} onTogglePassword={() => setShowPassword(p => !p)} />
                                <InputField icon={Lock} label="Confirm Password" name="confirmPassword" type="password" required placeholder="Confirm your password" value={formData.confirmPassword} error={errors.confirmPassword} onChange={handleInputChange} showPassword={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(p => !p)} />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50">
                                {isLoading ? (
                                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Creating Account...</span></>
                                ) : (
                                    <><Check className="w-5 h-5" /><span>Create Buyer Account</span></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BuyerSignup;