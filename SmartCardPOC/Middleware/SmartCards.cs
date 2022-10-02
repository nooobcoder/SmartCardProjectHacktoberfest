using Infineon.NGTF.Adapters;
using Infineon.NGTF.Common;
using Infineon.NGTF.Protocols;
using Infineon.TestEnvironment;
using PCSC;
using System;
using System.Collections.Generic;

namespace Middleware
{
    public class SmartCards
    {
        CommandApdu commandApdu;
        ResponseApdu responseApdu;
        CardInterface cardInterface;

        // Constructor
        public SmartCards()
        {
            cardInterface = CardInterface.GetInstance();
            string[] readers = getReaders();
            if (readers.Length == 0)
            {
                Console.WriteLine("No readers found.");
                return;
            }
            else
            {
                Console.WriteLine("Found readers:");
                foreach (string reader in readers)
                {
                    Console.WriteLine(reader);
                }
            }
            //commandApdu = new CommandApdu(ByteUtility.ConvertHexStringToByteArray("00A4040C07A000000247100101"));
            //responseApdu = cardInterface.TransmitApdu(commandApdu);

            //dynamic sw = responseApdu.SW;
            //Console.WriteLine("SW Selecting Applet: " + $"0x{sw:X}");
        }

        public string[] getReaders()
        {
            var contextFactory = ContextFactory.Instance;
            using (var context = contextFactory.Establish(SCardScope.System))
            {
                Console.WriteLine($"Currently connected readers: ");
                CardInterface cardInterface = CardInterface.GetInstance();

                var readerNames = context.GetReaders();

                return readerNames;
            }
        }

        public string[] sendAPDU(byte[] apduBytes)
        {
            CommandApdu commandApdu = new CommandApdu(apduBytes);
            ResponseApdu responseApdu = null;
            dynamic sw = ""; // Stores the status word as a hex string. Eg: 0x9000 (9000 is success)

            for (int a = 0; a < 2; ++a)
            {
                try
                {
                    string readerName = cardInterface.GetReaderName();
                    Console.WriteLine($"Sending APDU to PC/SC: {readerName}");
                    // Check if sw is '0xFFFF', then retry sending the APDU
                    responseApdu = cardInterface.TransmitApdu(commandApdu);
                    sw = responseApdu.SW; // swDecimal will store SW (Status Bytes) in decimal notation.
                    // Convert swDecimal to Hexadecimal String
                    sw = $"0x{sw:X}";

                    if (sw == "0xFFFF")
                    {
                        // Retry sending the APDU
                        Console.WriteLine(
                            "============ SW=0x7777: CARD MIGHT BE REMOVED, RETRYING BY 'RESET CARD' ==========="
                        );

                        // Add delay of 1 second
                        System.Threading.Thread.Sleep(3000);
                        cardInterface.ResetCard();
                    }
                    else
                        break;
                }
                catch (AdapterException e)
                {
                    Console.WriteLine("Exception");
                    Console.WriteLine(e.Message);
                    continue;
                }
                catch (KeyNotFoundException e)
                {
                    Console.WriteLine("Exception");
                    Console.WriteLine(e.Message);
                    continue;
                }
            }

            try
            {
                byte[] res = responseApdu.Data.ToArray();
                byte[] swBytes = new byte[2];
                swBytes[0] = responseApdu.SW1;
                swBytes[1] = responseApdu.SW2;

                Console.WriteLine("Success");
                Console.WriteLine(
                    "Res From card = " + ByteUtility.ConvertByteArrayToHexString(res)
                );
                Console.WriteLine("SW = " + sw);
                switch (sw)
                {
                    case "0xFFFF":
                        return new String[]
                        {
                            "[🔌] The 💳 has been removed, so further communication is not possible.",
                            sw
                        };
                    default:
                        return new String[] { ByteUtility.ConvertByteArrayToHexString(res), sw };
                }

                return new String[] { ByteUtility.ConvertByteArrayToHexString(res), sw };
            }
            catch (Exception e)
            {
                cardInterface = CardInterface.GetInstance();
                Console.WriteLine("Exception");
                Console.WriteLine(e.Message);
                return new String[] { e.Message, "FFFF" };
            }

            //return ByteUtility.ConvertByteArrayToHexString(res);
            //return ByteUtility.ConvertByteArrayToHexString(swBytes);
            //return sw;

            /*
             Return JSON
            {
                response:{
                    message:{"jsdhfhsdf"}
                },
                status:{
                    code:"0x9000",
                    message:"Success"
                }
            }
             */
        }
    }
}
