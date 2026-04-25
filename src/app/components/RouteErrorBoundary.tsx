import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

export default function RouteErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage = "An unexpected error occurred.";
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {errorStatus === 404 ? "Page Not Found" : "Oops! Something went wrong."}
        </h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          {errorStatus === 404 
            ? "The page you are looking for doesn't exist or has been moved."
            : errorMessage}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => window.location.reload()} 
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
          <Link 
            to="/" 
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
