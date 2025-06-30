import React, { useState } from 'react';
import { MapPin, FileText, Building2, Landmark } from 'lucide-react';

const FarmerOrgForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    orgName: '',
    address: '',
    area: '',
    proofDoc: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for the field
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleNext = () => {
    const newErrors = {};
    if (!formData.orgName.trim()) newErrors.orgName = 'Organization name is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.area.trim()) newErrors.area = 'Area of operation is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.proofDoc) {
      newErrors.proofDoc = 'Please upload a valid proof document.';
    } else if (!['application/pdf', 'image/jpeg', 'image/png'].includes(formData.proofDoc.type)) {
      newErrors.proofDoc = 'Accepted formats: PDF, JPG, JPEG, PNG.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Submitting:', formData);
    alert('Organization submitted successfully!');
  };

  // Progress bar (unchanged)
  const FormProgressBar = ({ currentStep, steps }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((label, index) => {
          const stepNum = index + 1;
          return (
            <div
              key={stepNum}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-all duration-300 ${
                stepNum < currentStep
                  ? 'bg-green-500 border-green-500 text-white'
                  : stepNum === currentStep
                  ? 'bg-green-600 border-green-600 text-white scale-110'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              {stepNum}
            </div>
          );
        })}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-black mt-3 font-medium">
        {steps.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-10 px-4 sm:px-6 bg-white p-6 rounded-xl shadow-md mt-10 mb-10" style={{placeSelf: 'center'}}>
      <h2 className="text-2xl font-bold text-green-700 mb-2">Create Farmer Organization</h2>
        <p className="text-gray-600 text-sm mb-6">
        Register your farmer organization to access Agrovia’s marketplace, crop tracking, and support tools. Fill out your details to get started.
        </p>
      <FormProgressBar currentStep={step} steps={['Organization Details', 'Proof Document']} />
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            {/* Organization Name */}
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="orgName"
                placeholder="Organization Name"
                value={formData.orgName}
                onChange={handleChange}
                className={`bg-white w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 ${
                  errors.orgName
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-green-300 focus:border-green-500'
                }`}
              />
              {errors.orgName && <p className="text-red-600 text-sm mt-1">{errors.orgName}</p>}
            </div>

            {/* Address */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className={`bg-white w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 ${
                  errors.address
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-green-300 focus:border-green-500'
                }`}
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Area */}
            <div className="relative">
              <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="area"
                placeholder="Area of Operation"
                value={formData.area}
                onChange={handleChange}
                className={`bg-white w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 ${
                  errors.area
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-green-300 focus:border-green-500'
                }`}
              />
              {errors.area && <p className="text-red-600 text-sm mt-1">{errors.area}</p>}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {/* File upload */}
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="file"
                name="proofDoc"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 ${
                  errors.proofDoc
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-green-300 focus:border-green-500'
                }`}
              />
              {errors.proofDoc && <p className="text-red-600 text-sm mt-1">{errors.proofDoc}</p>}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FarmerOrgForm;
