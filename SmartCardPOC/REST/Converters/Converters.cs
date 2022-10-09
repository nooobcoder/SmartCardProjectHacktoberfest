using System;

namespace REST.Converters
{
    public class Converters
    {
        public static string HexStringToText(string hexString)
        {
            string text = "";
            string[] hexValuesSplit = hexString.Split(' ');
            foreach (string hex in hexValuesSplit)
            {
                int value = Convert.ToInt32(hex, 16);
                string stringValue = char.ConvertFromUtf32(value);
                char charValue = (char)value;
                text += charValue;
            }

            return text;
        }
    }
}
