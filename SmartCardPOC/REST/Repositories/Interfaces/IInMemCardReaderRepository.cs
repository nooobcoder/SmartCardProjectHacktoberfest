using System.Collections.Generic;

namespace REST.Repositories.Interfaces
{
    public interface IInMemCardReaderRepository
    {
        public List<Dictionary<string, string>> GetCardReaders();
        public string[] SendAPDU(byte[] apdu);
    }
}
