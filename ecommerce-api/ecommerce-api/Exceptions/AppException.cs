namespace ecommerce_api.Exceptions
{
    // Domain-level failure with an intended HTTP status code.
    // Controllers catch this; anything else bubbles to the global handler.
    public class AppException : Exception
    {
        public int StatusCode { get; }

        public AppException(string message, int statusCode = 400) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}
