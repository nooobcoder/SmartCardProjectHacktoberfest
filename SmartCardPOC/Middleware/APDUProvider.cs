namespace Middleware
{
    // Simple accessor class to provide APDU commands to the webapi.
    public class APDUProvider
    {
        private const string CREATE_FILE_APDU = "00E0000017621580020200820101830201108602B0008801808A0105";
        private const string UPDATE_BINARY_APDU = "00D6000008494E46494E454F4E";
        private const string READ_BINARY_APDU = "00B0000008";
        private const string DELETE_FILE_APDU = "00 E4 02 00 02 01 10";
        private const string SELECT_FILE_APDU = "00 A4 02 0C 02 01 10 00";

        // This sanitizes the APDUs by removing the spaces in the string
        private static string SanitizeAPDU(string APDU) => APDU.Replace(" ", "");

        // Getters
        public static string GetCreateFileAPDU() => SanitizeAPDU(CREATE_FILE_APDU);
        public static string GetUpdateBinaryAPDU() => SanitizeAPDU(UPDATE_BINARY_APDU);
        public static string GetReadBinaryAPDU() => SanitizeAPDU(READ_BINARY_APDU);
        public static string GetDeleteFileAPDU() => SanitizeAPDU(DELETE_FILE_APDU);
        public static string GetSelectFileAPDU() => SanitizeAPDU(SELECT_FILE_APDU);
    }
}
