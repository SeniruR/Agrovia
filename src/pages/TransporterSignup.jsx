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
    Truck,
    Gauge,
    Ruler,
    Award,
} from 'lucide-react';

const TransporterSignup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Main Transporter form data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        district: '',
        nic: '',
        birthDate: '',
        address: '',
        phoneNumber: '',
        profileImage: null,
        password: '',
        confirmPassword: '',
        // Transporter-specific fields
        vehicleType: '',
        vehicleNumber: '',
        vehicleCapacity: '',
        capacityUnit: 'kg',
        maxTravelDistance: '',
        distanceUnit: 'km',
        licenseNumber: '',
        licenseExpiry: '',
        experienceYears: '',
        additionalInfo: '',
    });

    const [errors, setErrors] = useState({});

    // Sri Lankan districts
    const districts = [
        'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha',
        'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala',
        'Mannar', 'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa',
        'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
    ];

    // Vehicle types
    const vehicleTypes = [
        'Truck',
        'Lorry',
        'Van',
        'Three Wheeler',
        'Pickup',
        'Mini Truck',
        'Other'
    ];

    // Capacity units
    const capacityUnits = ['kg', 'tons', 'liters'];

    // Distance units
    const distanceUnits = ['km', 'miles'];

    // Experience options
    const experienceOptions = [
        'Less than 1 year',
        '1-3 years',
        '3-5 years',
        '5-10 years',
        'More than 10 years'
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

    const validateForm = () => {
        const newErrors = {};

        // Required field validations
        if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        if (!formData.district) newErrors.district = 'District is required';
        if (!formData.nic?.trim()) newErrors.nic = 'NIC is required';
        if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
        if (!formData.vehicleNumber?.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
        if (!formData.vehicleCapacity) newErrors.vehicleCapacity = 'Vehicle capacity is required';
        if (!formData.maxTravelDistance) newErrors.maxTravelDistance = 'Max travel distance is required';
        if (!formData.licenseNumber?.trim()) newErrors.licenseNumber = 'License number is required';
        if (!formData.licenseExpiry) newErrors.licenseExpiry = 'License expiry date is required';
        if (!formData.experienceYears) newErrors.experienceYears = 'Experience is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // NIC validation (Sri Lankan format)
        const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
        if (formData.nic && !nicRegex.test(formData.nic)) {
            newErrors.nic = 'Please enter a valid NIC number';
        }

        // Phone number validation
        const phoneRegex = /^[0-9]{10}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        }

        // Password validation
        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Vehicle capacity validation
        if (formData.vehicleCapacity && (isNaN(formData.vehicleCapacity) || parseFloat(formData.vehicleCapacity) <= 0)) {
            newErrors.vehicleCapacity = 'Please enter a valid vehicle capacity';
        }

        // Max travel distance validation
        if (formData.maxTravelDistance && (isNaN(formData.maxTravelDistance) || parseFloat(formData.maxTravelDistance) <= 0)) {
            newErrors.maxTravelDistance = 'Please enter a valid travel distance';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Transporter registration data:', formData);
            alert('Transporter registration successful!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const InputField = React.memo(({ icon, label, name, type = 'text', required = false, options = null, ...props }) => {
        const fieldValue = formData[name] || '';

        return (
            <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-green-800">
                    {icon && React.createElement(icon, { className: "w-4 h-4" })}
                    <span>{label} {required && <span className="text-red-500">*</span>}</span>
                </label>
                {options ? (
                    <select
                        name={name}
                        value={fieldValue}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100 ${
                            errors[name] ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'
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
                        value={fieldValue}
                        onChange={handleInputChange}
                        rows={4}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 resize-none bg-slate-100 ${
                            errors[name] ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'
                        }`}
                        {...props}
                    />
                ) : type === 'file' ? (
                    <div className="relative">
                        <input
                            type="file"
                            name={name}
                            onChange={handleInputChange}
                            accept="image/*"
                            className="hidden"
                            id={name}
                            {...props}
                        />
                        <label
                            htmlFor={name}
                            className={`w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center space-x-2 transition-all duration-300 hover:bg-green-50 bg-slate-100 ${
                                errors[name] ? 'border-red-500 bg-red-50' : 'border-green-300 hover:border-green-400'
                            }`}
                        >
                            <Camera className="w-5 h-5 text-green-600" />
                            <span className="text-green-700">
                                {formData[name] ? formData[name].name : 'Choose profile image'}
                            </span>
                        </label>
                    </div>
                ) : (
                    <div className="relative">
                        <input
                            type={type === 'password' ? (name === 'password' ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')) : type}
                            name={name}
                            value={fieldValue}
                            onChange={handleInputChange}
                            autoComplete={type === 'password' ? 'new-password' : 'off'}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-slate-100 ${
                                type === 'password' ? 'pr-12' : ''
                            } ${errors[name] ? 'border-red-500 bg-red-50' : 'border-green-200 focus:border-green-400'}`}
                            {...props}
                        />
                        {type === 'password' && (
                            <button
                                type="button"
                                onClick={() => name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800"
                            >
                                {(name === 'password' ? showPassword : showConfirmPassword) ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        )}
                    </div>
                )}
                {errors[name] && (
                    <div className="flex items-center space-x-1 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors[name]}</span>
                    </div>
                )}
            </div>
        );
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/signup')}
                        className="inline-flex bg-green-100 items-center space-x-2 text-green-600 hover:text-green-800 mb-4 transition-colors duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Role Selection</span>
                    </button>
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Truck className="w-4 h-4" />
                        <span>Transporter Registration</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent mb-4">
                        Join as a Transport Partner
                    </h1>
                    <p className="text-green-700 max-w-2xl mx-auto">
                        Register to offer your logistics and transportation services to the Agrovia network.
                    </p>
                </div>

                {/* Main Form */}
                <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                            <Truck className="w-6 h-6" />
                            <span>Transporter Registration Form</span>
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Personal Details Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">
                                Personal Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField
                                    icon={User}
                                    label="Full Name"
                                    name="fullName"
                                    type="text"
                                    required
                                    placeholder="Enter your full name"
                                />
                                <InputField
                                    icon={Mail}
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField
                                    icon={MapPin}
                                    label="District"
                                    name="district"
                                    required
                                    options={districts}
                                />
                                <InputField
                                    icon={FileText}
                                    label="NIC Number"
                                    name="nic"
                                    required
                                    placeholder="Enter NIC number"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField
                                    icon={Phone}
                                    label="Phone Number"
                                    name="phoneNumber"
                                    required
                                    placeholder="Enter 10-digit phone number"
                                />
                            </div>

                            <InputField
                                icon={Home}
                                label="Address"
                                name="address"
                                type="textarea"
                                placeholder="Enter your complete address"
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField
                                    icon={Camera}
                                    label="Profile Image"
                                    name="profileImage"
                                    type="file"
                                />
                            </div>
                        </div>

                        {/* Vehicle Details Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">
                                Vehicle & Logistics Details
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField
                                    icon={Truck}
                                    label="Vehicle Type"
                                    name="vehicleType"
                                    required
                                    options={vehicleTypes}
                                />
                                <InputField
                                    icon={FileText}
                                    label="Vehicle Number"
                                    name="vehicleNumber"
                                    required
                                    placeholder="Enter vehicle registration number"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <InputField
                                            icon={Gauge}
                                            label="Vehicle Capacity"
                                            name="vehicleCapacity"
                                            required
                                            type="number"
                                            step="0.01"
                                            placeholder="Enter capacity"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <InputField
                                            label="Unit"
                                            name="capacityUnit"
                                            options={capacityUnits}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <InputField
                                            icon={Ruler}
                                            label="Max Travel Distance"
                                            name="maxTravelDistance"
                                            required
                                            type="number"
                                            step="0.1"
                                            placeholder="Enter distance"
                                        />
                                    </div>
                                    <div className="w-32">
                                        <InputField
                                            label="Unit"
                                            name="distanceUnit"
                                            options={distanceUnits}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* License & Experience Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">
                                License & Experience
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField
                                    icon={Award}
                                    label="License Number"
                                    name="licenseNumber"
                                    required
                                    placeholder="Enter your driving license number"
                                />
                                <InputField
                                    icon={Calendar}
                                    label="License Expiry Date"
                                    name="licenseExpiry"
                                    type="date"
                                    required
                                />
                            </div>
                            <InputField
                                icon={Award}
                                label="Years of Experience"
                                name="experienceYears"
                                required
                                options={experienceOptions}
                            />
                            <InputField
                                icon={FileText}
                                label="Additional Information"
                                name="additionalInfo"
                                type="textarea"
                                placeholder="Any additional info about your logistics services"
                            />
                        </div>

                        {/* Security Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">
                                Security Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField
                                    icon={Lock}
                                    label="Password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Enter password (min 8 characters)"
                                />
                                <InputField
                                    icon={Lock}
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    placeholder="Confirm your password"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
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
                                        <span>Create Transporter Account</span>
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

export default TransporterSignup;
