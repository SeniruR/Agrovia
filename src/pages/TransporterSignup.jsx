import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    User, Mail, MapPin, Phone, Calendar, Home, FileText,
    Camera, Lock, Eye, EyeOff, ArrowLeft, Check, AlertCircle,
    Truck, Gauge, Ruler, Award,
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


const TransporterSignup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // For notification banners
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Refs for each field for error scrolling
    const fieldRefs = React.useRef({});

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
        // maxTravelDistance and distanceUnit removed
        licenseNumber: '',
        licenseExpiry: '',
        // experienceYears removed
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
        'Truck', 'Lorry', 'Van', 'Three Wheeler', 'Pickup', 'Mini Truck', 'Other'
    ];

    // Capacity units
    const capacityUnits = ['kg', 'tons', 'liters'];

    // Distance units
    const distanceUnits = ['km', 'miles'];

    // Experience options
    const experienceOptions = [
        'Less than 1 year', '1-3 years', '3-5 years', '5-10 years', 'More than 10 years'
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
        if (!formData.licenseNumber?.trim()) {
            newErrors.licenseNumber = 'License number is required';
        } else {
            // License number must be at least 8 characters, first char is allowed code, rest are digits
            const allowedCodes = ['A', 'A1', 'B', 'B1', 'C', 'C1', 'CE', 'D1', 'G', 'G1', 'J', 'H'];
            let codeMatch = null;
            for (const code of allowedCodes) {
                if (formData.licenseNumber.startsWith(code)) {
                    codeMatch = code;
                    break;
                }
            }
            if (!codeMatch) {
                newErrors.licenseNumber = 'License number must start with a valid code (A, A1, B, B1, C, C1, CE, D1, G, G1, J, H)';
            } else {
                const rest = formData.licenseNumber.slice(codeMatch.length);
                if (rest.length < 7) {
                    newErrors.licenseNumber = 'License number must be at least 8 characters (code + 7+ digits)';
                } else if (!/^[0-9]+$/.test(rest)) {
                    newErrors.licenseNumber = 'License number must have digits after the code';
                }
            }
        }
        if (!formData.licenseExpiry) {
            newErrors.licenseExpiry = 'License expiry date is required';
        } else {
            // Check if license expiry is a future date
            const today = new Date();
            today.setHours(0,0,0,0); // ignore time
            const expiryDate = new Date(formData.licenseExpiry);
            if (isNaN(expiryDate.getTime())) {
                newErrors.licenseExpiry = 'Invalid expiry date';
            } else if (expiryDate <= today) {
                newErrors.licenseExpiry = 'License expiry date must be a future date';
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email address';
        const nicRegex = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
        if (formData.nic && !nicRegex.test(formData.nic)) newErrors.nic = 'Please enter a valid NIC number';
        const phoneRegex = /^[0-9]{10}$/;
        if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
        if (formData.password && formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
        // Password complexity: at least one uppercase letter, one number, and one special character
        const passwordComplexityRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])/;
        if (formData.password && !passwordComplexityRegex.test(formData.password)) newErrors.password = 'Password must include at least one uppercase letter, one number, and one special character';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (formData.vehicleCapacity && (isNaN(formData.vehicleCapacity) || parseFloat(formData.vehicleCapacity) <= 0)) newErrors.vehicleCapacity = 'Please enter a valid vehicle capacity';

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
            birth_date: formData.birthDate ?? null,
            // Transporter-specific
            vehicle_type: formData.vehicleType ?? '',
            vehicle_number: formData.vehicleNumber ?? '',
            vehicle_capacity: formData.vehicleCapacity ?? '',
            capacity_unit: formData.capacityUnit ?? '',
            license_number: formData.licenseNumber ?? '',
            license_expiry: formData.licenseExpiry ?? '',
            additional_info: formData.additionalInfo ?? ''
        };

        // Only append fields that are required and non-empty for backend validation
        const requiredFields = [
            'full_name', 'email', 'password', 'phone_number', 'district', 'nic',
            'vehicle_type', 'vehicle_number', 'vehicle_capacity', 'capacity_unit', 'license_number', 'license_expiry'
        ];
        for (const field of requiredFields) {
            if (
                mappedData[field] === undefined ||
                mappedData[field] === null ||
                mappedData[field] === ''
            ) {
                // Map backend field to frontend field name for error state and ref
                const fieldMap = {
                    full_name: 'fullName',
                    email: 'email',
                    password: 'password',
                    phone_number: 'phoneNumber',
                    district: 'district',
                    nic: 'nic',
                    vehicle_type: 'vehicleType',
                    vehicle_number: 'vehicleNumber',
                    vehicle_capacity: 'vehicleCapacity',
                    capacity_unit: 'capacityUnit',
                    license_number: 'licenseNumber',
                    license_expiry: 'licenseExpiry',
                };
                const frontendField = fieldMap[field] || field;
                setErrors(prev => ({ ...prev, [frontendField]: 'This field is required' }));
                setErrorMessage(`Field "${field}" is required and missing or invalid.`);
                setIsLoading(false);
                // Scroll to the relevant input field if ref exists
                setTimeout(() => {
                    if (fieldRefs.current[frontendField] && fieldRefs.current[frontendField].scrollIntoView) {
                        fieldRefs.current[frontendField].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }, 100);
                return;
            }
        }

        // Prepare form data for file upload
        const data = new FormData();
        Object.entries(mappedData).forEach(([key, value]) => {
            if (requiredFields.includes(key)) {
                data.append(key, value);
            } else {
                if (value !== undefined && value !== null && value !== '') {
                    data.append(key, value);
                }
            }
        });

        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/register/transporter', data, {
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
            let transporterUserId = null;
            if (result.data && result.data.user) {
                transporterUserId = result.data.user.id;
                // Do not auto-login. Only show success and redirect to login page.
            }
            // Create disable_account row for transporter (case_id = 3)
            if (transporterUserId) {
                try {
                    await axios.post('http://localhost:5000/api/v1/disable-accounts', {
                        user_id: transporterUserId,
                        case_id: 3,
                        reason: 'Transporter registration pending review',
                    });
                } catch (disableErr) {
                    // Not critical, just log
                    console.warn('Failed to create disable_account row:', disableErr);
                }
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
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <span>{errorMessage}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                            <Truck className="w-6 h-6" />
                            <span>Transporter Registration Form</span>
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
                            <InputField icon={Home} label="Address" name="address" type="textarea" placeholder="Enter your complete address" value={formData.address} error={errors.address} onChange={handleInputChange} inputRef={el => fieldRefs.current['address'] = el} />
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Camera} label="Profile Image" name="profileImage" type="file" value={formData.profileImage} error={errors.profileImage} onChange={handleInputChange} inputRef={el => fieldRefs.current['profileImage'] = el} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">Vehicle & Logistics Details</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Truck} label="Vehicle Type" name="vehicleType" required options={vehicleTypes} value={formData.vehicleType} error={errors.vehicleType} onChange={handleInputChange} inputRef={el => fieldRefs.current['vehicleType'] = el} />
                                <InputField icon={FileText} label="Vehicle Number" name="vehicleNumber" required placeholder="Enter vehicle registration number" value={formData.vehicleNumber} error={errors.vehicleNumber} onChange={handleInputChange} inputRef={el => fieldRefs.current['vehicleNumber'] = el} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <InputField icon={Gauge} label="Vehicle Capacity" name="vehicleCapacity" required type="number" step="0.01" placeholder="Enter capacity" value={formData.vehicleCapacity} error={errors.vehicleCapacity} onChange={handleInputChange} inputRef={el => fieldRefs.current['vehicleCapacity'] = el} />
                                    </div>
                                    <div className="w-32">
                                        <InputField label="Unit" name="capacityUnit" options={capacityUnits} value={formData.capacityUnit} error={errors.capacityUnit} onChange={handleInputChange} inputRef={el => fieldRefs.current['capacityUnit'] = el} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-green-800 border-b border-green-200 pb-2">License & Experience</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Award} label="License Number" name="licenseNumber" required placeholder="Enter your driving license number" value={formData.licenseNumber} error={errors.licenseNumber} onChange={handleInputChange} inputRef={el => fieldRefs.current['licenseNumber'] = el} />
                                <InputField icon={Calendar} label="License Expiry Date" name="licenseExpiry" type="date" required value={formData.licenseExpiry} error={errors.licenseExpiry} onChange={handleInputChange} inputRef={el => fieldRefs.current['licenseExpiry'] = el} />
                            </div>
                            <InputField icon={FileText} label="Additional Information" name="additionalInfo" type="textarea" placeholder="Any additional info about your logistics services" value={formData.additionalInfo} error={errors.additionalInfo} onChange={handleInputChange} inputRef={el => fieldRefs.current['additionalInfo'] = el} />
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