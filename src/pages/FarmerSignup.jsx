import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // Import react-select
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
                />
            ) : options ? (
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

    // Main farmer form data
    const [formData, setFormData] = useState({
        fullName: '',
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
        organizationCommitteeNumber: '',
        farmingExperience: '',
        cultivatedCrops: '',
        irrigationSystem: '',
        soilType: '',
        farmingCertifications: ''
    });

    // Organization committee form data
    const [orgFormData, setOrgFormData] = useState({
        organizationName: '',
        govijanasewaniladariname: '',
        govijanasewaniladariContact: '',
        letterofProof: null,
        establishedDate: '',
        memberCount: '',
        organizationDescription: ''
    });

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
        if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        if (!formData.district) newErrors.district = 'District is required';
        if (!formData.nic?.trim()) newErrors.nic = 'NIC is required';
        if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        if (!formData.divisionGramasewaNumber) newErrors.divisionGramasewaNumber = 'Division of Gramasewa Niladari is required';
        if (!formData.organizationCommitteeNumber?.trim()) newErrors.organizationCommitteeNumber = 'Organization committee number is required';
        if (!formData.farmingExperience) newErrors.farmingExperience = 'Farming experience is required';
        if (!formData.cultivatedCrops) newErrors.cultivatedCrops = 'Cultivated crops information is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
        const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
        if (formData.nic && !nicRegex.test(formData.nic)) newErrors.nic = 'Please enter a valid NIC number';
        const phoneRegex = /^[0-9]{10}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        if (formData.password && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (formData.landSize && (isNaN(formData.landSize) || parseFloat(formData.landSize) <= 0)) newErrors.landSize = 'Please enter a valid land size';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOrgForm = () => {
        const newErrors = {};
        if (!orgFormData.organizationName?.trim()) newErrors.organizationName = 'Organization name is required';
        if (!orgFormData.govijanasewaniladariname?.trim()) newErrors.govijanasewaniladariname = 'Govijanasewa Niladari name is required';
        if (!orgFormData.govijanasewaniladariContact?.trim()) newErrors.govijanasewaniladariContact = 'Govijanasewa Niladari contact is required';
        if (!orgFormData.letterofProof) newErrors.letterofProof = 'Letter of proof is required';
        if (!orgFormData.establishedDate) newErrors.establishedDate = 'Established date is required';
        const phoneRegex = /^[0-9]{10}$/;
        if (orgFormData.govijanasewaniladariContact && !phoneRegex.test(orgFormData.govijanasewaniladariContact)) newErrors.govijanasewaniladariContact = 'Please enter a valid 10-digit phone number';
        if (orgFormData.memberCount && (isNaN(orgFormData.memberCount) || parseInt(orgFormData.memberCount) <= 0)) newErrors.memberCount = 'Please enter a valid member count';
        setOrgErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Farmer registration data:', formData);
            alert('Farmer registration successful!');
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
                            Register your farmer organization committee to get a committee number for farmer registration.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                                <Users className="w-6 h-6" />
                                <span>Organization Details</span>
                            </h2>
                        </div>
                        <form onSubmit={handleOrgSubmit} className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <OrgInputField icon={Building2} label="Organization Name" name="organizationName" required placeholder="Enter organization name" value={orgFormData.organizationName} error={orgErrors.organizationName} onChange={handleOrgInputChange} />
                                <OrgInputField icon={User} label="Govijanasewa Niladari Name" name="govijanasewaniladariname" required placeholder="Enter Govijanasewa Niladari name" value={orgFormData.govijanasewaniladariname} error={orgErrors.govijanasewaniladariname} onChange={handleOrgInputChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <OrgInputField icon={Phone} label="Govijanasewa Niladari Contact" name="govijanasewaniladariContact" required placeholder="Enter 10-digit phone number" value={orgFormData.govijanasewaniladariContact} error={orgErrors.govijanasewaniladariContact} onChange={handleOrgInputChange} />
                                <OrgInputField icon={FileText} label="Letter of Proof" name="letterofProof" type="file" required value={orgFormData.letterofProof} error={orgErrors.letterofProof} onChange={handleOrgInputChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <OrgInputField icon={Calendar} label="Established Date" name="establishedDate" type="date" required value={orgFormData.establishedDate} error={orgErrors.establishedDate} onChange={handleOrgInputChange} />
                                <OrgInputField icon={Users} label="Member Count" name="memberCount" type="number" placeholder="Enter number of members" value={orgFormData.memberCount} error={orgErrors.memberCount} onChange={handleOrgInputChange} />
                            </div>
                            <OrgInputField icon={FileText} label="Organization Description" name="organizationDescription" type="textarea" placeholder="Describe your organization's activities and goals" value={orgFormData.organizationDescription} error={orgErrors.organizationDescription} onChange={handleOrgInputChange} />
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button type="button" onClick={() => setShowOrgForm(false)} className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                                    <ArrowLeft className="w-5 h-5" />
                                    <span>Back to Farmer Registration</span>
                                </button>
                                <button type="submit" disabled={isLoading} className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50">
                                    {isLoading ? ( <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Registering Organization...</span></> ) : ( <><Check className="w-5 h-5" /><span>Register Organization</span></> )}
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

                <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                            <User className="w-6 h-6" />
                            <span>Farmer Registration Form</span>
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Personal Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={User} label="Full Name" name="fullName" type="text" required placeholder="Enter your full name" value={formData.fullName} error={errors.fullName} onChange={handleInputChange} />
                                <InputField icon={Mail} label="Email Address" name="email" type="email" required placeholder="Enter your email address" value={formData.email} error={errors.email} onChange={handleInputChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={MapPin} label="District" name="district" required options={districts} value={formData.district} error={errors.district} onChange={handleInputChange} />
                                <InputField icon={FileText} label="NIC Number" name="nic" required placeholder="Enter NIC number" value={formData.nic} error={errors.nic} onChange={handleInputChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Phone} label="Phone Number" name="phoneNumber" required placeholder="Enter 10-digit phone number" value={formData.phoneNumber} error={errors.phoneNumber} onChange={handleInputChange} />
                            </div>
                            <InputField icon={Home} label="Address" name="address" type="textarea" placeholder="Enter your complete address" value={formData.address} error={errors.address} onChange={handleInputChange} />
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Camera} label="Profile Image" name="profileImage" type="file" value={formData.profileImage} error={errors.profileImage} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Farming Experience & Background</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Clock} label="Farming Experience" name="farmingExperience" required options={experienceOptions} value={formData.farmingExperience} error={errors.farmingExperience} onChange={handleInputChange} />
                                <InputField icon={Sprout} label="Land Size (acres)" name="landSize" type="number" step="0.01" placeholder="Enter land size in acres" value={formData.landSize} error={errors.landSize} onChange={handleInputChange} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Leaf} label="Cultivated Crops" name="cultivatedCrops" required options={cultivatedCropsOptions} value={formData.cultivatedCrops} error={errors.cultivatedCrops} onChange={handleInputChange} />
                                <InputField icon={MapPin} label="Irrigation System" name="irrigationSystem" options={irrigationOptions} value={formData.irrigationSystem} error={errors.irrigationSystem} onChange={handleInputChange} />
                            </div>
                            <InputField icon={Leaf} label="Soil Type" name="soilType" options={soilTypeOptions} value={formData.soilType} error={errors.soilType} onChange={handleInputChange} />
                            <InputField icon={FileText} label="Farming Description" name="description" type="textarea" placeholder="Tell us about your farming experience, interests, and current practices" value={formData.description} error={errors.description} onChange={handleInputChange} />
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Professional Development</h3>
                            <InputField icon={Award} label="Farming Certifications" name="farmingCertifications" placeholder="e.g., Organic certification, GAP certification" value={formData.farmingCertifications} error={errors.farmingCertifications} onChange={handleInputChange} />
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Security Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Lock} label="Password" name="password" type="password" required placeholder="Enter password (min 8 characters)" value={formData.password} error={errors.password} onChange={handleInputChange} showPassword={showPassword} onTogglePassword={() => setShowPassword(p => !p)} />
                                <InputField icon={Lock} label="Confirm Password" name="confirmPassword" type="password" required placeholder="Confirm your password" value={formData.confirmPassword} error={errors.confirmPassword} onChange={handleInputChange} showPassword={showConfirmPassword} onTogglePassword={() => setShowConfirmPassword(p => !p)} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Administrative Details</h3>
                            <InputField icon={MapPin} label="Division of Gramasewa Niladari" name="divisionGramasewaNumber" required placeholder="Search your Gramasewa Niladari division" options={gramasewaDivisions} isSearchable={true} value={formData.divisionGramasewaNumber} error={errors.divisionGramasewaNumber} onChange={handleInputChange} />
                            <div className="space-y-2">
                                <InputField icon={Users} label="Organization Committee Number" name="organizationCommitteeNumber" required placeholder="Enter organization committee number" value={formData.organizationCommitteeNumber} error={errors.organizationCommitteeNumber} onChange={handleInputChange} />
                                <div className="text-center">
                                    <button type="button" onClick={() => setShowOrgForm(true)} className="text-green-600 hover:text-green-800 text-sm font-medium underline transition-colors duration-300">
                                        Don't have an organization committee number? Register here
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