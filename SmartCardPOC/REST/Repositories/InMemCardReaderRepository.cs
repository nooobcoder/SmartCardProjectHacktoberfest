using System.Collections.Generic;
using Middleware;
using REST.Repositories.Interfaces;

namespace REST.Repositories
{
    public class InMemCardReaderRepository : IInMemCardReaderRepository
    {
        SmartCards obj = new SmartCards();

        public List<Dictionary<string, string>> GetCardReaders()
        {
            string[] cardReaders = obj.getReaders();
            List<Dictionary<string, string>> cardReadersDict = new List<Dictionary<string, string>> { };
            // Loop through cardReaders, and set Item.Name 
            // to the name of the card reader.
            foreach (string cardReader in cardReaders)
            {
                cardReadersDict.Add(new Dictionary<string, string> { { "name", cardReader } });
            }

            return cardReadersDict;
        }

        public string[] SendAPDU(byte[] apdu) => obj.sendAPDU(apdu);
    }
}