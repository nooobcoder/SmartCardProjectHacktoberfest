using System;
using System.Security.Cryptography;

namespace REST.Helpers
{
    public class Password
    {
        private const Int32 SALT = 0x10;
        private const Int32 ITERATIONS = 0x3e8;
        public static string Hash(string password)
        {
            byte[] salt;
            byte[] buffer2;
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, SALT, ITERATIONS))
            {
                salt = bytes.Salt;
                buffer2 = bytes.GetBytes(0x20);
            }
            byte[] dst = new byte[0x31];
            Buffer.BlockCopy(salt, 0, dst, 1, 0x10);
            Buffer.BlockCopy(buffer2, 0, dst, 0x11, 0x20);
            return Convert.ToBase64String(dst);
        }

        public static bool Verify(string password, string hashedPassword)
        {
            byte[] buffer4;
            if (password == null)
            {
                throw new ArgumentNullException("password");
            }
            if (hashedPassword == null)
            {
                throw new ArgumentNullException("hashedPassword");
            }
            byte[] src = Convert.FromBase64String(hashedPassword);
            if ((src.Length != 0x31) || (src[0] != 0))
            {
                return false;
            }
            byte[] dst = new byte[0x10];
            Buffer.BlockCopy(src, 1, dst, 0, 0x10);
            byte[] buffer3 = new byte[0x20];
            Buffer.BlockCopy(src, 0x11, buffer3, 0, 0x20);
            using (Rfc2898DeriveBytes bytes = new Rfc2898DeriveBytes(password, dst, 0x3e8))
            {
                buffer4 = bytes.GetBytes(0x20);
            }
            return ByteArraysEqual(buffer3, buffer4);
        }

        private static bool ByteArraysEqual(byte[] buffer3, byte[] buffer4)
        {
            if (buffer3.Length != buffer4.Length)
            {
                return false;
            }
            for (int i = 0; i < buffer3.Length; i++)
            {
                if (buffer3[i] != buffer4[i])
                {
                    return false;
                }
            }
            return true;
        }
    }
}
