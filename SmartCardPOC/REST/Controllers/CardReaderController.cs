using Infineon.NGTF.Common;
using Microsoft.AspNetCore.Mvc;
using Middleware;
using Newtonsoft.Json;
using REST.Entities;
using REST.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace REST.Controllers
{
    [ApiController]
    [Route("readers")]
    public class CardReaderController : ControllerBase
    {
        private readonly IInMemCardReaderRepository _readerRepository;

        public CardReaderController(IInMemCardReaderRepository readerRepository)
        {
            _readerRepository = readerRepository;
        }

        [HttpGet]
        public List<Dictionary<string, string>> GetReaders() => _readerRepository.GetCardReaders();

        // POST /SendAPDU
        [HttpPost("SendAPDU")]
        //public ActionResult GetAPDUString([FromBody] object? name)
        public async Task<ActionResult> GetAPDUString([FromBody] APDU o)
        {
            Console.WriteLine(JsonConvert.SerializeObject(o));

            try
            {
                string[] returnData = _readerRepository.SendAPDU(
                    new byte[4] { 0x00, 0xa4, 0x04, 0x00 }
                );

                var bob = new
                {
                    response = new { message = returnData[0] },
                    status = new { code = returnData[1] },
                };

                // Convert bob to JSON
                var json = JsonConvert.SerializeObject(bob);
                return Content(json, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("CreateFile")]
        public async Task<ActionResult> CreateFile([FromBody] APDU o)
        {
            Console.WriteLine(JsonConvert.SerializeObject(o));
            //00 E0 00 00 17 62 15 80 02 02 00 82 01 01 83 02 0110 86 02 B0 00 88 01 80 8A0105
            //new byte[28] { 0x00, 0xE0, 0x00, 0x00, 0x17, 0x62, 0x15, 0x80, 0x02, 0x02, 0x00, 0x82, 0x01, 0x01, 0x83, 0x02, 0x01, 0x10, 0x86, 0x02, 0xB0, 0x00, 0x88, 0x01, 0x80, 0x8A, 0x01, 0x05 });

            // Select APPLET
            //_readerRepository.SendAPDU(ByteUtility.ConvertHexStringToByteArray("00A4040C07A000000247100100"));
            //return _readerRepository.SendAPDU(ByteUtility.ConvertHexStringToByteArray("00E0000017621580020200820101830201108602B0008801808A0105"));

            try
            {
                string[] returnData = _readerRepository.SendAPDU(
                    ByteUtility.ConvertHexStringToByteArray(APDUProvider.GetCreateFileAPDU())
                );

                var bob = new
                {
                    response = new { message = returnData[0] },
                    status = new { code = returnData[1] },
                };

                var json = JsonConvert.SerializeObject(bob);
                return Content(json, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("UpdateBinary")]
        public async Task<ActionResult> UpdateBinary([FromBody] APDU o)
        {
            Console.WriteLine(JsonConvert.SerializeObject(o));
            //return _readerRepository.SendAPDU(ByteUtility.ConvertHexStringToByteArray("00D6000003112233"));

            try
            {
                string[] returnData = _readerRepository.SendAPDU(
                    ByteUtility.ConvertHexStringToByteArray(APDUProvider.GetUpdateBinaryAPDU())
                );

                var bob = new
                {
                    response = new { message = returnData[0] },
                    status = new { code = returnData[1] },
                };

                var json = JsonConvert.SerializeObject(bob);
                return Content(json, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("SelectFile")]
        public async Task<ActionResult> SelectFile([FromBody] APDU o)
        {
            Console.WriteLine(JsonConvert.SerializeObject(o));
            try
            {
                string[] returnData = _readerRepository.SendAPDU(
                    ByteUtility.ConvertHexStringToByteArray(APDUProvider.GetSelectFileAPDU())
                );

                var bob = new
                {
                    response = new { message = returnData[0] },
                    status = new { code = returnData[1] },
                };

                var json = JsonConvert.SerializeObject(bob);
                return Content(json, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("ReadBinary")]
        public async Task<ActionResult> ReadBinary([FromBody] APDU o)
        {
            Console.WriteLine(JsonConvert.SerializeObject(o));
            //return _readerRepository.SendAPDU(ByteUtility.ConvertHexStringToByteArray("00B0000000"));

            try
            {
                string[] returnData = _readerRepository.SendAPDU(
                    ByteUtility.ConvertHexStringToByteArray(APDUProvider.GetReadBinaryAPDU())
                );

                var bob = new
                {
                    response = new { message = returnData[0] },
                    status = new { code = returnData[1] },
                };

                var json = JsonConvert.SerializeObject(bob);
                return Content(json, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("DeleteFile")]
        public async Task<ActionResult> DeleteFile([FromBody] APDU o)
        {
            Console.WriteLine(JsonConvert.SerializeObject(o));
            //return _readerRepository.SendAPDU(ByteUtility.ConvertHexStringToByteArray("00E40200020110"));

            try
            {
                string[] returnData = _readerRepository.SendAPDU(
                    ByteUtility.ConvertHexStringToByteArray(APDUProvider.GetDeleteFileAPDU())
                );

                var bob = new
                {
                    response = new { message = returnData[0] },
                    status = new { code = returnData[1] },
                };

                var json = JsonConvert.SerializeObject(bob);
                return Content(json, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("ConvertHexToString")]
        public async Task<ActionResult> ConvertHexToString([FromBody] APDU o)
        {
            string hex = o.apdu;

            try
            {
                var bob = new
                {
                    encoded = hex,
                    decoded = Converters.Converters.HexStringToText(hex)
                };
                var json = JsonConvert.SerializeObject(bob);
                return Content(json, "application/json");
            }
            catch (Exception ex)
            {
                var bob = new { encoded = hex, decoded = ex.Message };
                var json = JsonConvert.SerializeObject(bob);
                return StatusCode(500, ex.Message);
            }
        }
    }
}
