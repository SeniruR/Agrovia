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
    DollarSign,
} from 'lucide-react';

// --- Helper Components (Defined Outside) ---

const InputField = React.memo(({ icon, label, name, type = 'text', required = false, options = null, value, onChange, error, showPassword, onPasswordToggle, ...props }) => {
    const baseClassName = `w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100`;
    const errorClassName = 'border-red-500 bg-red-50';
    const normalClassName = 'border-green-200 focus:border-green-400';

    return (
        <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-green-800">
                {icon && React.createElement(icon, { className: "w-4 h-4" })}
                <span>{label} {required && <span className="text-red-500">*</span>}</span>
            </label>
            {options ? (
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`${baseClassName} ${error ? errorClassName : normalClassName}`}
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
                    value={value}
                    onChange={onChange}
                    rows={4}
                    className={`${baseClassName} resize-none ${error ? errorClassName : normalClassName}`}
                    {...props}
                />
            ) : type === 'file' ? (
                <div className="relative">
                    <input type="file" name={name} onChange={onChange} accept="image/*" className="hidden" id={name} {...props} />
                    <label htmlFor={name} className={`w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-green-50 bg-slate-100 ${error ? errorClassName : 'border-green-300 hover:border-green-400'}`}>
                        <Camera className="w-5 h-5 text-green-600" />
                        <span className="text-green-700">{value ? value.name : 'Choose profile image'}</span>
                    </label>
                </div>
            ) : (
                <div className="relative">
                    <input
                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        autoComplete={type === 'password' ? 'new-password' : 'off'}
                        className={`${baseClassName} ${type === 'password' ? 'pr-12' : ''} ${error ? errorClassName : normalClassName}`}
                        {...props}
                    />
                    {type === 'password' && (
                        <button type="button" onClick={onPasswordToggle} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800">
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

const OrgInputField = React.memo(({ icon, label, name, type = 'text', required = false, value, onChange, error, ...props }) => {
    const baseClassName = `w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-slate-100`;
    const errorClassName = 'border-red-500 bg-red-50';
    const normalClassName = 'border-blue-200 focus:border-blue-400';

    return (
        <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-blue-800">
                {icon && React.createElement(icon, { className: "w-4 h-4" })}
                <span>{label} {required && <span className="text-red-500">*</span>}</span>
            </label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    rows={3}
                    className={`${baseClassName} resize-none ${error ? errorClassName : normalClassName}`}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    autoComplete="off"
                    className={`${baseClassName} ${error ? errorClassName : normalClassName}`}
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


// --- Main BuyerSignup Component ---

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
        setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    }, [errors]);

    const handleOrgInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setOrgFormData(prev => ({ ...prev, [name]: value }));
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
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.paymentOffer?.trim()) newErrors.paymentOffer = 'Payment offer is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOrgForm = () => {
        // ... validation logic for org form ...
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
        // ... org submission logic ...
    };

    if (showOrgForm) {
        // --- Organization Form JSX ---
        // This part remains the same, but you would pass props to OrgInputField
        // like value={orgFormData.organizationName}, onChange={handleOrgInputChange}, etc.
        return <div>Organization Form...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <button onClick={() => navigate('/signup')} className="inline-flex bg-green-100 items-center space-x-2 text-green-600 hover:text-green-800 mb-4 transition-colors">
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
                                <InputField icon={User} label="Full Name" name="fullName" type="text" required placeholder="Enter your full name" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} />
                                <InputField icon={Mail} label="Email Address" name="email" type="email" required placeholder="Enter your email address" value={formData.email} onChange={handleInputChange} error={errors.email} />
                                <InputField icon={MapPin} label="District" name="district" required options={districts} value={formData.district} onChange={handleInputChange} error={errors.district} />
                                <InputField icon={FileText} label="Company Name" name="companyName" required placeholder="Enter your company name" value={formData.companyName} onChange={handleInputChange} error={errors.companyName} />
                                <InputField icon={Building2} label="Company Type" name="companyType" required options={companyTypes} value={formData.companyType} onChange={handleInputChange} error={errors.companyType} />
                                <InputField icon={Phone} label="Phone Number" name="phoneNumber" required placeholder="Enter 10-digit phone number" value={formData.phoneNumber} onChange={handleInputChange} error={errors.phoneNumber} />
                            </div>
                            <InputField icon={Home} label="Company Address" name="companyAddress" type="textarea" placeholder="Enter your complete company address" value={formData.companyAddress} onChange={handleInputChange} error={errors.companyAddress} />
                            <InputField icon={Camera} label="Profile Image" name="profileImage" type="file" value={formData.profileImage} onChange={handleInputChange} error={errors.profileImage} />
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">
                                Payment Offer for Farmers
                            </h3>
                            <InputField icon={DollarSign} label="Payment Offer" name="paymentOffer" required placeholder="e.g., Rs. 100/kg for rice" value={formData.paymentOffer} onChange={handleInputChange} error={errors.paymentOffer} />
                            <InputField icon={FileText} label="Description" name="description" type="textarea" placeholder="Describe your buying interests, requirements, or any other details" value={formData.description} onChange={handleInputChange} error={errors.description} />
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">
                                Security Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Lock} label="Password" name="password" type="password" required placeholder="Enter password (min 8 characters)" value={formData.password} onChange={handleInputChange} error={errors.password} showPassword={showPassword} onPasswordToggle={() => setShowPassword(!showPassword)} />
                                <InputField icon={Lock} label="Confirm Password" name="confirmPassword" type="password" required placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleInputChange} error={errors.confirmPassword} showPassword={showConfirmPassword} onPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50">
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