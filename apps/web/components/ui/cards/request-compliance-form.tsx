import { useState, useRef } from "react";
import { Card } from "../card";
import { Icons } from "../icons";

interface RequestComplianceFormProps {
  onSubmit: (data: {
    shortName: string;
    longName: string;
    briefDescription: string;
    region: string;
    industry: string;
  }) => Promise<void>;
}

export function RequestComplianceForm({
  onSubmit,
}: RequestComplianceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit({
        shortName: formData.get("shortName") as string,
        longName: formData.get("longName") as string,
        briefDescription: formData.get("briefDescription") as string,
        region: formData.get("region") as string,
        industry: formData.get("industry") as string,
      });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to submit request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "success") {
    return (
      <Card className="shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Icons.check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Request Submitted
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your compliance request has been recorded and will be reviewed.
              </p>
            </div>
          </div>
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            <p>We'll notify you once your request has been processed.</p>
            <p className="mt-2">Reference ID: {Date.now().toString(36)}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-md">
            <Icons.bot className="w-4 h-4 mr-1.5" />
            Request Compliance
          </span>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fill out the form below to request new compliance information
          </p>
        </div>

        {status === "error" && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <Icons.x className="w-4 h-4" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="shortName"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Short Name
              </label>
              <input
                type="text"
                name="shortName"
                id="shortName"
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="e.g., HIPAA"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="longName"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Long Name
              </label>
              <input
                type="text"
                name="longName"
                id="longName"
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="e.g., Health Insurance Portability and Accountability Act"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="briefDescription"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Brief Description
            </label>
            <textarea
              name="briefDescription"
              id="briefDescription"
              required
              disabled={isSubmitting}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="Describe the compliance standard..."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="region"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Region
              </label>
              <input
                type="text"
                name="region"
                id="region"
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="e.g., United States"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="industry"
                className="text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                Industry
              </label>
              <input
                type="text"
                name="industry"
                id="industry"
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="e.g., Healthcare"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </form>
      </div>
    </Card>
  );
}
