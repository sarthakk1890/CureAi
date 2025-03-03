export const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
        <span className="ml-2">Please wait...</span>
    </div>
);