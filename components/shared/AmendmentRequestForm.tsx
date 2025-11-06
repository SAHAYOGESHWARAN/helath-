import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEMRIntegration } from '../../hooks/useEMRIntegration';
import { Card } from './Card';

interface AmendmentRequestFormProps {
  patientId: string;
  recordId: string;
  recordType: string;
}

const AmendmentRequestForm: React.FC<AmendmentRequestFormProps> = ({ patientId, recordId, recordType }) => {
  const { requestAmendment } = useEMRIntegration();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      reason: '',
      description: '',
    },
    validationSchema: Yup.object({
      reason: Yup.string().required('Reason is required'),
      description: Yup.string().required('Description is required'),
    }),
    onSubmit: async (values) => {
      if (requestAmendment) {
        await requestAmendment(patientId, recordId, values.reason, values.description);
        setIsSubmitted(true);
      }
    },
  });

  if (isSubmitted) {
    return (
      <Card>
        <p className="text-green-500">Amendment request submitted successfully.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold">Request Amendment</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-4">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Reason
          </label>
          <input
            id="reason"
            name="reason"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.reason}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {formik.touched.reason && formik.errors.reason ? (
            <div className="text-red-500 text-sm">{formik.errors.reason}</div>
          ) : null}
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-sm">{formik.errors.description}</div>
          ) : null}
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit Request
          </button>
        </div>
      </form>
    </Card>
  );
};

export default AmendmentRequestForm;